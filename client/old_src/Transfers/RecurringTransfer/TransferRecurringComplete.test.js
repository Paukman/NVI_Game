import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { RenderWithProviders } from "utils/TestUtils";
import TransferRecurringComplete from "./TransferRecurringComplete";
import { TransferContext } from "../TransferProvider/TransferProvider";
import { transferStateMock } from "../constants";

describe("Tests for recurring bill payment complete page", () => {
  it(">> should go to create when Send another transfer clicked", () => {
    const onSendAnotherTransfer = jest.fn();
    const { getByText } = render(
      <RenderWithProviders location={["/"]}>
        <TransferContext.Provider
          value={{
            recurringTransfer: {
              state: transferStateMock,
              onChange: () => null,
              prepareDataForReview: () => {},
              updateEndDateNoOfTransfersMessage: () => null,
              onCancelReview: () => {},
              onSendAnotherTransfer
            }
          }}
        >
          <TransferRecurringComplete />
        </TransferContext.Provider>
      </RenderWithProviders>
    );

    const sendAnotherTransferButton = getByText("Send another transfer", {
      exact: true
    });
    fireEvent.click(sendAnotherTransferButton);
    expect(onSendAnotherTransfer).toBeCalled();
  });
  it(">> Verify presence of qualtrics ID", () => {
    const { container } = render(
      <RenderWithProviders>
        <TransferContext.Provider
          value={{
            recurringTransfer: {
              state: transferStateMock,
              onChange: () => null,
              prepareDataForReview: () => {},
              updateEndDateNoOfTransfersMessage: () => null,
              onCancelReview: () => {}
            }
          }}
        >
          <TransferRecurringComplete />
        </TransferContext.Provider>
      </RenderWithProviders>
    );

    expect(container.querySelector("#qualtrics-transfer-recurring").exists);
  });
});
