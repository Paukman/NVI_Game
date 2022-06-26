import { mapToOverview, mapTotals } from "./utils";

describe("mapTotals function", () => {
  it("ensures that mapTotals ignores empty object", () => {
    expect(mapTotals(undefined)).toEqual({});
  });
  it("ensures that mapTotals ignores empty props", () => {
    expect(mapTotals({ deposit: {} })).toEqual({});
  });
  it("ensures that mapTotals maps totals correctly", () => {
    expect(
      mapTotals({
        deposit: {
          CAD: 15.5,
          USD: 5.6
        },
        investment: {
          CAD: 6.0
        },
        loan: {
          USD: 45
        },
        creditCard: {
          CAD: 4000
        },
        prepaidCard: {
          USD: 4
        }
      })
    ).toEqual({
      depositTotals: {
        CAD: 15.5,
        USD: 5.6
      },
      investmentTotals: {
        CAD: 6.0
      },
      loanTotals: {
        USD: 45
      },
      creditCardTotals: {
        CAD: 4000
      },
      prepaidCardTotals: {
        USD: 4
      }
    });
  });
});

describe("mapToOverview function", () => {
  it("map object", () => {
    expect(mapToOverview("")).toEqual([]);
    expect(mapToOverview([])).toEqual([]);
    expect(mapToOverview([{ id: 123 }])).toEqual([
      {
        availableBalance: "",
        currency: "",
        currentBalance: "",
        id: 123,
        name: "",
        number: "",
        type: "",
        bankAccount: undefined,
        quickActions: undefined
      }
    ]);

    const mappedAccounts = mapToOverview(
      [
        {
          id: 123,
          nickname: "deposit nickname",
          name: "Deposit account",
          number: "2233",
          type: "Deposit",
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
        }
      ],
      [
        {
          id: 321,
          name: "Credit card account",
          number: "4455",
          type: "CreditCard",
          creditCardNumber: "123456789",
          associatedCreditCardNumbers: ["987654321"],
          currency: "CAD",
          quickActions: {
            contribute: false,
            etransfer: false,
            makeBillPayment: true,
            makePayment: false,
            payBill: false,
            transferFrom: false
          }
        }
      ]
    );
    expect(mappedAccounts).toEqual(
      [
        {
          availableBalance: "",
          currency: "",
          currentBalance: "",
          id: 123,
          name: "deposit nickname",
          number: "2233",
          type: "deposit",
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
        }
      ],
      [
        {
          availableBalance: "",
          currentBalance: "",
          id: 321,
          name: "Credit card account",
          number: "4455",
          type: "creditcard",
          creditCardNumber: "123456789",
          associatedCreditCardNumbers: ["987654321"],
          currency: "CAD",
          quickActions: {
            contribute: false,
            etransfer: false,
            makeBillPayment: true,
            makePayment: false,
            payBill: false,
            transferFrom: false
          }
        }
      ]
    );
  });
});
