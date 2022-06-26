import dayjs from "dayjs";
import { requestETransferErrors } from "utils/MessageCatalog";
import {
  getRequestEtransferReviewData,
  transformSubmitData
} from "./reviewRequestEtransfer";

describe("Verify submitted data is getting transformed", () => {
  it(">> it transforms data correctly", () => {
    const submitData = {
      // 'to' = The account to which the money should be deposited into.
      to: {
        name: "My Chequing Account(9903)-$1,11.44"
      },
      // 'from' = The person from which the money is being requested.
      from: {
        name: "Betty Whitaker(betty_whitaker@gmail.com)"
      },
      amount: "$25.00",
      message: "Money for dinner",
      legalName: "James Herbert Bond"
    };

    const results = {
      From: {
        visible: true,
        imageIcon: "person.svg",
        title: "Request from",
        label: "Betty Whitaker(betty_whitaker@gmail.com)"
      },
      DownArrow: {
        visible: true,
        imageIcon: "arrow_down.svg"
      },
      To: {
        visible: true,
        imageIcon: "account.svg",
        title: "Deposit account",
        label: "My Chequing Account(9903)-$1,11.44"
      },
      Amount: {
        visible: true,
        imageIcon: "money.svg",
        title: "Request amount",
        label: "$25.00"
      },
      Fee: {
        visible: true,
        imageIcon: "fee.svg",
        title: "Transaction fee",
        label: "$1.50"
      },
      CreatedTime: {
        visible: true,
        imageIcon: "calendar.svg",
        title: "When",
        label: dayjs().format("MMM DD, YYYY")
      },
      RequestMessage: {
        visible: true,
        imageIcon: "message.svg",
        title: "Message",
        label: "Money for dinner"
      },
      Message: {
        visible: true,
        message: requestETransferErrors.MSG_RBET_052C("James Herbert Bond")
      }
    };
    const formattedData = getRequestEtransferReviewData(submitData);
    expect(formattedData).toEqual(results);
  });
});

describe("Verify formatting of transformed data", () => {
  it("returns proper formatting", () => {
    let data = null;
    let result = transformSubmitData(data);
    expect(result).toMatchObject({
      recipientId: null,
      accountId: null,
      amount: null,
      amountCurrency: "CAD"
    });
    data = {
      from: null
    };
    result = transformSubmitData(data);
    expect(result).toMatchObject({
      recipientId: null,
      accountId: null,
      amount: null,
      amountCurrency: "CAD"
    });
    data = {
      amount: null
    };
    result = transformSubmitData(data);
    expect(result).toMatchObject({
      recipientId: null,
      accountId: null,
      amount: null,
      amountCurrency: "CAD"
    });
    data = {
      amount: "$10.00"
    };
    result = transformSubmitData(data);
    expect(result).toMatchObject({
      recipientId: null,
      accountId: null,
      amount: "10.00",
      amountCurrency: "CAD"
    });
  });
});
