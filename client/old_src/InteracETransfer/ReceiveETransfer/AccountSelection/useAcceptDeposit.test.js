import React from "react";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import { RenderWithProviders, mockApiData } from "utils/TestUtils";
import DataStore from "utils/store";
import { etransfersBaseUrl } from "api";
import { receiveETransferErrors, eTransferErrors } from "utils/MessageCatalog";
import useAcceptDeposit from "./useAcceptDeposit";

const WrapperWithArgs = (
  location,
  show,
  hide,
  modalComponent,
  showMessage = null
) => {
  const Component = props => {
    const { children } = props;
    return (
      <RenderWithProviders
        location={location}
        show={show}
        hide={hide}
        modalComponent={modalComponent}
        showMessage={showMessage}
      >
        {children}
      </RenderWithProviders>
    );
  };
  Component.propTypes = {
    children: PropTypes.element.isRequired
  };
  return Component;
};

describe("useAcceptDeposit hook", () => {
  beforeEach(() => {
    DataStore.flush();
  });
  afterEach(() => {
    DataStore.flush();
  });

  it(">> should set proper state when deposit amount ", async () => {
    const eTransferId = 123;
    mockApiData([
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}/accept`,
        status: 200,
        method: "POST"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useAcceptDeposit(() => null), {
        wrapper: WrapperWithArgs(
          "/",
          () => null,
          () => null,
          () => null,
          () => null
        )
      });
    });
    const { result } = hook;
    const { onDeposit } = result.current;
    let error;
    await act(async () => {
      error = await onDeposit({
        amount: "$1.25",
        toAccounts: "33ZFwIxk3ZebPZZx1bDHj13qc_cl-x7xEjlFolGtxIc",
        beneficiaryMessage: "Thank you",
        eTransferId,
        senderName: "John"
      });
      return error;
    });
    expect(error).toEqual(null);
    expect(result.current.deposit).toMatchObject({
      declining: false,
      depositing: false,
      error: null,
      pageToRender: "ConfirmPage"
    });
  });

  it(">> should set state on depositing failure and show error modal", async () => {
    const eTransferId = 123;
    const hide = jest.fn();
    const show = jest.fn();
    mockApiData([
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}/accept`,
        status: 500,
        error: "Server Error",
        method: "POST"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useAcceptDeposit(() => null), {
        wrapper: WrapperWithArgs(
          "/",
          show,
          hide,
          () => null,
          () => null
        )
      });
    });
    const { result } = hook;
    const { onDeposit } = result.current;
    let error;
    await act(async () => {
      error = await onDeposit({
        amount: "$1.25",
        toAccounts: "345",
        beneficiaryMessage: "Thank you",
        eTransferId,
        senderName: "John"
      });
      return error;
    });
    expect(error).toEqual("Server Error");
    expect(result.current.deposit).toMatchObject({
      declining: false,
      depositing: false,
      error: "Server Error",
      pageToRender: "AccountSelectionForm"
    });

    const errorModal = jest.spyOn(result.current, "show");
    expect(errorModal).toHaveBeenCalledWith(
      expect.objectContaining({
        content: receiveETransferErrors.MSG_RBET_014
      })
    );
  });

  it(">> should set proper state when declining and model will show", async () => {
    let hook;
    const eTransferId = 123;
    const hide = jest.fn();
    const show = jest.fn();
    await act(async () => {
      hook = renderHook(() => useAcceptDeposit(), {
        wrapper: WrapperWithArgs(
          "/",
          show,
          hide,
          () => null,
          () => null
        )
      });
    });
    const { result } = hook;
    const { onDecline } = result.current;
    await act(async () => {
      await onDecline({
        amount: "$1.25",
        toAccounts: "123",
        beneficiaryMessage: "Thank you",
        eTransferId,
        senderName: "John"
      });
    });
    expect(result.current.deposit).toMatchObject({
      declining: false,
      depositing: false,
      error: null,
      pageToRender: "AccountSelectionForm"
    });
    const declineModal = jest.spyOn(result.current, "show");
    expect(declineModal).toHaveBeenCalledWith(
      expect.objectContaining({
        content: receiveETransferErrors.MSG_RBET_044B("John", "$1.25")
      })
    );
  });

  it(">> should set proper state when decline confirmed and success", async () => {
    const eTransferId = 123;
    const hide = jest.fn();
    const show = jest.fn();
    mockApiData([
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}}`,
        status: 200,
        method: "DELETE",
        data: {
          declineReason: "Some reason"
        }
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useAcceptDeposit(), {
        wrapper: WrapperWithArgs(
          "/",
          show,
          hide,
          () => null,
          () => null
        )
      });
    });
    const { result } = hook;
    const { onConfirmDecline } = result.current;
    await act(async () => {
      await onConfirmDecline({ eTransferId });
    });
    expect(result.current.deposit.declining).toEqual(false);
    expect(result.current.deposit.pageToRender).toEqual("DeclinePage");

    const hideModal = jest.spyOn(result.current, "hide");
    expect(hideModal).toHaveBeenCalled();
  });

  it(">> should set proper state when decline fails and show modal", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    const data = {
      eTransferId: 123
    };
    mockApiData([
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${data.eTransferId}`,
        status: 500,
        error: "Server Error",
        method: "DELETE"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useAcceptDeposit(), {
        wrapper: WrapperWithArgs(
          "/",
          show,
          hide,
          () => null,
          () => null
        )
      });
    });
    const { result } = hook;
    const { onConfirmDecline } = result.current;
    await act(async () => {
      await onConfirmDecline({ eTransferId: 123 });
    });
    expect(result.current.deposit.declining).toEqual(false);

    const showModal = jest.spyOn(result.current, "show");
    expect(showModal).toHaveBeenCalled();
    expect(showModal).toHaveBeenCalledWith(
      expect.objectContaining({
        content: eTransferErrors.MSG_RBET_037D
      })
    );
  });
});
