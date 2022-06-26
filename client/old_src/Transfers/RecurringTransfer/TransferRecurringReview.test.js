import React from "react";
import { render } from "@testing-library/react";
import { RenderWithProviders } from "utils/TestUtils";
import TransferRecurringReview from "./TransferRecurringReview";
import { TransferContext } from "../TransferProvider/TransferProvider";
import { transferStateMock } from "../constants";

describe("Test TransferRecurringReview", () => {
  it(">> should go back when edit clicked", () => {
    const prevTab = jest.fn();
    const { getByText } = render(
      <RenderWithProviders location="/">
        <TransferContext.Provider
          value={{
            oneTimeTransfer: {},
            recurringTransfer: {
              state: transferStateMock,
              prepareDataForReview: () => {},
              onCancelReview: () => {}
            }
          }}
        >
          <TransferRecurringReview prevTab={prevTab} nextTab={() => ""} />
        </TransferContext.Provider>
      </RenderWithProviders>
    );

    const editButton = getByText("Edit");
    fireEvent.click(editButton);
    expect(prevTab).toBeCalled();
  });
});
