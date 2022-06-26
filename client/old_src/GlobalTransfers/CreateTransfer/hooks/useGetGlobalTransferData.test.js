import { mockApiData, createQueryWrapper } from "utils/TestUtils";
import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import useGetGlobalTransfersInfo from "./useGetGlobalTransferData";

const recipientsUrl = "/api/atb-rebank-api-globaltransfers/recipients";
const accountsUrl =
  "/api/atb-rebank-api-accounts-ts/sortedEligibleAccounts?feature=GlobalTransfers";
const userInfoUrl = "/api/atb-rebank-api-globaltransfers/user";
const mockRecipientReturn = ["person"];
const mockAccountResult = [
  { name: "some account", availableBalance: { value: 5 } },
  { name: "some other account", availableBalance: { value: 4 } }
];
const mockUserInfoResult = {
  buildingName: "",
  city: "Calgary",
  street: "16 Arbour Ridge Mews NW",
  addressLine2: "addressline2",
  houseNumber: "678",
  postalCode: "T3G 3Z3",
  unitNumber: "12",
  floorNumber: "109",
  country: "CA",
  region: "AB",
  careOfName: ""
};
const formattedUserAddress = "678 16 Arbour Ridge Mews NW, Calgary AB, T3G 3Z3";

jest.mock("antd");

describe("useGetGlobalTransferData hook", () => {
  const createWrapper = () => {
    const QueryWrapper = createQueryWrapper();
    // eslint-disable-next-line react/prop-types
    return ({ children }) => (
      <QueryWrapper>
        <MemoryRouter initialEntries={[`/move-money/global-transfers`]}>
          {children}
        </MemoryRouter>
      </QueryWrapper>
    );
  };

  const renderHookWithWrapper = () => {
    const { result, waitFor } = renderHook(() => useGetGlobalTransfersInfo(), {
      wrapper: createWrapper()
    });

    return { result, waitFor };
  };

  it("should return data when the calls resolve successfully", async () => {
    mockApiData([
      {
        url: recipientsUrl,
        results: {
          recipients: mockRecipientReturn
        }
      },
      {
        url: accountsUrl,
        results: mockAccountResult
      },
      {
        url: userInfoUrl,
        results: {
          address: mockUserInfoResult
        }
      }
    ]);

    let hook;
    await act(async () => {
      hook = renderHookWithWrapper();
    });

    const { result } = hook;

    expect(result.current.recipientList).toBe(mockRecipientReturn);
    expect(result.current.accountList.length).toBe(2);
    expect(result.current.userAddress).toBe(formattedUserAddress);
  });

  it("should return an error if the GET recipients call fails", async () => {
    mockApiData([
      {
        url: recipientsUrl,
        error: 500
      },
      {
        url: accountsUrl,
        results: mockAccountResult
      }
    ]);

    let hook;
    await act(async () => {
      hook = renderHookWithWrapper();
    });

    const { result } = hook;

    expect(result.current.isError).toBe(true);
  });

  it("should return an error if the GET accounts call fails", async () => {
    mockApiData([
      {
        url: recipientsUrl,
        results: {
          recipients: mockRecipientReturn
        }
      },
      {
        url: accountsUrl,
        error: 500
      }
    ]);

    let hook;
    await act(async () => {
      hook = renderHookWithWrapper();
    });

    const { result } = hook;

    expect(result.current.isError).toBe(true);
  });

  it("should return an error if the GET userInfo call fails", async () => {
    mockApiData([
      {
        url: recipientsUrl,
        results: {
          recipients: mockRecipientReturn
        }
      },
      {
        url: accountsUrl,
        results: mockAccountResult
      },
      {
        url: userInfoUrl,
        error: 500
      }
    ]);

    let hook;
    await act(async () => {
      hook = renderHookWithWrapper();
    });

    const { result } = hook;

    expect(result.current.isError).toBe(true);
  });
});
