import React from "react";
import PropTypes from "prop-types";
import ReactRouter from "react-router";
import { renderHook, act } from "@testing-library/react-hooks";
import { mockApiData, RenderWithProviders } from "utils/TestUtils";
import DataStore from "utils/store";
import { payBillDataMock } from "./constants";
import * as utils from "./utils";
import useLoadData from "./useLoadData";
import * as useNonExistingPayee from "./useNonExistingPayee";
import * as useNoPayees from "./useNoPayees";
import * as useNoEligibleAccounts from "./useNoEligibleAccounts";

const {
  immediatePayBillsFromUrl,
  recurringPayBillsFromUrl,
  billPayeesUrl
} = utils;

const defaultWrapperProps = {
  location: "/",
  hide: () => {},
  show: () => {}
};

const Wrapper = (props = {}) => {
  const Component = ({ children }) => (
    <RenderWithProviders {...defaultWrapperProps} {...props}>
      {children}
    </RenderWithProviders>
  );
  Component.propTypes = {
    children: PropTypes.node.isRequired
  };
  return Component;
};

describe("Testing useLoadData", () => {
  beforeEach(() => {
    DataStore.flush();
  });
  afterEach(() => {
    DataStore.flush();
  });
  it(">> should set proper state when fetches user profile on success ", async () => {
    let oneTimeDataResult = "";
    let recurringDataResult = "";
    const updateStateOneTime = action => {
      oneTimeDataResult = action;
    };
    const updateStateRecurring = action => {
      recurringDataResult = action;
    };
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: []
      },
      {
        url: recurringPayBillsFromUrl,
        results: []
      },
      {
        url: billPayeesUrl,
        results: []
      }
    ]);
    await act(async () => {
      renderHook(() => useLoadData(updateStateOneTime, updateStateRecurring), {
        wrapper: Wrapper()
      });
    });

    expect(oneTimeDataResult).toMatchObject({
      type: "LOADED_DATA",
      data: { fromBillAccounts: [], billPayees: [] }
    });
    expect(recurringDataResult).toMatchObject({
      type: "LOADED_DATA",
      data: { fromBillAccounts: [], billPayees: [] }
    });
  });
  it(">> should set error for one-time payment", async () => {
    let oneTimeDataResult = "";
    const updateStateOneTime = action => {
      oneTimeDataResult = action;
    };
    const updateStateRecurring = jest.fn();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: [],
        error: "Server Error"
      }
    ]);
    await act(async () => {
      renderHook(() => useLoadData(updateStateOneTime, updateStateRecurring), {
        wrapper: Wrapper()
      });
    });

    expect(oneTimeDataResult).toMatchObject({
      type: "LOADING_DATA_FAILED"
    });
  });
  it(">> should set error for recurring payment", async () => {
    let recurringDataResult = "";
    const updateStateRecurring = action => {
      recurringDataResult = action;
    };
    const updateStateOneTime = jest.fn();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: [],
        error: "Server Error"
      }
    ]);
    await act(async () => {
      renderHook(() => useLoadData(updateStateOneTime, updateStateRecurring), {
        wrapper: Wrapper()
      });
    });

    expect(recurringDataResult).toMatchObject({
      type: "LOADING_DATA_FAILED"
    });
  });
  it(">> should call showNoPayeesAlert when no payees", async () => {
    const showNoPayeesAlert = jest.fn();
    jest.spyOn(useNoPayees, "default").mockReturnValue({
      showNoPayeesAlert
    });
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromBillAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromBillAccounts
      },
      {
        url: billPayeesUrl,
        results: null
      }
    ]);

    await act(async () => {
      renderHook(() => useLoadData(jest.fn(), jest.fn()), {
        wrapper: Wrapper()
      });
    });

    expect(showNoPayeesAlert).toBeCalledTimes(1);
  });

  it(">> should call showNonExistingPayee when no payees exist and `location.to` has a nonExistant payee", async () => {
    const showNonExistingPayeeAlert = jest.fn();
    jest.spyOn(useNonExistingPayee, "default").mockReturnValue({
      showNonExistingPayeeAlert
    });
    jest.spyOn(ReactRouter, "useLocation").mockReturnValue({
      pathname: "/move-money/bill-payment/one-time",
      hash: "#create",
      to: {
        accountNumber: "My new payee",
        currency: "CAD"
      }
    });

    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromBillAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromBillAccounts
      },
      {
        url: billPayeesUrl,
        results: null
      }
    ]);
    await act(async () => {
      renderHook(() => useLoadData(jest.fn(), jest.fn()), {
        wrapper: Wrapper()
      });
    });
    expect(showNonExistingPayeeAlert).toBeCalled();
  });
  it(">> should call showNoEligibleAccounts when no accounts are eligible for bill payments", async () => {
    const showNoEligibleAccountsAlert = jest.fn();
    jest.spyOn(useNoEligibleAccounts, "default").mockReturnValue({
      showNoEligibleAccountsAlert
    });

    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: null
      },
      {
        url: recurringPayBillsFromUrl,
        results: null
      },
      {
        url: billPayeesUrl,
        results: null
      }
    ]);
    await act(async () => {
      renderHook(() => useLoadData(jest.fn(), jest.fn()), {
        wrapper: Wrapper()
      });
    });

    expect(showNoEligibleAccountsAlert).toBeCalledTimes(1);
  });

  it(">> should return empty array if null returned from API", async () => {
    let oneTimeDataResult = "";
    let recurringDataResult = "";
    const updateStateOneTime = action => {
      oneTimeDataResult = action;
    };
    const updateStateRecurring = action => {
      recurringDataResult = action;
    };
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: null
      },
      {
        url: recurringPayBillsFromUrl,
        results: null
      },
      {
        url: billPayeesUrl,
        results: null
      }
    ]);
    await act(async () => {
      renderHook(() => useLoadData(updateStateOneTime, updateStateRecurring), {
        wrapper: Wrapper()
      });
    });

    expect(oneTimeDataResult).toMatchObject({
      type: "LOADED_DATA",
      data: { fromBillAccounts: [], billPayees: [] }
    });
    expect(recurringDataResult).toMatchObject({
      type: "LOADED_DATA",
      data: { fromBillAccounts: [], billPayees: [] }
    });
  });
  it(">> should update state when handleAddPayee is called", async () => {
    let oneTimeDataResult = "";
    let recurringDataResult = "";
    const updateStateOneTime = action => {
      oneTimeDataResult = action;
    };
    const updateStateRecurring = action => {
      recurringDataResult = action;
    };
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: []
      },
      {
        url: recurringPayBillsFromUrl,
        results: []
      },
      {
        url: billPayeesUrl,
        results: payBillDataMock.billPayees
      }
    ]);

    let hook;
    await act(async () => {
      hook = renderHook(
        () => useLoadData(updateStateOneTime, updateStateRecurring),
        {
          wrapper: Wrapper()
        }
      );
    });

    const { result } = hook;
    const noOfBillPayees = payBillDataMock.billPayees.length;
    result.current.handleAddPayee({
      payeeName: "WESTBURNE WEST",
      account: "12345678",
      payeeNickname: "WESTBURNE WEST"
    });
    expect(oneTimeDataResult.type).toMatch("LOADED_DATA");
    expect(oneTimeDataResult.data.billPayees).toHaveLength(noOfBillPayees);
    expect(recurringDataResult.type).toMatch("LOADED_DATA");
    expect(recurringDataResult.data.billPayees).toHaveLength(noOfBillPayees);

    result.current.handleAddPayee({
      payeeName: "garbage",
      account: "11111",
      payeeNickname: "garbage"
    });
    expect(oneTimeDataResult.type).toMatch("LOADED_DATA");
    expect(oneTimeDataResult.data.billPayees).toHaveLength(noOfBillPayees);
    expect(recurringDataResult.type).toMatch("LOADED_DATA");
    expect(recurringDataResult.data.billPayees).toHaveLength(noOfBillPayees);
  });
  it(">> should call updatestate when handleAddPayee is called", async () => {
    const updateStateOneTime = jest.fn();
    const updateStateRecurring = jest.fn();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromBillAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromBillAccounts
      },
      {
        url: billPayeesUrl,
        results: payBillDataMock.billPayees
      }
    ]);

    let hook;
    await act(async () => {
      hook = renderHook(
        () => useLoadData(updateStateOneTime, updateStateRecurring),
        {
          wrapper: Wrapper()
        }
      );
    });

    const { result } = hook;
    expect(updateStateOneTime).toHaveBeenNthCalledWith(1, {
      type: "LOADING_DATA"
    });
    expect(updateStateOneTime).toHaveBeenNthCalledWith(2, {
      type: "LOADED_DATA",
      data: {
        billPayees: [
          {
            ATBMastercardCurrency: null,
            ATBMastercardIndicator: false,
            billPayeeId: "0056",
            payeeCustomerReference: "363651",
            payeeName: "WESTBURNE WEST",
            payeeNickname: "WESTBURNE WEST"
          },
          {
            ATBMastercardCurrency: null,
            ATBMastercardIndicator: false,
            billPayeeId: "1967",
            payeeCustomerReference: "32155816",
            payeeName: "TELUS MOBILITY",
            payeeNickname: "TELUS MOBILITY"
          },
          {
            billPayeeId: "6789",
            payeeName: "ATB US DOLLAR MASTER",
            payeeNickname: "ATB US DOLLAR MASTER",
            ATBMastercardCurrency: "USD",
            ATBMastercardIndicator: true,
            payeeCustomerReference: "32152999"
          }
        ],
        fromBillAccounts: payBillDataMock.fromBillAccounts
      }
    });

    await act(async () => {
      await result.current.handleAddPayee({
        payeeName: "WESTBURNE WEST",
        payeeNickname: "WESTBURNE WEST",
        account: "363651"
      });
    });
    expect(updateStateOneTime).toHaveBeenCalledTimes(5);
    expect(updateStateRecurring).toHaveBeenCalledTimes(5);
  });
});
