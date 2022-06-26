import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import Details from "./Details";
import { oneTimeTransferDetailsData } from "./scheduledTransfersTestData";
import { TransferContext } from "../TransferProvider/TransferProvider";

describe("Details", () => {
  const props = {
    data: oneTimeTransferDetailsData,
    handleDetailsClose: jest.fn(),
    handleDeleteModal: jest.fn()
  };

  it(">> verify header ", () => {
    const { getByText } = render(
      <TransferContext.Provider
        value={{
          scheduledTransfer: {
            setIsViewingDetails: jest.fn()
          }
        }}
      >
        <Details {...props} />
      </TransferContext.Provider>
    );
    expect(getByText("Scheduled transfer details"));
  });

  it(">> verify Cross button ", () => {
    const { getByAltText } = render(
      <TransferContext.Provider
        value={{
          scheduledTransfer: {
            setIsViewingDetails: jest.fn()
          }
        }}
      >
        <Details {...props} />
      </TransferContext.Provider>
    );
    expect(getByAltText("Close scheduled transfer"));

    act(() => {
      fireEvent.click(getByAltText("Close scheduled transfer"));
    });
    expect(props.handleDetailsClose).toHaveBeenCalledTimes(1);
  });

  it(">> verify cancel button ", () => {
    const { getByText } = render(
      <TransferContext.Provider
        value={{
          scheduledTransfer: {
            setIsViewingDetails: jest.fn()
          }
        }}
      >
        <Details {...props} />
      </TransferContext.Provider>
    );
    expect(getByText("Cancel scheduled transfer"));

    act(() => {
      fireEvent.click(getByText("Cancel scheduled transfer"));
    });
    expect(props.handleDeleteModal).toHaveBeenCalledTimes(1);
  });
});
