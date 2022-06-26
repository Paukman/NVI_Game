import React from "react";
import { act, render, fireEvent } from "@testing-library/react";
import { RenderWithProviders } from "utils/TestUtils";
import ModalProvider from "Common/ModalProvider";
import AutoLogout from "./AutoLogout";

const WARNING_TIME = 480000;

describe(">> AutoLogout", () => {
  it(">> should render the modal and hide it when the time is up", async () => {
    jest.useFakeTimers();
    const { findByText, queryByText } = render(
      <RenderWithProviders location="/">
        <ModalProvider>
          <AutoLogout />
        </ModalProvider>
      </RenderWithProviders>
    );
    await act(async () => {
      jest.advanceTimersByTime(WARNING_TIME);
    });
    expect(await findByText("Continue banking")).toBeTruthy();
    await act(async () => {
      jest.advanceTimersByTime(120000);
    });
    expect(queryByText("Continue banking")).toBeNull();
  });
  it(">> click on the Log out", async () => {
    jest.useFakeTimers();
    const { findByText, queryByText } = render(
      <RenderWithProviders location="/">
        <ModalProvider>
          <AutoLogout />
        </ModalProvider>
      </RenderWithProviders>
    );
    await act(async () => {
      jest.advanceTimersByTime(WARNING_TIME);
    });
    const logoutButton = await findByText("Log out");
    expect(logoutButton).toBeTruthy();
    await act(async () => {
      fireEvent.click(logoutButton);
    });
    expect(queryByText("Continue banking")).toBeNull();
  });
  it(">> click on the Continue banking", async () => {
    jest.useFakeTimers();
    const { findByText, queryByText } = render(
      <RenderWithProviders location="/">
        <ModalProvider>
          <AutoLogout />
        </ModalProvider>
      </RenderWithProviders>
    );
    await act(async () => {
      jest.advanceTimersByTime(WARNING_TIME);
    });

    const continueButton = await findByText("Continue banking");
    await act(async () => {
      fireEvent.click(continueButton);
    });
    expect(queryByText("Continue banking")).toBeNull();
  });
});
