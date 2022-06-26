import React from "react";
import PropTypes from "prop-types";
import mixpanel from "mixpanel-browser";
import { renderHook, act } from "@testing-library/react-hooks";
import { interacPreferences } from "utils/MessageCatalog";
import DataStore from "utils/store/DataStore";
import { SNACKBAR_TOP_DEFAULT_VIEW } from "utils/hooks/useGetSnackbarTop";
import { RenderWithProviders, mockApiData } from "utils/TestUtils";
import useAutodeposit, { accountsURL, autoDepositsURL } from "./useAutodeposit";
import { autoDepositconfig } from "./constants";
import { DATA_LOADED, ON_CHANGE, POSTING } from "./useAutodepositReducer";
import { testAutodeposit } from "../constants";

const WrapperWithArgs = ({
  location = "/",
  show = () => null,
  hide = () => null,
  openSnackbar = () => null,
  showMessage = () => null
}) => {
  const Component = props => {
    const { children } = props;
    return (
      <RenderWithProviders
        location={location}
        show={show}
        hide={hide}
        openSnackbar={openSnackbar}
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

describe("useAutodeposit hook", () => {
  let mixpanelMock;

  beforeEach(() => {
    if (mixpanelMock) {
      mixpanelMock.mockClear();
    }
    mixpanelMock = jest.spyOn(mixpanel, "track").mockImplementation();
  });
  it(">> can render", async () => {
    DataStore.flush();
    mockApiData([
      {
        url: "",
        results: []
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({})
      });
    });
    const { result } = hook;
    return result;
  });
  it(">> loadData with success", async () => {
    mockApiData([
      {
        url: autoDepositsURL,
        results: [],
        status: 200,
        method: "get"
      },
      {
        url: accountsURL,
        results: [],
        status: 200,
        method: "get"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({})
      });
    });
    const { result } = hook;
    expect(result.current.autodepositState.loading).toEqual(false);
  });
  it(">> loadData with failure", async () => {
    DataStore.flush();
    mockApiData([
      {
        url: autoDepositsURL,
        results: [],
        status: 200,
        method: "get"
      },
      {
        url: accountsURL,
        results: null,
        status: 500,
        method: "get",
        error: "System Error"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({})
      });
    });
    const { result } = hook;
    expect(result.current.autodepositState.loading).toEqual(false);
    expect(result.current.autodepositState.error).toEqual({ type: "ACCOUNTS" });
  });
  it(">> call createAutodepositRule with success ", async () => {
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: [],
        status: 200,
        method: "post"
      }
    ]);
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: [],
        status: 200,
        method: "get"
      }
    ]);
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show, hide })
      });
    });
    const { result } = hook;

    await act(async () => {
      await result.current.updateAutoDepositState({
        type: DATA_LOADED,
        data: testAutodeposit.autodepositState.accounts
      });
    });
    await act(async () => {
      await result.current.updateAutoDepositState({
        type: ON_CHANGE,
        data: { name: "email", value: "test2@atb.com" }
      });
    });
    await act(async () => {
      await result.current.updateAutoDepositState({
        type: ON_CHANGE,
        data: {
          name: "account",
          value: testAutodeposit.autodepositState.accounts[0].key
        }
      });
    });

    const SuccessModal = jest.spyOn(result.current, "show");
    await act(async () => {
      result.current.createAutodepositRule();
    });
    expect(SuccessModal).toBeCalled();
    expect(result.current.autodepositState.email).toEqual("");
    expect(result.current.autodepositState.account).toEqual("");
    expect(mixpanelMock).toBeCalledTimes(1);
  });
  it(">> call createAutodepositRule with failure with max autodeposit rule ", async () => {
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: [],
        status: 500,
        method: "post",
        error: { response: { status: 500, data: { code: "ETRN0002" } } }
      }
    ]);
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show, hide })
      });
    });
    const { result } = hook;

    await act(async () => {
      result.current.updateAutoDepositState({
        type: DATA_LOADED,
        data: testAutodeposit.autodepositState.accounts
      });
    });

    await act(async () => {
      result.current.updateAutoDepositState({
        type: ON_CHANGE,
        data: { name: "email", value: "test2@atb.com" }
      });
      result.current.updateAutoDepositState({
        type: ON_CHANGE,
        data: {
          name: "account",
          value: testAutodeposit.autodepositState.accounts[0].key
        }
      });
    });

    const FailureModal = jest.spyOn(result.current, "show");
    await act(async () => {
      result.current.createAutodepositRule();
    });

    expect(FailureModal).toBeCalled();
    expect(FailureModal).toBeCalledWith(
      expect.objectContaining({
        content: interacPreferences.ERR_SYSTEM_MAXIMUM_AUTODEPOSIT()
      })
    );
    expect(mixpanelMock).toBeCalledTimes(0);
  });
  it(">> call createAutodepositRule with failure with duplicate email ", async () => {
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: [],
        status: 500,
        method: "post",
        error: { response: { status: 500, data: { code: "ETRN0005" } } }
      }
    ]);
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show, hide })
      });
    });
    const { result } = hook;

    await act(async () => {
      result.current.updateAutoDepositState({
        type: DATA_LOADED,
        data: testAutodeposit.autodepositState.accounts
      });
    });

    await act(async () => {
      result.current.updateAutoDepositState({
        type: ON_CHANGE,
        data: { name: "email", value: "test2@atb.com" }
      });
      result.current.updateAutoDepositState({
        type: ON_CHANGE,
        data: {
          name: "account",
          value: testAutodeposit.autodepositState.accounts[0].key
        }
      });
      result.current.updateAutoDepositState({
        type: POSTING,
        data: false
      });
    });

    const FailureModal = jest.spyOn(result.current, "show");
    await act(async () => {
      result.current.createAutodepositRule();
    });

    // expect(result.current.POSTING).toEqual(true);
    expect(FailureModal).toBeCalled();
    expect(FailureModal).toBeCalledWith(
      expect.objectContaining({
        content: interacPreferences.ERR_SYSTEM_DUPLICATE_AUTODEPOSIT()
      })
    );
  });
  it(">> call createAutodepositRule with failure with system error ", async () => {
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: [],
        status: 500,
        method: "post",
        error: "System Error"
      }
    ]);
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show, hide })
      });
    });
    const { result } = hook;

    await act(async () => {
      result.current.updateAutoDepositState({
        type: DATA_LOADED,
        data: testAutodeposit.autodepositState.accounts
      });
    });

    await act(async () => {
      result.current.updateAutoDepositState({
        type: ON_CHANGE,
        data: { name: "email", value: "test2@atb.com" }
      });
      result.current.updateAutoDepositState({
        type: ON_CHANGE,
        data: {
          name: "account",
          value: testAutodeposit.autodepositState.accounts[0].key
        }
      });
    });

    const FailureModal = jest.spyOn(result.current, "show");
    await act(async () => {
      result.current.createAutodepositRule();
    });

    expect(FailureModal).toBeCalled();
    expect(FailureModal).toBeCalledWith(
      expect.objectContaining({
        content: interacPreferences.ERR_SYSTEM_SAVE_AUTODEPOSIT()
      })
    );
  });
  it(">> call setAutoDepositRule should update state with rule, account and mode pending ", async () => {
    mockApiData([
      {
        url: accountsURL,
        results: [
          {
            name: "Basic Account",
            number: "1234",
            id: "my-completely-valid-account-id",
            bankAccount: {
              country: "CA",
              routingId: "00002",
              accountId: "0000000734458889"
            }
          }
        ],
        status: 200,
        method: "get"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({})
      });
    });
    const { result } = hook;

    await act(async () => {
      result.current.setAutoDepositRule(
        testAutodeposit.autodepositState.rules[1]
      );
    });

    expect(result.current.autodepositState.autodepositRule).toEqual(
      testAutodeposit.autodepositState.rules[1]
    );
    expect(result.current.autodepositState.account).toEqual(
      "my-completely-valid-account-id"
    );
    expect(result.current.autodepositState.mode).toEqual("PENDING");
  });
  it(">> call setAutoDepositRule should update state with rule and mode update ", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({})
      });
    });
    const { result } = hook;

    await act(async () => {
      result.current.setAutoDepositRule(
        testAutodeposit.autodepositState.rules[0]
      );
    });

    expect(result.current.autodepositState.autodepositRule).toEqual(
      testAutodeposit.autodepositState.rules[0]
    );
    expect(result.current.autodepositState.mode).toEqual("UPDATE");
  });

  it(">> call updateAutodepositRule with success ", async () => {
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: [],
        status: 200,
        method: "put"
      }
    ]);
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: [],
        status: 200,
        method: "get"
      }
    ]);
    const hide = jest.fn();
    const show = jest.fn();
    const showMessage = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show, hide, showMessage })
      });
    });
    const { result } = hook;

    await act(async () => {
      result.current.updateAutoDepositState({
        type: DATA_LOADED,
        data: {
          accounts: testAutodeposit.autodepositState.accounts,
          autodeposits: testAutodeposit.autodepositState.rules
        }
      });
    });

    await act(async () => {
      result.current.setAutoDepositRule(
        testAutodeposit.autodepositState.rules[0]
      );
      result.current.updateAutoDepositState({
        type: ON_CHANGE,
        data: {
          name: "account",
          value: testAutodeposit.autodepositState.accounts[0].key
        }
      });
    });

    await act(async () => {
      result.current.updateAutoDepositRule();
    });

    expect(result.current.autodepositState.autodepositRule).toEqual({});
    expect(result.current.autodepositState.account).toEqual("");
    expect(result.current.autodepositState.mode).toEqual("");

    expect(result.current.showMessage).toBeCalledWith({
      type: "success",
      top: SNACKBAR_TOP_DEFAULT_VIEW,
      content: interacPreferences.MSG_RBET_051B
    });

    expect(mixpanelMock).toBeCalledTimes(1);
  });
  it(">> call updateAutodepositRule with failure ", async () => {
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: [],
        status: 500,
        method: "put",
        error: "System Error"
      }
    ]);
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show, hide })
      });
    });
    const { result } = hook;

    await act(async () => {
      result.current.updateAutoDepositState({
        type: DATA_LOADED,
        data: {
          accounts: testAutodeposit.autodepositState.accounts,
          autodeposits: testAutodeposit.autodepositState.rules
        }
      });
      result.current.setAutoDepositRule(
        testAutodeposit.autodepositState.rules[0]
      );
      result.current.updateAutoDepositState({
        type: ON_CHANGE,
        data: {
          name: "account",
          value: testAutodeposit.autodepositState.accounts[0].key
        }
      });
    });

    const FailureModal = jest.spyOn(result.current, "show");
    await act(async () => {
      result.current.updateAutoDepositRule();
    });

    expect(FailureModal).toBeCalled();
    expect(FailureModal).toBeCalledWith(
      expect.objectContaining({
        content: interacPreferences.ERR_SYSTEM_SAVE_AUTODEPOSIT()
      })
    );
    expect(mixpanelMock).toBeCalledTimes(0);
  });

  it(">> updating rule with same account should not call API", async () => {
    const show = jest.fn();
    const hide = jest.fn();
    const showMessage = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show, hide, showMessage })
      });
    });
    const { result } = hook;

    await act(async () => {
      result.current.updateAutoDepositState({
        type: DATA_LOADED,
        data: {
          accounts: testAutodeposit.autodepositState.accounts,
          autodeposits: testAutodeposit.autodepositState.rules
        }
      });
      result.current.setAutoDepositRule(
        testAutodeposit.autodepositState.rules[0]
      );
      result.current.updateAutoDepositState({
        type: ON_CHANGE,
        data: {
          name: "account",
          value: testAutodeposit.autodepositState.rules[0].accountId
        }
      });
    });

    await act(async () => {
      result.current.updateAutoDepositRule();
    });

    expect(result.current.showMessage).not.toHaveBeenCalled();
  });

  it(">> unmount loadData success request", async () => {
    DataStore.flush();
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: [],
        status: 200,
        method: "get"
      }
    ]);
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show, hide })
      });
    });
    const { result, unmount } = hook;
    unmount();
    let res;
    await act(async () => {
      res = await result.current.loadData();
    });
    expect(res).toBe(undefined);
  });
  it(">> unmount loadData success request", async () => {
    DataStore.flush();
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: [],
        status: 200,
        method: "get"
      }
    ]);
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show, hide })
      });
    });
    const { result, unmount } = hook;
    let res;
    await act(async () => {
      unmount();
      res = await result.current.loadData();
    });
    expect(res).toBe(undefined);
  });
  it(">> loadData server error", async () => {
    DataStore.flush();
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: [],
        status: 500,
        method: "get",
        error: "ServerError"
      }
    ]);
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show, hide })
      });
    });
    const { result } = hook;
    await act(async () => {
      await result.current.loadData();
    });
    expect(result.current.autodepositState.error.type).toEqual(
      "AUTODEPOSIT_RULES"
    );
  });
  it(">> unmount updateAutoDepositRule", async () => {
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: [],
        status: 200,
        method: "put"
      }
    ]);
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show, hide })
      });
    });
    const { result } = hook;

    await act(async () => {
      result.current.updateAutoDepositState({
        type: DATA_LOADED,
        data: {
          accounts: testAutodeposit.autodepositState.accounts,
          autodeposits: testAutodeposit.autodepositState.rules
        }
      });
      result.current.setAutoDepositRule(
        testAutodeposit.autodepositState.rules[1]
      );
      result.current.updateAutoDepositState({
        type: ON_CHANGE,
        data: {
          name: "account",
          value: testAutodeposit.autodepositState.accounts[0].key
        }
      });
    });
  });
  it(">> unmount createAutodepositRule", async () => {
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: [],
        status: 200,
        method: "put"
      }
    ]);
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show, hide })
      });
    });
    const { result, unmount } = hook;
    unmount();
    const res = await act(async () => {
      result.current.createAutodepositRule();
    });
    expect(res).toBe(undefined);
  });

  it(">> can call onAutodepositChange set state, clear form , handleRegister when less than 5 rules", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({})
      });
    });
    const { result } = hook;
    const email = {
      target: {
        name: "email",
        value: "someemail"
      }
    };
    const account = {
      target: {
        name: "account",
        value: "someaccount"
      }
    };
    await act(async () => {
      await result.current.onAutodepositChange(email);
    });
    await act(async () => {
      await result.current.onAutodepositChange(account);
    });
    expect(result.current.autodepositState.email).toEqual("someemail");
    expect(result.current.autodepositState.account).toEqual("someaccount");

    await act(async () => {
      await result.current.clearForm();
    });
    expect(result.current.autodepositState.email).toEqual("");
    expect(result.current.autodepositState.email).toEqual("");
    await act(async () => {
      await result.current.handleRegister();
    });
    expect(result.current.autodepositState.mode).toEqual("CREATE");
    expect(mixpanelMock).toBeCalledTimes(1);
  });

  it(">> handleRegister when 5 rules shows modal", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show, hide })
      });
    });
    const { result } = hook;

    await act(async () => {
      result.current.updateAutoDepositState({
        type: DATA_LOADED,
        data: {
          accounts: testAutodeposit.autodepositState.accounts,
          autodeposits: testAutodeposit.maxRules
        }
      });
    });

    const maxRuleModal = jest.spyOn(result.current, "show");
    await act(async () => {
      result.current.handleRegister();
    });
    expect(maxRuleModal).toBeCalled();
    expect(maxRuleModal).toBeCalledWith({
      content: interacPreferences.ERR_SYSTEM_MAXIMUM_AUTODEPOSIT(),
      actions: (
        <button
          type="button"
          className="ui button basic"
          onClick={result.current.goBack}
        >
          OK
        </button>
      )
    });
    expect(mixpanelMock).toBeCalledTimes(0);
  });

  it("calls show modal when deleteAutoDepositRule is called", async () => {
    const showModal = jest.fn();
    const rule = {
      directDepositHandle: "email",
      directDepositReferenceNumber: 123
    };
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show: showModal })
      });
    });
    const { result } = hook;
    await act(async () => {
      await result.current.deleteAutoDepositRule(rule);
    });
    expect(showModal).toBeCalledTimes(1);
  });
  it("show call delete with success", async () => {
    const showMessage = jest.fn();
    const rule = {
      directDepositHandle: "email",
      directDepositReferenceNumber: 123
    };
    mockApiData([
      {
        url: `${autoDepositconfig.url}${rule.directDepositReferenceNumber}`,
        results: "done",
        status: 200,
        method: "DELETE"
      }
    ]);

    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ showMessage })
      });
    });
    const { result } = hook;
    let success;
    await act(async () => {
      success = await result.current.deleteRule(rule);
    });
    expect(result.current.showMessage).toBeCalledWith({
      type: "success",
      top: SNACKBAR_TOP_DEFAULT_VIEW,
      content: interacPreferences.MSG_RBET_051C()
    });
    expect(success).toEqual({ data: "done", status: 200 });
    expect(mixpanelMock).toBeCalledTimes(1);
  });
  it("show call delete with failure", async () => {
    const showModal = jest.fn();
    const rule = {
      directDepositHandle: "email",
      directDepositReferenceNumber: 123
    };
    mockApiData([
      {
        url: `${autoDepositconfig.url}${rule.directDepositReferenceNumber}`,
        results: "done",
        status: 200,
        method: "DELETE",
        error: { response: { status: 500, data: { code: "ETRN0002" } } }
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({ show: showModal })
      });
    });
    const { result } = hook;
    let success;
    await act(async () => {
      success = await result.current.deleteRule(rule);
    });
    expect(showModal).toBeCalledTimes(1);
    expect(success).toEqual(null);
    expect(mixpanelMock).toBeCalledTimes(0);
  });

  it(">> keyDown returns null", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodeposit({ enabled: true }), {
        wrapper: WrapperWithArgs({})
      });
    });
    const { result } = hook;
    const returnVal = result.current.onKeyDown();
    expect(returnVal).toBeNull();
  });
});
