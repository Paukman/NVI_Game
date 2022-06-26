import { transferErrors } from "utils/MessageCatalog";
import {
  transformScheduledTransfer,
  setInvestmentMessage
} from "./transformScheduledTransfer";
import {
  oneTimeTransferDetailsData,
  recurringTransferWithNoEndDateData,
  recurringTransferWithEndDateData
} from "./scheduledTransfersTestData";

describe("Verify Transfer Data is getting transformed", () => {
  it(">> One Time Data", () => {
    const results = {
      From: {
        visible: true,
        imageIcon: "account.svg",
        title: "From",
        label: "No-Fee All-In Account (9479)"
      },
      DownArrow: {
        visible: true,
        imageIcon: "arrow_down.svg"
      },
      To: {
        visible: true,
        imageIcon: "account.svg",
        title: "To",
        label: "Springboard Savings Account (8379)"
      },
      Amount: {
        visible: true,
        imageIcon: "money.svg",
        title: "Amount",
        label: "$1.00"
      },
      When: {
        visible: true,
        imageIcon: "calendar.svg",
        title: "When",
        label: "May 08, 2020"
      },
      Ending: {
        visible: false,
        imageIcon: "end-date.svg",
        title: "Ending",
        label: ""
      },
      Frequency: {
        visible: false,
        imageIcon: "frequency.svg",
        title: "Frequency",
        label: ""
      },
      NextScheduledDate: {
        visible: false,
        imageIcon: "scheduled-transactions.svg",
        title: "Next scheduled",
        label: "May 08, 2020"
      },
      NumOfTransfers: {
        visible: false,
        imageIcon: "recurring.svg",
        title: "Number of transfers remaining",
        label: "1 transfers"
      },
      Message: {
        visible: false,
        message: null
      }
    };

    const formattedData = transformScheduledTransfer(
      oneTimeTransferDetailsData
    );
    expect(formattedData).toEqual(results);
  });

  it(">> Recurring With No End date Data", () => {
    const results = {
      From: {
        visible: true,
        imageIcon: "account.svg",
        title: "From",
        label: "Unlimited Account (6779)"
      },
      DownArrow: {
        visible: true,
        imageIcon: "arrow_down.svg"
      },
      To: {
        visible: true,
        imageIcon: "account.svg",
        title: "To",
        label: "Springboard Savings Account (8379)"
      },
      Amount: {
        visible: true,
        imageIcon: "money.svg",
        title: "Amount",
        label: "$3.33"
      },
      When: {
        visible: false,
        imageIcon: "calendar.svg",
        title: "When",
        label: "May 17, 2020"
      },
      Ending: {
        visible: true,
        imageIcon: "end-date.svg",
        title: "Ending",
        label: "Never"
      },
      Frequency: {
        visible: true,
        imageIcon: "frequency.svg",
        title: "Frequency",
        label: "Weekly"
      },
      NextScheduledDate: {
        visible: true,
        imageIcon: "scheduled-transactions.svg",
        title: "Next scheduled",
        label: "May 17, 2020"
      },
      NumOfTransfers: {
        visible: false,
        imageIcon: "recurring.svg",
        title: "Number of transfers remaining",
        label: "2 transfers"
      },
      Message: {
        visible: false,
        message: null
      }
    };

    const formattedData = transformScheduledTransfer(
      recurringTransferWithNoEndDateData
    );
    expect(formattedData).toEqual(results);
  });

  it(">> Recurring Data End Date", () => {
    const results = {
      From: {
        visible: true,
        imageIcon: "account.svg",
        title: "From",
        label: "Unlimited Account (6779)"
      },
      DownArrow: {
        visible: true,
        imageIcon: "arrow_down.svg"
      },
      To: {
        visible: true,
        imageIcon: "account.svg",
        title: "To",
        label: "Springboard Savings Account (8379)"
      },
      Amount: {
        visible: true,
        imageIcon: "money.svg",
        title: "Amount",
        label: "$3.33"
      },
      When: {
        visible: false,
        imageIcon: "calendar.svg",
        title: "When",
        label: "May 17, 2020"
      },
      Ending: {
        visible: true,
        imageIcon: "end-date.svg",
        title: "Ending",
        label: "Jun 14, 2020"
      },
      Frequency: {
        visible: true,
        imageIcon: "frequency.svg",
        title: "Frequency",
        label: "Weekly"
      },
      NextScheduledDate: {
        visible: true,
        imageIcon: "scheduled-transactions.svg",
        title: "Next scheduled",
        label: "May 17, 2020"
      },
      NumOfTransfers: {
        visible: true,
        imageIcon: "recurring.svg",
        title: "Number of transfers remaining",
        label: "2 transfers"
      },
      Message: {
        visible: false,
        message: null
      }
    };
    const formattedData = transformScheduledTransfer(
      recurringTransferWithEndDateData
    );
    expect(formattedData).toEqual(results);
  });
});

describe("Test setInvestmentMessage", () => {
  it("test To RRSP contribution", () => {
    const data = {
      sourceAccountProductName: "Basic Account",
      sourceAccountProductGroup: "Chequing",
      targetAccountProductName: "Daily interest RRSP",
      targetAccountProductGroup: "RSP"
    };

    const expectedReturn = {
      visible: true,
      message: transferErrors.MSG_RBTR_044
    };

    const results = setInvestmentMessage(data);

    expect(results).toEqual(expectedReturn);
  });

  it("test To TFSA contribution", () => {
    const data = {
      sourceAccountProductName: "Basic Account",
      sourceAccountProductGroup: "Chequing",
      targetAccountProductName: "TFSA Account",
      targetAccountProductGroup: "TFSA"
    };

    const expectedReturn = {
      visible: true,
      message: transferErrors.MSG_RBTR_044B
    };

    const results = setInvestmentMessage(data);

    expect(results).toEqual(expectedReturn);
  });

  it("test FROM TFSA disbursement", () => {
    const data = {
      sourceAccountProductName: "TFSA Account",
      sourceAccountProductGroup: "TFSA",
      targetAccountProductName: "Basic Account",
      targetAccountProductGroup: "Chequing"
    };

    const expectedReturn = {
      visible: true,
      message: transferErrors.MSG_RBTR_045
    };

    const results = setInvestmentMessage(data);

    expect(results).toEqual(expectedReturn);
  });

  it("test null case", () => {
    const data = {
      sourceAccountProductName: "TFSA Account",
      sourceAccountProductGroup: "TFSA",
      targetAccountProductName: "Basic Account",
      targetAccountProductGroup: null
    };

    const expectedReturn = {
      visible: false,
      message: null
    };

    const results = setInvestmentMessage(data);

    expect(results).toEqual(expectedReturn);
  });
});
