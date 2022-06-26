import MockDate from "mockdate";
import { mockApiData } from "utils/TestUtils";
import { billPaymentsBaseUrl } from "api";
import {
  getDatesForCompletedPayments,
  getDatesForFuturePayments,
  getPeriodDates,
  compareReviewDataForDuplicatePayments,
  getDuplicatePayments
} from "./useCheckDuplicatePayments";
import { duplicatePaymentSettingsOneTime } from "./constants";

describe("Testing period dates", () => {
  afterEach(() => {
    MockDate.reset();
  });
  beforeEach(() => {
    MockDate.set("2019-01-30T10:20:30Z");
  });
  it(">> should return proper dates", () => {
    let { toDate, fromDate } = getDatesForCompletedPayments(2);
    expect(toDate).toEqual("2019-01-30");
    expect(fromDate).toEqual("2019-01-28");

    ({ toDate, fromDate } = getDatesForCompletedPayments(10));
    expect(toDate).toEqual("2019-01-30");
    expect(fromDate).toEqual("2019-01-20");

    ({ toDate, fromDate } = getDatesForFuturePayments({
      period: "year",
      number: 1
    }));
    expect(toDate).toEqual("2020-01-30");
    expect(fromDate).toEqual("2019-01-30");

    ({ toDate, fromDate } = getDatesForFuturePayments({
      period: "month",
      number: 3
    }));
    expect(toDate).toEqual("2019-04-30");
    expect(fromDate).toEqual("2019-01-30");
  });

  it(">> should return default dates", () => {
    let { toDate, fromDate } = getDatesForCompletedPayments(null);
    expect(toDate).toEqual("2019-01-30");
    expect(fromDate).toEqual("2019-01-28");

    ({ toDate, fromDate } = getDatesForCompletedPayments(-1));
    expect(toDate).toEqual("2019-01-30");
    expect(fromDate).toEqual("2019-01-28");

    ({ toDate, fromDate } = getDatesForFuturePayments({
      period: "giberish",
      number: -1
    }));
    expect(toDate).toEqual("2020-01-30");
    expect(fromDate).toEqual("2019-01-30");
  });

  it(">> should call proper method on settings", () => {
    let { toDate, fromDate } = getPeriodDates("2019-01-30");
    expect(toDate).toEqual("2019-01-30");
    expect(fromDate).toEqual("2019-01-28");
    ({ toDate, fromDate } = getPeriodDates("2019-03-30"));
    expect(toDate).toEqual("2020-01-30");
    expect(fromDate).toEqual("2019-01-30");
  });
});

describe("Testing compareReviewDataForDuplicatePayments", () => {
  afterEach(() => {
    MockDate.reset();
  });
  beforeEach(() => {
    MockDate.set("2020-05-27T10:20:30Z");
  });
  const state = {
    fromAccounts: [
      { id: "account1", name: "Account 1", number: "121" },
      { id: "account2", name: "Account 2", number: "122" }
    ],
    billPayees: [
      { billPayeeId: "payee1", payeeName: "Payee 1", payeeNickname: "Nick 1" },
      { billPayeeId: "payee2", payeeName: "Payee 2", payeeNickname: "Nick 2" }
    ],
    from: "account1",
    to: "payee2",
    amount: "$10.00"
  };

  it(">> should return an empty array when no recent payments", () => {
    const result = compareReviewDataForDuplicatePayments(state, "");
    expect(result).toEqual([]);
  });
  it(">> should return an empty array when no match", () => {
    const recentPayments = [
      {
        amount: {
          currency: "CAD",
          value: 10
        },
        payeeName: "Payee 1",
        payeeNickname: "Nick 1",
        postedDate: "2021-05-27",
        sourceAccountNumber: "121",
        sourceAccountProductName: "Account1"
      }
    ];
    const result = compareReviewDataForDuplicatePayments(state, recentPayments);
    expect(result).toEqual([]);
  });
  it(">> should return properly when there is match", () => {
    const recentPayments = [
      {
        amount: {
          currency: "CAD",
          value: 10
        },
        payeeName: "Payee 2",
        payeeNickname: "Nick 2",
        postedDate: "2021-05-27",
        sourceAccountNumber: "121",
        sourceAccountProductName: "Account 1",
        paymentType: "Immediate"
      }
    ];
    const result = compareReviewDataForDuplicatePayments(state, recentPayments);
    expect(result).toEqual(recentPayments);
  });
  it(">> should return only matching payments", () => {
    const recentPayment1 = {
      amount: {
        currency: "CAD",
        value: 10
      },
      payeeName: "Payee 2",
      payeeNickname: "Nick 2",
      postedDate: "2021-05-27",
      sourceAccountNumber: "121",
      sourceAccountProductName: "Account 1",
      paymentType: "Immediate"
    };
    const recentPayment2 = {
      amount: {
        currency: "CAD",
        value: 20
      },
      payeeName: "Payee 2",
      payeeNickname: "Nick 2",
      postedDate: "2021-05-28",
      sourceAccountNumber: "122",
      sourceAccountProductName: "Account 2",
      paymentType: "Immediate"
    };

    const recentPayments = [recentPayment1, recentPayment2];

    const result = compareReviewDataForDuplicatePayments(state, recentPayments);
    expect(result).toEqual([recentPayment1]);
  });
});

