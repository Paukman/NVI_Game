import React from "react";
import { render, screen, act, cleanup } from "@testing-library/react";
import { mockApiData, windowMatchMediaMock } from "utils/TestUtils";
import { mfaBaseUrl } from "api";
import { mfaSecurityMessages } from "utils/MessageCatalog";
import { MessageProvider } from "StyleGuide/Components";

import ChooseMethodForm from "./ChooseMethodForm";

const phoneResults = {
  phones: [
    {
      id: 123,
      name: "primary",
      default: true,
      defaultChallengeType: "SMSAuthentication",
      registeredForIvr: true,
      registeredForSms: true,
      number: "1231231234"
    }
  ]
};

const defaultProps = {
  rsaHeaders: { a: 1 },
  phone: phoneResults.phones[0],
  setSelectedMethod: jest.fn(),
  fetchPhones: jest.fn(),
  onSuccess: jest.fn(),
  onCancel: jest.fn()
};

const renderComponent = (props = {}) =>
  render(
    <MessageProvider>
      <ChooseMethodForm {...defaultProps} {...props} />
    </MessageProvider>
  );

describe("Test SMS Challenge ChooseMethodForm", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });
  afterEach(() => {
    cleanup();
  });

  it(">> Should Render SMS challenge with the default values rendered", async () => {
    await act(async () => renderComponent());
    const { getByText, getByLabelText } = screen;

    await getByText("Send code via");
    expect(getByLabelText("SMS text message").checked).toBeTruthy();
    expect(getByLabelText("Automated phone call").checked).toBeFalsy();
    expect(getByLabelText("Mobile device number").value).toEqual("1231231234");
    expect(getByLabelText("Device name").value).toEqual("primary");
  });

  it(">> Should call onCancel if the user cancels out of the form", async () => {
    const onCancel = jest.fn();
    await act(async () => renderComponent({ onCancel }));
    const { findByText } = screen;

    const cancelButton = await findByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    expect(onCancel).toBeCalledTimes(1);
  });

  it(">> Should display an error message and try again button if there is a phone error", async () => {
    await act(async () => renderComponent({ phoneError: "This is an error" }));
    const { getByText } = screen;

    expect(getByText("This is an error")).toBeVisible();
    expect(getByText("Try again")).toBeVisible();
  });

  it(">> Should refetch phones if the try again button is clicked", async () => {
    const fetchPhones = jest.fn();
    await act(async () =>
      renderComponent({ fetchPhones, phoneError: "This is an error" })
    );
    const { getByText } = screen;

    const tryAgainButton = getByText("Try again");
    await act(async () => {
      fireEvent.click(tryAgainButton);
    });
    expect(fetchPhones).toBeCalledTimes(1);
  });

  it(">> Should call setMethod and onSuccess if the user submits the form", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/forceChallenge`,
        results: { asyncAuthenticationStatus: "VerificationCodeSent" },
        method: "POST"
      }
    ]);
    const onSuccess = jest.fn();
    const setSelectedMethod = jest.fn();
    await act(async () => renderComponent({ setSelectedMethod, onSuccess }));

    const { getByText } = screen;
    const sendCodeButton = getByText("Send code");
    await act(async () => {
      fireEvent.click(sendCodeButton);
    });
    expect(setSelectedMethod).toBeCalledWith({
      label: "SMS text message",
      type: "SMSAuthentication",
      value: "SMS",
      msg: "text message"
    });
    expect(onSuccess).toBeCalledTimes(1);
  });

  it(">> Should call setMethod and onSuccess if the user submits the form with proper params if method is changed", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/forceChallenge`,
        results: { asyncAuthenticationStatus: "VerificationCodeSent" },
        method: "POST"
      }
    ]);

    const onSuccess = jest.fn();
    const setSelectedMethod = jest.fn();
    await act(async () => renderComponent({ setSelectedMethod, onSuccess }));
    const { getByLabelText, getByText } = screen;

    const phoneCall = getByLabelText("Automated phone call");
    await act(async () => {
      fireEvent.click(phoneCall);
    });

    const sendCodeButton = getByText("Send code");
    await act(async () => {
      fireEvent.click(sendCodeButton);
    });

    expect(setSelectedMethod).toBeCalledWith({
      value: "PhoneCall",
      label: "Automated phone call",
      type: "PhonePadAuthentication",
      msg: "phone call"
    });
    expect(onSuccess).toBeCalledTimes(1);
  });

  it(">> Should display an error and not change forms if verification code is not sent", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/forceChallenge`,
        results: { asyncAuthenticationStatus: "NotSent" },
        method: "POST"
      }
    ]);

    const onSuccess = jest.fn();
    await act(async () => renderComponent({ onSuccess }));
    const { findByText, getByText } = screen;

    const sendCodeButton = getByText("Send code");
    await act(async () => {
      fireEvent.click(sendCodeButton);
    });
    await findByText(mfaSecurityMessages.MSG_RB_AUTH_043);
    expect(onSuccess).toBeCalledTimes(0);
  });

  it(">> Should display an error and not change forms if there is an API error sending the code", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/forceChallenge`,
        error: "Sending code error",
        method: "POST"
      }
    ]);

    const onSuccess = jest.fn();
    await act(async () => renderComponent({ onSuccess }));
    const { findByText, getByText } = screen;

    const sendCodeButton = getByText("Send code");
    await act(async () => {
      fireEvent.click(sendCodeButton);
    });
    await findByText(mfaSecurityMessages.MSG_RB_AUTH_043);
    expect(onSuccess).toBeCalledTimes(0);
  });
});
