import { renderHook, act } from "@testing-library/react-hooks";
import { mockApiData } from "utils/TestUtils";
import DataStore from "utils/store";
import useLoadData from "./useLoadData";
import {
  oneTimeImmediateTransferFromUrl,
  oneTimeFutureDatedTransferFromUrl,
  recurringTransferFromUrl,
  transfersToUrl
} from "./utils";

describe("Testing useLoadData", () => {
  beforeEach(() => {
    DataStore.flush();
  });
  afterEach(() => {
    DataStore.flush();
  });

  it(">> should set proper state when fetches from and to accounts on success ", async () => {
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
        url: oneTimeImmediateTransferFromUrl,
        results: []
      },
      {
        url: oneTimeFutureDatedTransferFromUrl,
        results: []
      },
      {
        url: recurringTransferFromUrl,
        results: []
      },
      {
        url: transfersToUrl,
        results: []
      }
    ]);
    await act(async () => {
      renderHook(() =>
        useLoadData(updateStateOneTime, updateStateRecurring, () => null)
      );
    });

    expect(oneTimeDataResult).toMatchObject({
      type: "LOADED_DATA",
      data: { fromAccounts: [], toAccounts: [] }
    });
    expect(recurringDataResult).toMatchObject({
      type: "LOADED_DATA",
      data: { fromAccounts: [], toAccounts: [] }
    });
  });

  it(">> should set error for one-time transfer", async () => {
    let oneTimeDataResult = "";
    const updateStateOneTime = action => {
      oneTimeDataResult = action;
    };
    const updateStateRecurring = jest.fn();
    mockApiData([
      {
        url: oneTimeImmediateTransferFromUrl,
        results: [],
        error: "Server Error"
      }
    ]);
    await act(async () => {
      renderHook(() => useLoadData(updateStateOneTime, updateStateRecurring));
    });

    expect(oneTimeDataResult).toMatchObject({
      type: "LOADING_DATA_FAILED"
    });
  });
  it(">> should set error for recurring transfer", async () => {
    let recurringDataResult = "";
    const updateStateRecurring = action => {
      recurringDataResult = action;
    };
    const updateStateOneTime = jest.fn();
    mockApiData([
      {
        url: oneTimeImmediateTransferFromUrl,
        results: [],
        error: "Server Error"
      }
    ]);
    await act(async () => {
      renderHook(() => useLoadData(updateStateOneTime, updateStateRecurring));
    });

    expect(recurringDataResult).toMatchObject({
      type: "LOADING_DATA_FAILED"
    });
  });

  it(">> should call noRequirementsMet when no payees", async () => {
    let oneTimeDataResult = "";
    let recurringDataResult = "";
    const noRequirementsMet = jest.fn();
    const updateStateOneTime = action => {
      oneTimeDataResult = action;
    };
    const updateStateRecurring = action => {
      recurringDataResult = action;
    };
    mockApiData([
      {
        url: oneTimeImmediateTransferFromUrl,
        results: null
      },
      {
        url: oneTimeFutureDatedTransferFromUrl,
        results: null
      },
      {
        url: recurringTransferFromUrl,
        results: null
      },
      {
        url: transfersToUrl,
        results: null
      }
    ]);
    await act(async () => {
      renderHook(() =>
        useLoadData(updateStateOneTime, updateStateRecurring, noRequirementsMet)
      );
    });

    expect(oneTimeDataResult).toMatchObject({
      type: "LOADED_DATA",
      data: { fromAccounts: [], toAccounts: [] }
    });
    expect(recurringDataResult).toMatchObject({
      type: "LOADED_DATA",
      data: { fromAccounts: [], toAccounts: [] }
    });
    expect(noRequirementsMet).toBeCalled();
  });
  it(">> should return empty array if null returned from API", async () => {
    let oneTimeDataResult = "";
    let recurringDataResult = "";
    const requirementsNotmetAlert = jest.fn();
    const updateStateOneTime = action => {
      oneTimeDataResult = action;
    };
    const updateStateRecurring = action => {
      recurringDataResult = action;
    };
    mockApiData([
      {
        url: oneTimeImmediateTransferFromUrl,
        results: null
      },
      {
        url: oneTimeFutureDatedTransferFromUrl,
        results: null
      },
      {
        url: recurringTransferFromUrl,
        results: null
      },
      {
        url: transfersToUrl,
        results: null
      }
    ]);
    await act(async () => {
      renderHook(() =>
        useLoadData(
          updateStateOneTime,
          updateStateRecurring,
          requirementsNotmetAlert
        )
      );
    });

    expect(oneTimeDataResult).toMatchObject({
      type: "LOADED_DATA",
      data: { fromAccounts: [], toAccounts: [] }
    });
    expect(recurringDataResult).toMatchObject({
      type: "LOADED_DATA",
      data: { fromAccounts: [], toAccounts: [] }
    });
  });
});
