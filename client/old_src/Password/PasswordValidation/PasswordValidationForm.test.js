import React from "react";
import { act, render, fireEvent } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import ModalProvider from "Common/ModalProvider";
import PromptProvider, { PromptContext } from "Common/PromptProvider";
import PasswordValidationForm from "./PasswordValidationForm";
import { ErrorTypes } from "../constants";

describe(">> PasswordValidationForm", () => {
  beforeAll(() => {
    windowMatchMediaMock();
  });
  it(">s> should render the page with password inputs", async () => {
    const { findByText } = render(
      <RenderWithProviders location="/">
        <PromptProvider>
          <ModalProvider>
            <PasswordValidationForm />
          </ModalProvider>
        </PromptProvider>
      </RenderWithProviders>
    );
    expect(await findByText("Current password")).toBeTruthy();
  });
  it(">s> should show modal on click of Cancel", async () => {
    const { findByText } = render(
      <RenderWithProviders location="/">
        <PromptProvider>
          <ModalProvider>
            <PasswordValidationForm />
          </ModalProvider>
        </PromptProvider>
      </RenderWithProviders>
    );
    const cancelButton = await findByText("Cancel");
    expect(cancelButton).toBeTruthy();
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    let modalText;
    await act(async () => {
      modalText = await findByText("Password Not Changed");
    });
    expect(modalText).toBeTruthy();
  });
  it(">> should set value on handleOnChange of password", async () => {
    const { getByLabelText } = render(
      <RenderWithProviders location="/">
        <PromptProvider>
          <ModalProvider>
            <PasswordValidationForm />
          </ModalProvider>
        </PromptProvider>
      </RenderWithProviders>
    );
    const passwordInput = await getByLabelText("New password");
    expect(passwordInput).toBeTruthy();
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "Atest123!" } });
    });
    expect(passwordInput.value).toEqual("Atest123!");
  });
  it(">> should set value on handleOnBlur of password", async () => {
    const { getByLabelText, getByText } = render(
      <RenderWithProviders location="/">
        <PromptProvider>
          <ModalProvider>
            <PasswordValidationForm />
          </ModalProvider>
        </PromptProvider>
      </RenderWithProviders>
    );
    const passwordInput = await getByLabelText("New password");
    expect(passwordInput).toBeTruthy();
    await act(async () => {
      fireEvent.blur(passwordInput, { target: { value: "" } });
    });
    expect(getByText("Enter your password.")).toBeTruthy();
  });
  it(">> should render error icons  on Blur with invalid password", async () => {
    const { getByLabelText, getByText, getByTestId, queryByTestId } = render(
      <RenderWithProviders location="/">
        <PromptProvider>
          <ModalProvider>
            <PasswordValidationForm />
          </ModalProvider>
        </PromptProvider>
      </RenderWithProviders>
    );
    const passwordInput = await getByLabelText("New password");
    expect(passwordInput).toBeTruthy();
    await act(async () => {
      fireEvent.blur(passwordInput, { target: { value: "" } });
    });
    expect(getByText("Enter your password.")).toBeTruthy();

    /*
     error types
     LengthError: "LengthError",
      UppercaseError: "UppercaseError",
      LowercaseError: "LowercaseError",
      DigitError: "DigitError",
      SpecialCharacterError: "SpecialCharacterError"
      */

    expect(getByTestId(ErrorTypes.DigitError)).toBeTruthy();
    await act(async () => {
      fireEvent.blur(passwordInput, { target: { value: "1" } });
    });
    expect(await queryByTestId(ErrorTypes.DigitError)).toBeNull();
    expect(getByTestId(ErrorTypes.UppercaseError)).toBeTruthy();
    await act(async () => {
      fireEvent.blur(passwordInput, { target: { value: "A" } });
    });
    expect(await queryByTestId(ErrorTypes.UppercaseError)).toBeNull();
    expect(getByTestId(ErrorTypes.LowercaseError)).toBeTruthy();
    await act(async () => {
      fireEvent.blur(passwordInput, { target: { value: "a" } });
    });
    expect(await queryByTestId(ErrorTypes.LowercaseError)).toBeNull();
    expect(getByTestId(ErrorTypes.LengthError)).toBeTruthy();
    await act(async () => {
      fireEvent.blur(passwordInput, { target: { value: "12345678" } });
    });
    expect(await queryByTestId(ErrorTypes.LengthError)).toBeNull();
    expect(getByTestId(ErrorTypes.SpecialCharacterError)).toBeTruthy();
    await act(async () => {
      fireEvent.blur(passwordInput, { target: { value: "!" } });
    });
    expect(await queryByTestId(ErrorTypes.SpecialCharacterError)).toBeNull();

    // valid password
    await act(async () => {
      fireEvent.blur(passwordInput, { target: { value: "!Aa123456" } });
    });
    expect(await queryByTestId(ErrorTypes.LengthError)).toBeNull();
    expect(await queryByTestId(ErrorTypes.UppercaseError)).toBeNull();
    expect(await queryByTestId(ErrorTypes.LowercaseError)).toBeNull();
    expect(await queryByTestId(ErrorTypes.DigitError)).toBeNull();
    expect(await queryByTestId(ErrorTypes.SpecialCharacterError)).toBeNull();
  });

  it(">> onCommit should be called when form is valid on click of Reset Password", async () => {
    const onCommit = jest.fn();
    const blockClosingBrowser = jest.fn();
    const { getByLabelText, getByText } = render(
      <RenderWithProviders location="/">
        <PromptContext.Provider
          value={{
            promptState: {},
            onCommit,
            blockLocation: () => null,
            blockClosingBrowser,
            nextLocation: () => null,
            onCancel: () => null
          }}
        >
          <ModalProvider>
            <PasswordValidationForm />
          </ModalProvider>
        </PromptContext.Provider>
      </RenderWithProviders>
    );
    const passwordInput = await getByLabelText("New password");
    expect(passwordInput).toBeTruthy();
    await act(async () => {
      fireEvent.blur(passwordInput, { target: { value: "Test123!" } });
    });
    const currentPasswordInput = await getByLabelText("Current password");
    expect(currentPasswordInput).toBeTruthy();
    await act(async () => {
      fireEvent.blur(currentPasswordInput, { target: { value: "123456" } });
    });
    const coonfirmPasswordInput = await getByLabelText("Re-enter new password");
    expect(coonfirmPasswordInput).toBeTruthy();
    await act(async () => {
      fireEvent.blur(coonfirmPasswordInput, { target: { value: "Test123!" } });
    });
    // valid form
    const resetPasswordButton = await getByText("Reset password");
    await act(async () => {
      fireEvent.click(resetPasswordButton);
    });
    expect(blockClosingBrowser).toBeCalled();
    expect(onCommit).toBeCalled();
  });
});
