import accountIcon from "assets/icons/FromAccount/account.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import personIcon from "assets/icons/Person/person.svg";
import messageIcon from "assets/icons/Message/message.svg";
import questionIcon from "assets/icons/Question/question.svg";
import answerIcon from "assets/icons/Answer/answer.svg";
import calendarIcon from "assets/icons/Calendar/calendar.svg";
import downArrowIcon from "assets/icons/DownArrow/arrow_down.svg";
import { formatCurrency } from "utils";
import dayjs from "dayjs";

export const transformETransfer = data => {
  return {
    From: {
      visible: true,
      imageIcon: accountIcon,
      title: "From",
      label: data.from && data.from.name
    },
    DownArrow: {
      visible: true,
      imageIcon: downArrowIcon
    },
    To: {
      visible: true,
      imageIcon: personIcon,
      title: "To",
      label: data.to && data.to.name
    },
    SecurityQuestion: {
      visible: true,
      imageIcon: questionIcon,
      title: "Security question",
      // TODO - this error should be coming from our global errors || content module, not static
      label: data.securityQuestion
        ? data.securityQuestion
        : "This transaction can't be cancelled, as this recipient has registered for Autodeposit, so no security question was required."
    },
    SecurityAnswer: {
      visible: !!data.securityQuestion,
      imageIcon: answerIcon,
      title: "Security answer"
    },
    Amount: {
      visible: true,
      imageIcon: moneyIcon,
      title: "Amount",
      label: formatCurrency(data.amount)
    },
    CreatedTime: {
      visible: true,
      imageIcon: calendarIcon,
      title: "When",
      label: dayjs().format("MMM DD, YYYY")
    },
    Message: {
      visible: !!data.message,
      imageIcon: messageIcon,
      title: "Message",
      label: data.message ? data.message : "None"
    }
  };
};

export const transformSubmitData = data => {
  const transformedData = {
    eTransferType: data.directDepositNumber
      ? "Direct Deposit eTransfer"
      : "Regular eTransfer",
    fromAccount: {
      name: data.from ? data.from.name : null,
      id: data.from ? data.from.id : ""
    },
    recipient: {
      recipientId: data.to ? data.to.id : "",
      aliasName: data.to ? data.to.name : ""
    },
    amount: {
      value: Number(data.amount),
      currency: data.from ? data.from.currency : ""
    },
    memo: data.message
  };

  if (data.directDepositNumber) {
    return {
      ...transformedData,
      directDepositReferenceNumber: data.directDepositNumber
    };
  }

  return transformedData;
};
