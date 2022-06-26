import { renderHook, act } from "@testing-library/react-hooks";
import * as manualApi from "api/manualApiFetch";
import useAccountHolderName from "./useAccountHolderName";

describe("useAccountHolderName hook", () => {
  it("should return appropriate full, first, middle, and last names of retail account holder", async () => {
    let renderHookResult;
    jest.spyOn(manualApi, "manualApiFetch").mockImplementation(() => {
      return Promise.resolve({
        value: {
          retailName: {
            firstName: "James",
            middleName: "Herbert",
            lastName: "Bond"
          }
        }
      });
    });

    await act(async () => {
      renderHookResult = renderHook(() => useAccountHolderName());
    });

    const { result } = renderHookResult;

    expect(result.current.accountHolderFirstName).toBe("James");
    expect(result.current.accountHolderMiddleName).toBe("Herbert");
    expect(result.current.accountHolderLastName).toBe("Bond");
    expect(result.current.accountHolderFullName).toBe("James Herbert Bond");
  });

  it("should return appropriate full name as firstname lastname when middle name is undefined", async () => {
    let renderHookResult;
    jest.spyOn(manualApi, "manualApiFetch").mockImplementation(() => {
      return Promise.resolve({
        value: {
          retailName: {
            firstName: "James",
            middleName: undefined,
            lastName: "Bond"
          }
        }
      });
    });

    await act(async () => {
      renderHookResult = renderHook(() => useAccountHolderName());
    });

    const { result } = renderHookResult;

    expect(result.current.accountHolderFirstName).toBe("James");
    expect(result.current.accountHolderMiddleName).toBeUndefined();
    expect(result.current.accountHolderLastName).toBe("Bond");
    expect(result.current.accountHolderFullName).toBe("James Bond");
  });

  it("should return appropriate full name as middlename lastname when firstname is undefined", async () => {
    let renderHookResult;
    jest.spyOn(manualApi, "manualApiFetch").mockImplementation(() => {
      return Promise.resolve({
        value: {
          retailName: {
            firstName: undefined,
            middleName: "Herbert",
            lastName: "Bond"
          }
        }
      });
    });

    await act(async () => {
      renderHookResult = renderHook(() => useAccountHolderName());
    });

    const { result } = renderHookResult;

    expect(result.current.accountHolderFirstName).toBeUndefined();
    expect(result.current.accountHolderMiddleName).toBe("Herbert");
    expect(result.current.accountHolderLastName).toBe("Bond");
    expect(result.current.accountHolderFullName).toBe("Herbert Bond");
  });

  it("should return appropriate full name as firstname middlename when lastname is undefined", async () => {
    let renderHookResult;
    jest.spyOn(manualApi, "manualApiFetch").mockImplementation(() => {
      return Promise.resolve({
        value: {
          retailName: {
            firstName: "James",
            middleName: "Herbert",
            lastName: undefined
          }
        }
      });
    });

    await act(async () => {
      renderHookResult = renderHook(() => useAccountHolderName());
    });

    const { result } = renderHookResult;

    expect(result.current.accountHolderFirstName).toBe("James");
    expect(result.current.accountHolderMiddleName).toBe("Herbert");
    expect(result.current.accountHolderLastName).toBeUndefined();
    expect(result.current.accountHolderFullName).toBe("James Herbert");
  });

  it("should return appropriate name of business (SOHO) account holder if trade name available", async () => {
    let renderHookResult;
    jest.spyOn(manualApi, "manualApiFetch").mockImplementation(() => {
      return Promise.resolve({
        value: {
          businessName: {
            companyName: "1234567 Company ABC",
            tradeName: "Approved Capital Finance"
          }
        }
      });
    });

    await act(async () => {
      renderHookResult = renderHook(() => useAccountHolderName());
    });

    const { result } = renderHookResult;

    expect(result.current.accountHolderFirstName).toBe(
      "1234567 Company ABC (Approved Capital Finance)"
    );
    expect(result.current.accountHolderMiddleName).toBe("");
    expect(result.current.accountHolderLastName).toBe("");
    expect(result.current.accountHolderFullName).toBe(
      "1234567 Company ABC (Approved Capital Finance)"
    );
  });

  it("should return appropriate name of business (SOHO) account holder if no trade name available", async () => {
    let renderHookResult;
    jest.spyOn(manualApi, "manualApiFetch").mockImplementation(() => {
      return Promise.resolve({
        value: {
          businessName: {
            companyName: "1234567 Company ABC"
          }
        }
      });
    });

    await act(async () => {
      renderHookResult = renderHook(() => useAccountHolderName());
    });

    const { result } = renderHookResult;

    expect(result.current.accountHolderFirstName).toBe("1234567 Company ABC");
    expect(result.current.accountHolderMiddleName).toBe("");
    expect(result.current.accountHolderLastName).toBe("");
    expect(result.current.accountHolderFullName).toBe("1234567 Company ABC");
  });

  it("should return default values if network call fails", async () => {
    let renderHookResult;
    const error = "some account holder name fetching error";
    jest.spyOn(manualApi, "manualApiFetch").mockImplementation(() => {
      return Promise.reject(new Error(error));
    });

    await act(async () => {
      renderHookResult = renderHook(() => useAccountHolderName());
    });

    const { result } = renderHookResult;

    expect(result.current.accountHolderFirstName).toBe("");
    expect(result.current.accountHolderMiddleName).toBe("");
    expect(result.current.accountHolderLastName).toBe("");
    expect(result.current.accountHolderFullName).toBe("");
    expect(result.current.accountHolderNameError).toBe(error);
  });
});
