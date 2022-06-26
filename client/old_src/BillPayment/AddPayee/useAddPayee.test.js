import React from "react";
import PropTypes from "prop-types";
import mixpanel from "mixpanel-browser";
import { renderHook, act } from "@testing-library/react-hooks";
import { RenderWithProviders, mockApiData } from "utils/TestUtils";
import DataStore from "utils/store/DataStore";
import useAddPayee, { approvedCreditorsUrl, addPayeeUrl } from "./useAddPayee";
import { errorTypes } from "./utils";

const Wrapper = () => {
  const Component = props => {
    const { children } = props;
    return (
      <RenderWithProviders location="/" showMessage={jest.fn()}>
        {children}
      </RenderWithProviders>
    );
  };
  Component.propTypes = {
    children: PropTypes.element.isRequired
  };
  return Component;
};

jest.mock("mixpanel-browser");

describe("useAddPayee hook", () => {
  let mixpanelMock;
  beforeEach(() => {
    mixpanelMock = jest.spyOn(mixpanel, "track").mockImplementation();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it(">> should set proper state when fetches with success ", async () => {
    DataStore.flush();
    const creditors = [1, 2, 3];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      }
    ]);
    const hook = renderHook(() => useAddPayee(), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;
    expect(result.current.addPayeeState.approvedCreditors).toEqual([]);
    expect(result.current.addPayeeState.loading).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.addPayeeState.approvedCreditors).toEqual(creditors);
    expect(result.current.addPayeeState.loading).toEqual(false);
  });
  it(">> should set proper state when fetches and fails ", async () => {
    DataStore.flush();
    mockApiData([
      {
        url: approvedCreditorsUrl,
        error: "Server Error"
      }
    ]);
    const hook = renderHook(() => useAddPayee(), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;
    expect(result.current.addPayeeState.approvedCreditors).toEqual([]);
    expect(result.current.addPayeeState.loading).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.addPayeeState).toMatchObject({
      approvedCreditors: [],
      payeeName: "",
      selectedPayee: "",
      account: "",
      nickname: "",
      loading: false,
      error: true,
      searchResults: [],
      disabled: true
    });
  });

  it(">> should set initial form values if initialPayee is provided", async () => {
    const creditors = [
      {
        name: "HOGG",
        id: 123
      }
    ];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      }
    ]);
    const initialPayee = { accountNumber: "My new payee number", id: 123 };

    const hook = renderHook(() => useAddPayee(jest.fn(), initialPayee), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;
    await waitForNextUpdate();

    expect(result.current.addPayeeState.payeeName).toBe("HOGG");
    expect(result.current.addPayeeState.selectedPayee).toBe("HOGG");
    expect(result.current.addPayeeState.account).toBe("My new payee number");
  });

  it(">> should leave initial `payeeName` empty if initialPayee id is not found in state", async () => {
    const creditors = [
      {
        name: "HOGG",
        id: 123
      }
    ];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      }
    ]);
    const initialPayee = {
      accountNumber: "My new payee number",
      id: "not-found-in-state"
    };

    const hook = renderHook(() => useAddPayee(jest.fn(), initialPayee), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;
    await waitForNextUpdate();

    expect(result.current.addPayeeState.payeeName).toBe("");
    expect(result.current.addPayeeState.selectedPayee).toBe("");
    expect(result.current.addPayeeState.account).toBe("My new payee number");
  });

  it(">> on changes and selections ", async () => {
    const creditors = [
      {
        name: "HOGG",
        id: 123
      }
    ];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      }
    ]);
    const hook = renderHook(() => useAddPayee(), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;
    expect(result.current.addPayeeState.approvedCreditors).toEqual([]);
    expect(result.current.addPayeeState.loading).toEqual(true);
    await waitForNextUpdate();
    const event = {
      target: {
        name: "payeeName",
        value: "HOGG"
      }
    };
    expect(result.current.addPayeeState.approvedCreditors).toEqual(creditors);
    act(() => {
      result.current.onInputChange(event);
    });
    expect(result.current.addPayeeState.payeeName).toEqual("HOGG");
    expect(result.current.addPayeeState.disabled).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.debouncedValue).toEqual("HOGG");
    expect(result.current.addPayeeState.searchResults).toMatchObject([
      { title: "HOGG", name: "HOGG", id: 123 }
    ]);
    expect(result.current.addPayeeState.disabled).toEqual(false);
    const searchResult = {
      name: "HOGG SOMETHING"
    };
    act(() => {
      result.current.handleResultSelect(searchResult);
    });
    await waitForNextUpdate();
    expect(result.current.addPayeeState.payeeName).toEqual("HOGG SOMETHING");
    expect(result.current.addPayeeState.selectedPayee).toEqual(
      "HOGG SOMETHING"
    );
    act(() => {
      result.current.handleSearchChange(null, { value: "SS" });
    });
    expect(result.current.addPayeeState.payeeName).toEqual("SS");
    expect(result.current.addPayeeState.disabled).toEqual(true);
  });
  it(">> on add payee success", async () => {
    DataStore.flush();
    const handleModal = jest.fn();
    const handleAddPayee = jest.fn();
    const creditors = [
      {
        name: "HOGG SOMETHING",
        id: 123
      }
    ];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      },
      {
        url: addPayeeUrl,
        results: creditors,
        status: 200,
        method: "POST"
      }
    ]);

    const hook = renderHook(() => useAddPayee(handleAddPayee), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;
    expect(result.current.addPayeeState.approvedCreditors).toEqual([]);
    expect(result.current.addPayeeState.loading).toEqual(true);
    await waitForNextUpdate();
    const event = {
      target: {
        name: "payeeName",
        value: "HOGG SOMETHING"
      }
    };
    expect(result.current.addPayeeState.approvedCreditors).toEqual(creditors);
    act(() => {
      result.current.onInputChange(event);
    });
    expect(result.current.addPayeeState.payeeName).toEqual("HOGG SOMETHING");
    expect(result.current.addPayeeState.disabled).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.debouncedValue).toEqual("HOGG SOMETHING");
    expect(result.current.addPayeeState.searchResults).toMatchObject([
      { title: "HOGG SOMETHING", name: "HOGG SOMETHING", id: 123 }
    ]);
    expect(result.current.addPayeeState.disabled).toEqual(false);
    const searchResult = {
      name: "HOGG SOMETHING"
    };
    act(() => {
      result.current.handleResultSelect(searchResult);
    });
    await act(async () => {
      await result.current.addPayee(handleModal);
    });
    expect(handleModal).toHaveBeenCalled();
    expect(handleAddPayee).toHaveBeenCalled();
    expect(mixpanelMock).toHaveBeenCalledTimes(1);
  });

  it(">> should handle regex special characters being entered for payee name", async () => {
    DataStore.flush();
    const handleAddPayee = jest.fn();
    const creditors = [
      {
        name: "H()GG / $OMETHING",
        id: 321
      }
    ];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      },
      {
        url: addPayeeUrl,
        results: creditors,
        status: 200,
        method: "POST"
      }
    ]);

    const hook = renderHook(() => useAddPayee(handleAddPayee), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;
    expect(result.current.addPayeeState.approvedCreditors).toEqual([]);
    expect(result.current.addPayeeState.loading).toEqual(true);
    await waitForNextUpdate();
    const event = {
      target: {
        name: "payeeName",
        value: "H()GG / $OMETHING"
      }
    };
    expect(result.current.addPayeeState.approvedCreditors).toEqual(creditors);
    act(() => {
      result.current.onInputChange(event);
    });
    expect(result.current.addPayeeState.payeeName).toEqual("H()GG / $OMETHING");
    expect(result.current.addPayeeState.disabled).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.debouncedValue).toEqual("H()GG / $OMETHING");
    expect(result.current.addPayeeState.searchResults).toMatchObject([
      { title: "H()GG / $OMETHING", name: "H()GG / $OMETHING", id: 321 }
    ]);
  });

  it(">> on add payee success proper parameters passed to handleAddPayee", async () => {
    DataStore.flush();
    const handleModal = jest.fn();
    const handleAddPayee = jest.fn();
    const creditors = [
      {
        name: "HOGG SOMETHING",
        id: 123
      }
    ];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      },
      {
        url: addPayeeUrl,
        results: creditors,
        status: 200,
        method: "POST"
      }
    ]);

    const hook = renderHook(() => useAddPayee(handleAddPayee), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;
    expect(result.current.addPayeeState.approvedCreditors).toEqual([]);
    expect(result.current.addPayeeState.loading).toEqual(true);
    await waitForNextUpdate();
    let event = {
      target: {
        name: "payeeName",
        value: "HOGG SOMETHING"
      }
    };
    expect(result.current.addPayeeState.approvedCreditors).toEqual(creditors);
    act(() => {
      result.current.onInputChange(event);
    });
    expect(result.current.addPayeeState.payeeName).toEqual("HOGG SOMETHING");
    expect(result.current.addPayeeState.disabled).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.debouncedValue).toEqual("HOGG SOMETHING");
    expect(result.current.addPayeeState.searchResults).toMatchObject([
      { title: "HOGG SOMETHING", name: "HOGG SOMETHING", id: 123 }
    ]);
    expect(result.current.addPayeeState.disabled).toEqual(false);
    const searchResult = {
      name: "HOGG SOMETHING"
    };
    act(() => {
      result.current.handleResultSelect(searchResult);
    });
    event = {
      target: {
        name: "account",
        value: "11111"
      }
    };
    act(() => {
      result.current.onInputChange(event);
    });

    event = {
      target: {
        name: "nickname",
        value: "Testing"
      }
    };
    act(() => {
      result.current.onInputChange(event);
    });

    await act(async () => {
      await result.current.addPayee(handleModal);
    });

    expect(handleModal).toHaveBeenCalled();
    expect(handleAddPayee).toHaveBeenCalledWith({
      payeeName: "HOGG SOMETHING",
      account: "11111",
      payeeNickname: "Testing"
    });
    expect(mixpanelMock).toHaveBeenCalledTimes(1);
  });

  it(">> on add payee success - if nickname is blank set 20 char substring of payeename", async () => {
    DataStore.flush();
    const handleModal = jest.fn();
    const handleAddPayee = jest.fn();
    const creditors = [
      {
        name: "DHKJFKFJKDFJKFDHOGG SOMETHING",
        id: 123
      }
    ];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      },
      {
        url: addPayeeUrl,
        results: creditors,
        status: 200,
        method: "POST"
      }
    ]);

    const hook = renderHook(() => useAddPayee(handleAddPayee), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;
    expect(result.current.addPayeeState.approvedCreditors).toEqual([]);
    expect(result.current.addPayeeState.loading).toEqual(true);
    await waitForNextUpdate();
    let event = {
      target: {
        name: "payeeName",
        value: "DHKJFKFJKDFJKFDHOGG SOMETHING"
      }
    };
    expect(result.current.addPayeeState.approvedCreditors).toEqual(creditors);
    act(() => {
      result.current.onInputChange(event);
    });
    expect(result.current.addPayeeState.payeeName).toEqual(
      "DHKJFKFJKDFJKFDHOGG SOMETHING"
    );
    expect(result.current.addPayeeState.disabled).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.debouncedValue).toEqual(
      "DHKJFKFJKDFJKFDHOGG SOMETHING"
    );
    expect(result.current.addPayeeState.searchResults).toMatchObject([
      {
        title: "DHKJFKFJKDFJKFDHOGG SOMETHING",
        name: "DHKJFKFJKDFJKFDHOGG SOMETHING",
        id: 123
      }
    ]);
    expect(result.current.addPayeeState.disabled).toEqual(false);
    const searchResult = {
      name: "DHKJFKFJKDFJKFDHOGG SOMETHING"
    };
    act(() => {
      result.current.handleResultSelect(searchResult);
    });
    event = {
      target: {
        name: "account",
        value: "11111"
      }
    };
    act(() => {
      result.current.onInputChange(event);
    });

    event = {
      target: {
        name: "nickname",
        value: ""
      }
    };
    act(() => {
      result.current.onInputChange(event);
    });

    await act(async () => {
      await result.current.addPayee(handleModal);
    });

    expect(handleModal).toHaveBeenCalled();
    expect(handleAddPayee).toHaveBeenCalledWith({
      payeeName: "DHKJFKFJKDFJKFDHOGG SOMETHING",
      account: "11111",
      payeeNickname: "DHKJFKFJKDFJKFDHOGG "
    });
  });
  it(">> on add payee on fail", async () => {
    DataStore.flush();
    const handleAddPayee = jest.fn();
    const creditors = [
      {
        name: "HOGG SOMETHING",
        id: 123
      }
    ];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      },
      {
        url: addPayeeUrl,
        results: [],
        method: "POST",
        error: "ServerError"
      }
    ]);

    const hook = renderHook(() => useAddPayee(handleAddPayee), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;
    expect(result.current.addPayeeState.approvedCreditors).toEqual([]);
    expect(result.current.addPayeeState.loading).toEqual(true);
    await waitForNextUpdate();
    const event = {
      target: {
        name: "payeeName",
        value: "HOGG SOMETHING"
      }
    };
    expect(result.current.addPayeeState.approvedCreditors).toEqual(creditors);
    act(() => {
      result.current.onInputChange(event);
    });
    expect(result.current.addPayeeState.payeeName).toEqual("HOGG SOMETHING");
    expect(result.current.addPayeeState.disabled).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.debouncedValue).toEqual("HOGG SOMETHING");
    expect(result.current.addPayeeState.searchResults).toMatchObject([
      { title: "HOGG SOMETHING", name: "HOGG SOMETHING", id: 123 }
    ]);
    expect(result.current.addPayeeState.disabled).toEqual(false);
    const searchResult = {
      name: "HOGG SOMETHING"
    };
    act(() => {
      result.current.handleResultSelect(searchResult);
    });
    expect(handleAddPayee).not.toHaveBeenCalled();
  });

  it(">> should handle API error `BP0009` for when account number is invalid", async () => {
    DataStore.flush();
    const handleAddPayee = jest.fn();
    const creditors = [
      {
        name: "HOGG SOMETHING",
        id: 123
      }
    ];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      },
      {
        url: addPayeeUrl,
        results: [],
        method: "POST",
        error: { response: { data: { code: "BP0009" } } }
      }
    ]);

    const hook = renderHook(() => useAddPayee(handleAddPayee), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;
    await waitForNextUpdate();
    const event = {
      target: {
        name: "payeeName",
        value: "HOGG SOMETHING"
      }
    };
    expect(result.current.addPayeeState.approvedCreditors).toEqual(creditors);
    act(() => {
      result.current.onInputChange(event);
    });
    expect(result.current.addPayeeState.payeeName).toEqual("HOGG SOMETHING");
    expect(result.current.addPayeeState.disabled).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.debouncedValue).toEqual("HOGG SOMETHING");
    expect(result.current.addPayeeState.searchResults).toMatchObject([
      { title: "HOGG SOMETHING", name: "HOGG SOMETHING", id: 123 }
    ]);
    expect(result.current.addPayeeState.disabled).toEqual(false);
    const searchResult = {
      name: "HOGG SOMETHING"
    };
    act(() => {
      result.current.handleResultSelect(searchResult);
    });

    const handleModal = jest.fn();
    await act(async () => {
      await result.current.addPayee(handleModal);
    });
    expect(handleModal).not.toHaveBeenCalled();
    expect(result.current.addPayeeState.errors).toEqual({
      account: { type: errorTypes.INVALID_ACCOUNT }
    });
  });

  it(">> should handle an unknown API error", async () => {
    DataStore.flush();
    const handleAddPayee = jest.fn();
    const creditors = [
      {
        name: "HOGG SOMETHING",
        id: 123
      }
    ];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      },
      {
        url: addPayeeUrl,
        results: [],
        method: "POST",
        error: { response: { data: { code: "" } } }
      }
    ]);

    const hook = renderHook(() => useAddPayee(handleAddPayee), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;
    await waitForNextUpdate();
    const event = {
      target: {
        name: "payeeName",
        value: "HOGG SOMETHING"
      }
    };
    expect(result.current.addPayeeState.approvedCreditors).toEqual(creditors);
    act(() => {
      result.current.onInputChange(event);
    });
    expect(result.current.addPayeeState.payeeName).toEqual("HOGG SOMETHING");
    expect(result.current.addPayeeState.disabled).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.debouncedValue).toEqual("HOGG SOMETHING");
    expect(result.current.addPayeeState.searchResults).toMatchObject([
      { title: "HOGG SOMETHING", name: "HOGG SOMETHING", id: 123 }
    ]);
    expect(result.current.addPayeeState.disabled).toEqual(false);
    const searchResult = {
      name: "HOGG SOMETHING"
    };
    act(() => {
      result.current.handleResultSelect(searchResult);
    });

    const handleModal = jest.fn();
    await act(async () => {
      await result.current.addPayee(handleModal);
    });
    expect(handleModal).toHaveBeenCalled();
  });

  it(">> should handle a network error", async () => {
    DataStore.flush();
    const handleAddPayee = jest.fn();
    const creditors = [
      {
        name: "HOGG SOMETHING",
        id: 123
      }
    ];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      },
      {
        url: addPayeeUrl,
        results: [],
        method: "POST",
        error: "Network error"
      }
    ]);

    const hook = renderHook(() => useAddPayee(handleAddPayee), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;
    await waitForNextUpdate();
    const event = {
      target: {
        name: "payeeName",
        value: "HOGG SOMETHING"
      }
    };
    expect(result.current.addPayeeState.approvedCreditors).toEqual(creditors);
    act(() => {
      result.current.onInputChange(event);
    });
    expect(result.current.addPayeeState.payeeName).toEqual("HOGG SOMETHING");
    expect(result.current.addPayeeState.disabled).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.debouncedValue).toEqual("HOGG SOMETHING");
    expect(result.current.addPayeeState.searchResults).toMatchObject([
      { title: "HOGG SOMETHING", name: "HOGG SOMETHING", id: 123 }
    ]);
    expect(result.current.addPayeeState.disabled).toEqual(false);
    const searchResult = {
      name: "HOGG SOMETHING"
    };
    act(() => {
      result.current.handleResultSelect(searchResult);
    });

    const handleModal = jest.fn();
    await act(async () => {
      await result.current.addPayee(handleModal);
    });
    expect(handleModal).toHaveBeenCalled();
  });
});
