import dayjs from "dayjs";
import { transformETransfer, transformSubmitData } from "./transformETransfer";

// TODO - these tests are not ideal, validating the outcome is more important than the functionality - these should be under SendETransfer
describe("Verify submitted data is getting transformed for Review and Complete", () => {
  let submitData = {
    from: {
      name: "My Chequing Account(9903)-$1,11.44"
    },
    to: {
      name: "Betty Whitaker(betty_whitaker@gmail.com)"
    },
    amount: "$25.00",
    message: "Money for dinner",
    securityQuestion: "What is your favourite icecream?"
  };

  let results = {
    From: {
      visible: true,
      imageIcon: "account.svg",
      title: "From",
      label: "My Chequing Account(9903)-$1,11.44"
    },
    DownArrow: {
      visible: true,
      imageIcon: "arrow_down.svg"
    },
    To: {
      visible: true,
      imageIcon: "person.svg",
      title: "To",
      label: "Betty Whitaker(betty_whitaker@gmail.com)"
    },
    SecurityQuestion: {
      visible: true,
      imageIcon: "question.svg",
      title: "Security question",
      label: "What is your favourite icecream?"
    },
    SecurityAnswer: {
      visible: true,
      imageIcon: "answer.svg",
      title: "Security answer"
    },
    Amount: {
      visible: true,
      imageIcon: "money.svg",
      title: "Amount",
      label: "$25.00"
    },
    CreatedTime: {
      visible: true,
      imageIcon: "calendar.svg",
      title: "When",
      label: dayjs().format("MMM DD, YYYY")
    },
    Message: {
      visible: true,
      imageIcon: "message.svg",
      title: "Message",
      label: "Money for dinner"
    }
  };

  it(">> it transforms data correctly", () => {
    const formattedData = transformETransfer(submitData);
    expect(formattedData).toEqual(results);
  });

  submitData = {
    from: {
      name: "My Chequing Account(9903)-$1,11.44"
    },
    to: {
      name: "Betty Whitaker(betty_whitaker@gmail.com)"
    },
    amount: "$25.00",
    securityQuestion: "What is your favourite icecream?"
  };

  results = {
    From: {
      visible: true,
      imageIcon: "account.svg",
      title: "From",
      label: "My Chequing Account(9903)-$1,11.44"
    },
    DownArrow: {
      visible: true,
      imageIcon: "arrow_down.svg"
    },
    To: {
      visible: true,
      imageIcon: "person.svg",
      title: "To",
      label: "Betty Whitaker(betty_whitaker@gmail.com)"
    },
    SecurityQuestion: {
      visible: true,
      imageIcon: "question.svg",
      title: "Security question",
      label: "What is your favourite icecream?"
    },
    SecurityAnswer: {
      visible: true,
      imageIcon: "answer.svg",
      title: "Security answer"
    },
    Amount: {
      visible: true,
      imageIcon: "money.svg",
      title: "Amount",
      label: "$25.00"
    },
    CreatedTime: {
      visible: true,
      imageIcon: "calendar.svg",
      title: "When",
      label: dayjs().format("MMM DD, YYYY")
    },
    Message: {
      visible: false,
      imageIcon: "message.svg",
      title: "Message",
      label: "None"
    }
  };

  it(">> it transforms data correctly for no message present", () => {
    const formattedData = transformETransfer(submitData);
    expect(formattedData).toEqual(results);
  });

  submitData = {
    from: {
      name: "My Chequing Account(9903)-$1,11.44"
    },
    to: {
      name: "Betty Whitaker(betty_whitaker@gmail.com)"
    },
    amount: "$25.00",
    message: "Money for dinner",
    securityQuestion: undefined
  };

  results = {
    From: {
      visible: true,
      imageIcon: "account.svg",
      title: "From",
      label: "My Chequing Account(9903)-$1,11.44"
    },
    DownArrow: {
      visible: true,
      imageIcon: "arrow_down.svg"
    },
    To: {
      visible: true,
      imageIcon: "person.svg",
      title: "To",
      label: "Betty Whitaker(betty_whitaker@gmail.com)"
    },
    SecurityQuestion: {
      visible: true,
      imageIcon: "question.svg",
      title: "Security question",
      label:
        "This transaction can't be cancelled, as this recipient has registered for Autodeposit, so no security question was required."
    },
    SecurityAnswer: {
      visible: false,
      imageIcon: "answer.svg",
      title: "Security answer"
    },
    Amount: {
      visible: true,
      imageIcon: "money.svg",
      title: "Amount",
      label: "$25.00"
    },
    CreatedTime: {
      visible: true,
      imageIcon: "calendar.svg",
      title: "When",
      label: dayjs().format("MMM DD, YYYY")
    },
    Message: {
      visible: true,
      imageIcon: "message.svg",
      title: "Message",
      label: "Money for dinner"
    }
  };

  it(">> it transforms data correctly for user registered with Auto Deposit", () => {
    const formattedData = transformETransfer(submitData);
    expect(formattedData).toEqual(results);
  });
});

describe(">> Verify submitted data is getting transformed for Post", () => {
  let submitData = {
    from: {
      name: "My Chequing Account(9903)-$1,11.44",
      id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      currency: "CAD"
    },
    to: {
      name: "Betty Whitaker(betty_whitaker@gmail.com)",
      id: "CAuTRu9eXMwp"
    },
    amount: "25.00",
    message: "Money for dinner",
    securityQuestion: "What is your favourite icecream?"
  };

  let results = {
    eTransferType: "Regular eTransfer",
    fromAccount: {
      name: "My Chequing Account(9903)-$1,11.44",
      id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
    },
    recipient: {
      recipientId: "CAuTRu9eXMwp",
      aliasName: "Betty Whitaker(betty_whitaker@gmail.com)"
    },
    amount: {
      value: 25.0,
      currency: "CAD"
    },
    memo: "Money for dinner"
  };

  it(">> it transforms data correctly for form submit", () => {
    const formattedData = transformSubmitData(submitData);
    expect(formattedData).toEqual(results);
  });

  submitData = {
    directDepositNumber: "123ABC",
    from: {
      name: "My Chequing Account(9903)-$1,11.44",
      id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      currency: "CAD"
    },
    to: {
      name: "Betty Whitaker(betty_whitaker@gmail.com)",
      id: "CAuTRu9eXMwp"
    },
    amount: "25.00",
    message: "Money for dinner",
    securityQuestion: "What is your favourite icecream?"
  };

  results = {
    eTransferType: "Direct Deposit eTransfer",
    fromAccount: {
      name: "My Chequing Account(9903)-$1,11.44",
      id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
    },
    recipient: {
      recipientId: "CAuTRu9eXMwp",
      aliasName: "Betty Whitaker(betty_whitaker@gmail.com)"
    },
    amount: {
      value: 25.0,
      currency: "CAD"
    },
    memo: "Money for dinner",
    directDepositReferenceNumber: "123ABC"
  };

  it(">> it transforms data correctly for Auto Deposit", () => {
    const formattedData = transformSubmitData(submitData);
    expect(formattedData).toEqual(results);
  });
});
