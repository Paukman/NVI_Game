import React from "react";
import { render } from "@testing-library/react";
import ModalProvider from "Common/ModalProvider";
import PromptProvider from "Common/PromptProvider";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import { act } from "react-dom/test-utils";
import Password from "./Password";

describe("Testing Reset Password starting page", () => {
  beforeAll(() => {
    windowMatchMediaMock();
  });

  it(">> should render tabs and rest password", async () => {
    let component;
    const props = {
      isTemp: true
    };
    await act(async () => {
      component = render(
        <RenderWithProviders
          location="/password/reset-password"
          modalComponent={() => null}
        >
          <Password {...props} />
        </RenderWithProviders>
      );
      return component;
    });

    const { findByText } = component;
    const resetPassword = await findByText("Current password");
    expect(resetPassword).toBeTruthy();
  });
  it(">> return null when there is no match", async () => {
    let component;
    const props = {
      isTemp: true
    };
    await act(async () => {
      component = render(
        <RenderWithProviders
          location="/password/blah-blah"
          modalComponent={() => null}
        >
          <Password {...props} />
        </RenderWithProviders>
      );
      return component;
    });
    const { container } = component;
    expect(container.hasChildNodes()).toBe(false);
  });
  it(">> should render tabs and security screen", async () => {
    let component;
    const props = {
      isTemp: true
    };
    await act(async () => {
      component = render(
        <RenderWithProviders location="/password/security">
          <PromptProvider>
            <ModalProvider>
              <Password {...props} />
            </ModalProvider>
          </PromptProvider>
        </RenderWithProviders>
      );
      return component;
    });

    const { findByText } = component;
    const securityQuestion = await findByText("Security checkpoint");
    expect(securityQuestion).toBeTruthy();
  });
});
