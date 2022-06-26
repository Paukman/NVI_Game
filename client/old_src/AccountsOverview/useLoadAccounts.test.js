import React from "react";
import PropTypes from "prop-types";
import { renderHook } from "@testing-library/react-hooks";
import { mockApiData, windowMatchMediaMock } from "utils/TestUtils";
import DataStore from "utils/store";

import { AntModalContext } from "StyleGuide/Components/Modal";

import useLoadAccounts, {
  accountsWithQuickActionsURL
} from "./useLoadAccounts";

const Wrapper = () => {
  const Component = props => {
    const { children } = props;
    return (
      <AntModalContext.Provider
        value={{ close: () => null, show: () => null, antModal: null }}
      >
        {children}
      </AntModalContext.Provider>
    );
  };
  Component.propTypes = {
    children: PropTypes.element.isRequired
  };
  return Component;
};

describe("Testing useLoadAccounts", () => {
  beforeEach(() => {
    DataStore.flush();
    windowMatchMediaMock();
  });
  afterEach(() => {
    DataStore.flush();
  });
  it(">> should set state on success getting the accounts ", async () => {
    mockApiData([
      {
        url: accountsWithQuickActionsURL,
        results: {
          errors: {
            deposit: true,
            creditcards: false
          },
          accounts: [
            {
              id: "1abc",
              nickname: "Some",
              name: "No-Fee All-In Account",
              number: "7679",
              availableBalance: { currency: "USD", value: 152.11 },
              type: "Deposit",
              balance: {
                currency: "USD",
                value: 152.11
              },
              bankAccount: {
                accountId: "000123",
                routingId: "01234",
                country: "USD"
              },
              quickActions: {
                contribute: false,
                etransfer: true,
                makeBillPayment: false,
                makePayment: false,
                payBill: true,
                transferFrom: true
              }
            },
            {
              id: "6x-FZCO-1jyA3N9qiFhiwhQDItM_vm2eUt7zYut5QU0",
              availableBalance: { currency: "CAD", value: 20000 },
              balance: { currency: "CAD", value: 0 },
              billPayeeKey: "467e4ac0710f5118800249c117cba2a7",
              creditCardNumber: "5439971004738888",
              currency: "CAD",
              customerId: "0002764728",
              isBusinessCard: false,
              name: "Gold My Rewards Mastercard",
              nickname: null,
              number: "8888",
              partialCreditCardNumber: "543997******8888",
              quickActions: {
                transferFrom: false,
                payBill: false,
                etransfer: false,
                makePayment: false,
                contribute: false,
                makeBillPayment: true
              },
              status: "Effective",
              subProductCode: "CARD_MCACC",
              type: "CreditCard"
            }
          ]
        }
      }
    ]);
    const hook = renderHook(() => useLoadAccounts(), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;

    await waitForNextUpdate();

    expect(result.current.accounts.allAccounts[0]).toEqual(
      {
        type: "deposit",
        id: "1abc",
        name: "Some",
        currentBalance: 152.11,
        number: "7679",
        availableBalance: 152.11,
        currency: "USD",
        bankAccount: {
          accountId: "000123",
          routingId: "01234",
          country: "USD"
        },
        quickActions: {
          contribute: false,
          etransfer: true,
          makeBillPayment: false,
          makePayment: false,
          payBill: true,
          transferFrom: true
        }
      },
      {
        id: "6x-FZCO-1jyA3N9qiFhiwhQDItM_vm2eUt7zYut5QU0",
        availableBalance: 20000,
        currentBalance: 0,
        currency: "CAD",
        number: "8888",
        bankAccount: undefined,
        quickActions: {
          transferFrom: false,
          payBill: false,
          etransfer: false,
          makePayment: false,
          contribute: false,
          makeBillPayment: true
        },
        type: "creditcard"
      }
    );
    expect(result.current.accounts.fetchAccountErrors).toMatchObject({
      creditcards: false,
      deposit: true
    });
  });
  it(">> should set state on failed API call ", async () => {
    mockApiData([
      {
        url: accountsWithQuickActionsURL,
        results: {},
        method: "GET",
        error: { response: 400 }
      }
    ]);
    const hook = renderHook(() => useLoadAccounts(), {
      wrapper: Wrapper()
    });
    const { result, waitForNextUpdate } = hook;

    await waitForNextUpdate();
    expect(result.current.accounts.generalError).toEqual(true);
  });
});
