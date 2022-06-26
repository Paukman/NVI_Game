import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { RenderWithProviders } from "utils/TestUtils";
import TransferOneTimeComplete from "./TransferOneTimeComplete";
import { TransferContext } from "../TransferProvider/TransferProvider";
import { oneTimeTransferState } from "../TransferProvider/hooks/constants";

describe("Test TransferOneTimeComplete", () => {
  it(">> should go to create when Send another transfer clicked", () => {
    const callSendAnotherTransfer = jest.fn();
    const { getByText } = render(
      <RenderWithProviders location={["/"]}>
        <TransferContext.Provider
          value={{
            oneTimeTransfer: {
              state: oneTimeTransferState,
              prepareDataForReview: () => {},
              onCancelReview: () => {},
              onSendAnotherTransfer: callSendAnotherTransfer
            },
            recurring: {}
          }}
        >
          <TransferOneTimeComplete />
        </TransferContext.Provider>
      </RenderWithProviders>
    );

    const sendAnotherTransferButton = getByText("Send another transfer", {
      exact: true
    });
    fireEvent.click(sendAnotherTransferButton);
    expect(callSendAnotherTransfer).toBeCalled();
  });
  it(">> should go to overview", () => {
    const onGoToOverview = jest.fn();
    const { getByText } = render(
      <RenderWithProviders location="/">
        <TransferContext.Provider
          value={{
            oneTimeTransfer: {
              state: oneTimeTransferState,
              prepareDataForReview: () => {},
              onCancelReview: () => {},
              onGoToOverview
            },
            recurring: {}
          }}
        >
          <TransferOneTimeComplete />
        </TransferContext.Provider>
      </RenderWithProviders>
    );

    const goToOverview = getByText("Go to overview", {
      exact: true
    });
    fireEvent.click(goToOverview);
    expect(onGoToOverview).toBeCalled();
  });
});
