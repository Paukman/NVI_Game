import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { RenderWithProviders } from "utils/TestUtils";
import TransferOneTimeReview from "./TransferOneTimeReview";
import { TransferContext } from "../TransferProvider/TransferProvider";
import { oneTimeTransferState } from "../TransferProvider/hooks/constants";

describe("Test TransferOneTimeReview", () => {
  it(">> should call cancel alert when transfer cancelled", () => {
    const onCancelReview = jest.fn();
    const { getByText } = render(
      <RenderWithProviders location="/">
        <TransferContext.Provider
          value={{
            oneTimeTransfer: {
              state: oneTimeTransferState,
              prepareDataForReview: () => {},
              onCancelReview
            },
            recurring: {}
          }}
        >
          <TransferOneTimeReview prevTab={() => ""} nextTab={() => ""} />
        </TransferContext.Provider>
      </RenderWithProviders>
    );

    const cancelButton = getByText("Cancel", { exact: true });
    fireEvent.click(cancelButton);
    expect(onCancelReview).toBeCalled();
  });

  it(">> should go back when edit clicked", () => {
    const prevTab = jest.fn();
    const { getByText } = render(
      <RenderWithProviders>
        <TransferContext.Provider
          value={{
            oneTimeTransfer: {
              state: oneTimeTransferState,
              prepareDataForReview: () => {},
              onCancelReview: () => {}
            },
            recurring: {}
          }}
        >
          <TransferOneTimeReview prevTab={prevTab} nextTab={() => ""} />
        </TransferContext.Provider>
      </RenderWithProviders>
    );

    const editButton = getByText("Edit");
    fireEvent.click(editButton);
    expect(prevTab).toBeCalled();
  });

  it(">> should call API on click of Send ", () => {
    const onTransfer = jest.fn();
    const nextTab = jest.fn();
    const { getByText } = render(
      <RenderWithProviders>
        <TransferContext.Provider
          value={{
            oneTimeTransfer: {
              state: oneTimeTransferState,
              prepareDataForReview: () => {},
              onTransfer
            },
            recurring: {}
          }}
        >
          <TransferOneTimeReview prevTab={() => ""} nextTab={nextTab} />
        </TransferContext.Provider>
      </RenderWithProviders>
    );

    const sendButton = getByText("Send", { exact: true });
    fireEvent.click(sendButton);
    expect(onTransfer).toBeCalledWith(nextTab);
  });
});
