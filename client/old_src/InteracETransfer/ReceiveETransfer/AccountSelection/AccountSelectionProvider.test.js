import React from "react";
import { render, act, screen } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import ModalProvider from "Common/ModalProvider";
import PromptProvider from "Common/PromptProvider";

import AccountSelectionProvider from "./AccountSelectionProvider";

const receiveEState = {
  receiveMoneyData: {
    senderName: "John",
    eTransferId: "qwert"
  },
  eligibleAccountsFormatted: [
    { key: 1, text: "some one account" },
    { key: 2, text: "some two account" }
  ],
  amountFormatted: "123"
};
const renderWithMockData = () => {
  return (
    <RenderWithProviders location="/">
      <PromptProvider>
        <ModalProvider>
          <AccountSelectionProvider receiveEState={receiveEState} />
        </ModalProvider>
      </PromptProvider>
    </RenderWithProviders>
  );
};

describe(">> AccountSelection", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });
  it(">> should render all forms ", async () => {
    await act(async () => {
      render(renderWithMockData());
    });
    const { findByText } = screen;
    await act(async () => {
      expect(await findByText("Receive money")).toBeTruthy();
      expect(await findByText("Money accepted")).toBeTruthy();
      expect(await findByText("Money declined")).toBeTruthy();
    });
  });
});
