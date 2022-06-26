import React from "react";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import { RenderWithProviders, mockApiData } from "utils/TestUtils";
import DataStore from "utils/store";
import { etransfersBaseUrl, accountsBaseUrl } from "api";
import useReceiveETransfer from "./useReceiveETransfer";
import {
  receiveRequest,
  receiveRequestNoAuth,
  receivePostFail15,
  receiveGetFail15,
  toAccounts
} from "./constants";

const WrapperWithArgs = (
  location,
  show,
  hide,
  openSnackbar,
  modalComponent
) => {
  const Component = props => {
    const { children } = props;
    return (
      <RenderWithProviders
        location={location}
        showMessage={show}
        hide={hide}
        show={show}
        openSnackbar={openSnackbar}
        modalComponent={modalComponent}
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

describe("useReceiveETransfer hook", () => {
  beforeEach(() => {
    DataStore.flush();
  });
  afterEach(() => {
    DataStore.flush();
  });

  it(">> should set state on success fetching the data auth needed", async () => {
    const eTransferId = 123;
    mockApiData([
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}`,
        status: 200,
        results: receiveRequest,
        method: "GET"
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferTo`,
        status: 200,
        results: toAccounts,
        method: "GET"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useReceiveETransfer(eTransferId), {
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
    expect(result.current.receiveEState.loading).toEqual(false);
    expect(result.current.receiveEState.authenticated).toEqual(false);
    expect(result.current.receiveEState.receiveMoneyError).toEqual(null);
  });
  it(">> should set state on success fetching the data no auth needed", async () => {
    const eTransferId = 123;
    mockApiData([
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}`,
        status: 200,
        results: receiveRequestNoAuth,
        method: "GET"
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferTo`,
        status: 200,
        results: toAccounts,
        method: "GET"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useReceiveETransfer(eTransferId), {
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
    expect(result.current.receiveEState.loading).toEqual(false);
    expect(result.current.receiveEState.authenticated).toEqual(true);
    expect(result.current.receiveEState.receiveMoneyError).toEqual(null);
  });

  it(">> should set state on fail to fetch data", async () => {
    const eTransferId = 123;
    mockApiData([
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}`,
        status: 500,
        error: "Server Error",
        results: receiveRequestNoAuth,
        method: "GET"
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferTo`,
        status: 200,
        results: toAccounts,
        method: "GET"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useReceiveETransfer(eTransferId), {
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
    expect(result.current.receiveEState.loading).toEqual(false);
    expect(result.current.receiveEState.authenticated).toEqual(false);
    expect(result.current.receiveEState.receiveMoneyError).toEqual(
      "Server Error"
    );
  });
  it(">> can set different error codes", async () => {
    const eTransferId = 123;
    mockApiData([
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}`,
        status: 500,
        error: receivePostFail15,
        method: "GET"
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferTo`,
        status: 200,
        results: toAccounts,
        method: "GET"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useReceiveETransfer(eTransferId), {
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
    expect(result.current.receiveEState.loading).toEqual(false);
    expect(result.current.receiveEState.authenticated).toEqual(false);
    expect(result.current.receiveEState.receiveMoneyError).toEqual(
      receivePostFail15
    );
  });
  it(">> can set different error codes", async () => {
    const eTransferId = 123;
    mockApiData([
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}`,
        status: 500,
        error: receiveGetFail15,
        method: "GET"
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferTo`,
        status: 200,
        results: toAccounts,
        method: "GET"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useReceiveETransfer(eTransferId), {
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
    expect(result.current.receiveEState.loading).toEqual(false);
    expect(result.current.receiveEState.authenticated).toEqual(false);
    expect(result.current.receiveEState.receiveMoneyError).toEqual(
      receiveGetFail15
    );
  });
  it(">> error loading eligibleAccounts", async () => {
    const eTransferId = 123;
    mockApiData([
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}`,
        status: 200,
        results: receiveRequestNoAuth,
        method: "GET"
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferTo`,
        status: 500,
        error: "Server Error",
        method: "GET"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useReceiveETransfer(eTransferId), {
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
    expect(result.current.receiveEState.loading).toEqual(false);
    expect(result.current.receiveEState.authenticated).toEqual(false);
    expect(result.current.receiveEState.receiveMoneyError).toEqual(null);
    expect(result.current.receiveEState.eligibleAccountsError).toEqual(
      "Server Error"
    );
  });

  it(">>error calling authenticateTransfer", async () => {
    const eTransferId = 123;
    mockApiData([
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}`,
        status: 200,
        results: receiveRequest,
        method: "GET"
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferTo`,
        status: 200,
        results: toAccounts,
        method: "GET"
      },
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}/authenticate`,
        status: 200,
        results: receiveRequestNoAuth,
        method: "POST"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useReceiveETransfer(eTransferId), {
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
    let error;
    await act(async () => {
      error = await result.current.authenticateTransfer({
        message: "Thank you"
      });
      return error;
    });
    expect(result.current.receiveEState.error).toEqual(null);
  });
  it(">>success calling authenticateTransfer", async () => {
    const eTransferId = 123;
    mockApiData([
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}`,
        status: 200,
        results: receiveRequest,
        method: "GET"
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferTo`,
        status: 200,
        results: toAccounts,
        method: "GET"
      },
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}/authenticate`,
        status: 200,
        results: receiveRequestNoAuth,
        method: "POST"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useReceiveETransfer(eTransferId), {
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
    let error;
    await act(async () => {
      error = await result.current.authenticateTransfer({
        message: "Thank you"
      });
      return error;
    });
    expect(result.current.receiveEState.receiveMoneyError).toEqual(null);
  });
  it(">>error calling authenticateTransfer", async () => {
    const eTransferId = 123;
    mockApiData([
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}`,
        status: 200,
        results: receiveRequest,
        method: "GET"
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferTo`,
        status: 200,
        results: toAccounts,
        method: "GET"
      },
      {
        url: `${etransfersBaseUrl}/incomingetransfers/${eTransferId}/authenticate`,
        status: 500,
        error: receiveGetFail15,
        method: "POST"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useReceiveETransfer(eTransferId), {
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
    let error;
    await act(async () => {
      error = await result.current.authenticateTransfer({
        answer: "Thank you"
      });
      return error;
    });
    expect(result.current.receiveEState.receiveMoneyError).toEqual(
      receiveGetFail15
    );
  });
});