describe("Testing getDuplicatePayments", () => {
  afterEach(() => {
    MockDate.reset();
  });
  beforeEach(() => {
    MockDate.set("2020-05-27T10:20:30Z");
  });
  const state = {
    fromAccounts: [
      { id: "account1", name: "Account 1", number: "121" },
      { id: "account2", name: "Account 2", number: "122" }
    ],
    billPayees: [
      {
        billPayeeId: "payee1",
        payeeName: "Payee 1",
        payeeNickname: "Nick 1"
      },
      { billPayeeId: "payee2", payeeName: "Payee 2", payeeNickname: "Nick 2" }
    ],
    from: "account1",
    to: "payee2",
    amount: "$10.00",
    when: "2020-05-27"
  };

  const recentPayment1 = {
    amount: {
      currency: "CAD",
      value: 10
    },
    payeeName: "Payee 2",
    payeeNickname: "Nick 2",
    postedDate: "2020-05-27",
    sourceAccountNumber: "121",
    sourceAccountProductName: "Account 1",
    paymentType: "One Time Future Dated"
  };
  const recentPayment2 = {
    amount: {
      currency: "CAD",
      value: 20
    },
    payeeName: "Payee 2",
    payeeNickname: "Nick 2",
    postedDate: "2020-05-28",
    sourceAccountNumber: "122",
    sourceAccountProductName: "Account 2",
    paymentType: "One Time Future Dated"
  };

  const recentPayments = [recentPayment1, recentPayment2];

  it(">> should get duplicate payments if any", async () => {
    mockApiData([
      {
        url: `${billPaymentsBaseUrl}/billpayments?status=completed,pending&fromDate=2020-05-25&toDate=2020-05-27`,
        results: recentPayments,
        status: 200,
        method: "get"
      }
    ]);
    const updateState = jest.fn();
    const result = await getDuplicatePayments(state, updateState);
    expect(result).toEqual([recentPayment1]);
    expect(updateState).toBeCalledTimes(2);
    expect(updateState).toHaveBeenNthCalledWith(1, {
      data: { name: "fetchingPayments", value: false },
      type: "ON_CHANGE"
    });
    expect(updateState).toHaveBeenNthCalledWith(2, {
      data: {
        name: "matchingPayments",
        value: [
          {
            amount: { currency: "CAD", value: 10 },
            payeeName: "Payee 2",
            payeeNickname: "Nick 2",
            postedDate: "2020-05-27",
            sourceAccountNumber: "121",
            sourceAccountProductName: "Account 1",
            paymentType: "One Time Future Dated"
          }
        ]
      },
      type: "ON_CHANGE"
    });
  });
  it(">> should return empty array if no duplicate payments", async () => {
    mockApiData([
      {
        url: `${billPaymentsBaseUrl}/billpayments?status=completed,pending&fromDate=2020-05-25&toDate=2020-05-27`,
        results: "",
        status: 204,
        method: "get"
      }
    ]);
    const updateState = jest.fn();
    const result = await getDuplicatePayments(
      state,
      updateState,
      duplicatePaymentSettingsOneTime
    );
    expect(result).toEqual([]);
    expect(updateState).toBeCalledTimes(2);
    expect(updateState).toHaveBeenNthCalledWith(1, {
      data: { name: "fetchingPayments", value: false },
      type: "ON_CHANGE"
    });
    expect(updateState).toHaveBeenNthCalledWith(2, {
      data: {
        name: "matchingPayments",
        value: []
      },
      type: "ON_CHANGE"
    });
  });
});
