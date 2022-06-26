import React from "react";
import { render, screen, act, cleanup } from "@testing-library/react";
import { mfaBaseUrl } from "api";
import { mfaSecurityMessages } from "utils/MessageCatalog";
import { mockApiData, windowMatchMediaMock } from "utils/TestUtils";
import { MessageProvider } from "StyleGuide/Components";

import SMSChallenge from "./SMSChallenge";

const phones = [
  {
    id: 123,
    name: "primary",
    default: true,
    defaultChallengeType: "SMSAuthentication",
    registeredForIvr: true,
    registeredForSms: true,
    number: "1231231234"
  },
  {
    id: 321,
    name: "not primary",
    default: false,
    defaultChallengeType: "SMSAuthentication",
    registeredForIvr: true,
    registeredForSms: true,
    number: "3213214321"
  }
];

const defaultProps = {
  rsaHeaders: { a: 1 },
  onCancel: jest.fn(),
  onSuccess: jest.fn(),
  forceChallengeQuestion: jest.fn()
};

const renderComponent = (props = {}) =>
  render(
    <MessageProvider>
      <SMSChallenge {...defaultProps} {...props} />
    </MessageProvider>
  );

describe("Test SMS Challenge", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });
  afterEach(() => {
    cleanup();
  });

  it(">> Should render and switch between forms", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/phones`,
        results: { phones }
      },
      {
        url: `${mfaBaseUrl}/challenges/forceChallenge`,
        results: {
          asyncAuthenticationStatus: "VerificationCodeSent"
        },
        method: "POST"
      }
    ]);

    await act(async () => renderComponent());
    const { findByText, getByText, getByLabelText } = screen;

    getByText("Send code via");
    expect(getByLabelText("SMS text message").checked).toBeTruthy();
    expect(getByLabelText("Automated phone call").checked).toBeFalsy();
    expect(getByLabelText("Mobile device number").value).toEqual(
      "XXX-XXX-1234"
    );
    expect(getByLabelText("Device name").value).toEqual("primary");

    const sendCodeButton = getByText("Send code");
    await act(async () => {
      fireEvent.click(sendCodeButton);
    });
    getByText("Enter your six-digit code");

    const changeButton = await findByText("Change contact method");
    await act(async () => {
      fireEvent.click(changeButton);
    });
    getByText("Send code via");
  });

  it(">> Should onCancel when the cancel button on is clicked on either form", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/phones`,
        results: { phones }
      },
      {
        url: `${mfaBaseUrl}/challenges/forceChallenge`,
        results: {
          asyncAuthenticationStatus: "VerificationCodeSent"
        },
        method: "POST"
      }
    ]);
    const onCancel = jest.fn();
    await act(async () => renderComponent({ onCancel }));
    const { getByText, findByText } = screen;

    const methodCancelButton = getByText("Cancel");
    await act(async () => {
      fireEvent.click(methodCancelButton);
    });
    expect(onCancel).toBeCalledTimes(1);

    const sendCodeButton = getByText("Send code");
    await act(async () => {
      fireEvent.click(sendCodeButton);
    });
    await findByText("Enter your six-digit code");

    const sendCodeCancelButton = getByText("Cancel");
    await act(async () => {
      fireEvent.click(sendCodeCancelButton);
    });
    expect(onCancel).toBeCalledTimes(2);
  });

  it(">> Should display an error message and try again button if the API fails to retrieve a phone number", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/phones`,
        error: "MFA error"
      }
    ]);
    await act(async () => renderComponent());
    const { getByText } = screen;

    const errorMessage = getByText(mfaSecurityMessages.MSG_RB_AUTH_042);
    const button = getByText("Try again");
    expect(errorMessage).toBeVisible();
    expect(button).toBeVisible();
  });

  it(">> Should force challenge questions if no phones are returned", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/phones`,
        results: {}
      }
    ]);
    const forceChallengeQuestion = jest.fn();
    await act(async () => renderComponent({ forceChallengeQuestion }));

    expect(forceChallengeQuestion).toBeCalledTimes(1);
  });

  it(">> Should force challenge questions if no default phone exists", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/phones`,
        results: {
          phones: [
            {
              id: 321,
              name: "not default",
              default: false
            }
          ]
        }
      }
    ]);
    const forceChallengeQuestion = jest.fn();
    await act(async () => renderComponent({ forceChallengeQuestion }));

    expect(forceChallengeQuestion).toBeCalledTimes(1);
  });

  it(">> Should force challenge questions if default phone is not registered", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/phones`,
        results: {
          phones: [
            {
              id: 321,
              name: "not registered",
              default: true,
              registeredForIvr: false,
              registeredForSms: false
            }
          ]
        }
      }
    ]);
    const forceChallengeQuestion = jest.fn();
    await act(async () => renderComponent({ forceChallengeQuestion }));

    expect(forceChallengeQuestion).toBeCalledTimes(1);
  });
});
