import React from "react";
import { render, screen, act, cleanup, waitFor } from "@testing-library/react";
import { mockApiData, windowMatchMediaMock } from "utils/TestUtils";
import { mfaBaseUrl } from "api";
import { mfaSecurityMessages } from "utils/MessageCatalog";
import { MessageProvider } from "StyleGuide/Components";

import EnterCodeForm from "./EnterCodeForm";

const phone = {
  id: 123,
  name: "primary",
  default: true,
  defaultChallengeType: "SMSAuthentication",
  registeredForIvr: true,
  registeredForSms: true,
  number: "1231231234"
};

const method = {
  value: "SMS",
  label: "SMS text message",
  type: "SMSAuthentication",
  msg: "text message"
};

const defaultProps = {
  phone,
  method,
  rsaHeaders: { a: 1 },
  changeMethod: jest.fn(),
  onSuccess: jest.fn()
};

const renderComponent = (props = {}) =>
  render(
    <MessageProvider>
      <EnterCodeForm {...defaultProps} {...props} />
    </MessageProvider>
  );

describe("Test SMS Challenge EnterCodeForm", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });
  afterEach(() => {
    cleanup();
  });

  it(">> Should Render SMS challenge with the default values rendered", async () => {
    await act(async () => renderComponent());
    const { getByText } = screen;
    await getByText("Enter your six-digit code");
  });

  it(">> Should call onCancel if the user cancels out of the form", async () => {
    const onCancel = jest.fn();
    await act(async () => renderComponent({ onCancel }));
    const { findByText } = screen;

    const cancelButton = await findByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    expect(onCancel).toBeCalled();
  });

  it(">> Should call changeMethod if the user wants to change the method", async () => {
    const changeMethod = jest.fn();
    await act(async () => renderComponent({ changeMethod }));
    const { findByText } = screen;
    const changeMethodButton = await findByText("Change contact method");
    await act(async () => {
      fireEvent.click(changeMethodButton);
    });
    expect(changeMethod).toBeCalled();
  });

  it(">> Should resend code if user click send code", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/forceChallenge`,
        results: {
          asyncAuthenticationStatus: "VerificationCodeSent"
        },
        method: "POST"
      }
    ]);

    await act(async () => renderComponent());
    const { findByText } = screen;

    const sendCodeButton = await findByText("Send new code");
    await act(async () => {
      fireEvent.click(sendCodeButton);
    });

    const successMessage = await findByText(
      "We've sent the code to primary by text message."
    );
    expect(successMessage).toBeTruthy();
  });

  it(">> Should call onSuccess if verification form properly set", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/verifyCode`,
        results: { status: "Success" },
        method: "POST"
      }
    ]);
    const onSuccess = jest.fn();
    await act(async () => renderComponent({ onSuccess }));
    const { findByText, findByLabelText } = screen;

    const codeInput = await findByLabelText("Enter your six-digit code");
    await act(async () => {
      fireEvent.change(codeInput, { target: { value: "123456" } });
    });
    const submitButton = await findByText("Submit code");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => expect(onSuccess).toBeCalled());
  });

  it(">> Should display a field error if no code is entered", async () => {
    const onSuccess = jest.fn();
    await act(async () => renderComponent({ onSuccess }));
    const { findByText } = screen;

    const submitButton = await findByText("Submit code");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const errorMsg = await findByText(mfaSecurityMessages.MSG_RB_AUTH_040);
    expect(errorMsg).toBeVisible();
    expect(onSuccess).not.toBeCalled();
  });

  it(">> Should display a field error if code is not exactly 6 digits", async () => {
    const onSuccess = jest.fn();
    await act(async () => renderComponent({ onSuccess }));
    const { findByText, findByLabelText } = screen;

    const codeInput = await findByLabelText("Enter your six-digit code");
    const submitButton = await findByText("Submit code");

    await act(async () => {
      fireEvent.change(codeInput, { target: { value: "12345" } });
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(await findByText(mfaSecurityMessages.MSG_RB_AUTH_040)).toBeVisible();

    await act(async () => {
      fireEvent.change(codeInput, { target: { value: "1234567" } });
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(await findByText(mfaSecurityMessages.MSG_RB_AUTH_040)).toBeVisible();

    await act(async () => {
      fireEvent.change(codeInput, { target: { value: "A23456" } });
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(await findByText(mfaSecurityMessages.MSG_RB_AUTH_040)).toBeVisible();
    expect(onSuccess).not.toBeCalled();
  });

  it(">> Should display a field error if the verification code is wrong", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/verifyCode`,
        method: "POST",
        results: { status: "ValidationFailed" }
      }
    ]);
    await act(async () => renderComponent());
    const { findByText, findByLabelText } = screen;

    const codeInput = await findByLabelText("Enter your six-digit code");
    await act(async () => {
      fireEvent.change(codeInput, { target: { value: "123456" } });
    });
    const submitButton = await findByText("Submit code");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    const errorMessage = await findByText(mfaSecurityMessages.MSG_RB_AUTH_022);
    expect(errorMessage).toBeVisible();
  });

  it(">> Should redirect user if code is incorrect and account is locked", async () => {
    const onFailure = jest.fn();
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/verifyCode`,
        method: "POST",
        results: { status: "ValidationFailed", isLockedOut: true }
      }
    ]);
    await act(async () => renderComponent({ onFailure }));
    const { findByText, findByLabelText } = screen;

    const codeInput = await findByLabelText("Enter your six-digit code");
    await act(async () => {
      fireEvent.change(codeInput, { target: { value: "123456" } });
    });
    const submitButton = await findByText("Submit code");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(onFailure).toBeCalledWith({
      name: "securitychallengefailure",
      reason: "LOCKED"
    });
  });

  it(">> Should display a field error if the verification code is expired", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/verifyCode`,
        method: "POST",
        results: { status: "VerificationCodeExpired" }
      }
    ]);
    await act(async () => renderComponent());
    const { findByText, findByLabelText } = screen;
    const codeInput = await findByLabelText("Enter your six-digit code");
    await act(async () => {
      fireEvent.change(codeInput, { target: { value: "123456" } });
    });
    const submitButton = await findByText("Submit code");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    const errorMessage = await findByText(mfaSecurityMessages.MSG_RB_AUTH_023);
    expect(errorMessage).toBeVisible();
  });

  it(">> Should display an error if the API fails to verify the code", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/verifyCode`,
        method: "POST",
        error: "Verify code error"
      }
    ]);
    await act(async () => renderComponent({ method }));
    const { findByText, getByLabelText, getByText } = screen;

    const codeInput = getByLabelText("Enter your six-digit code");
    await act(async () => {
      fireEvent.change(codeInput, { target: { value: "123456" } });
    });

    const submitButton = getByText("Submit code");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const errorMessage = await findByText(mfaSecurityMessages.MSG_RB_AUTH_044);
    expect(errorMessage).toBeVisible();
  });

  it(">> Should redirect user if API returns an error and account is locked", async () => {
    const onFailure = jest.fn();
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/verifyCode`,
        method: "POST",
        error: { code: "MFA002" }
      }
    ]);
    await act(async () => renderComponent({ onFailure }));
    const { findByText, findByLabelText } = screen;

    const codeInput = await findByLabelText("Enter your six-digit code");
    await act(async () => {
      fireEvent.change(codeInput, { target: { value: "123456" } });
    });
    const submitButton = await findByText("Submit code");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(onFailure).toBeCalledWith({
      name: "securitychallengefailure",
      reason: "LOCKED"
    });
  });
});
