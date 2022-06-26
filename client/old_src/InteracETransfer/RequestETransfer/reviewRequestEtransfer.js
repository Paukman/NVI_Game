import { fees } from "globalConstants";

import calendar from "assets/icons/Calendar/calendar.svg";
import accountIcon from "assets/icons/FromAccount/account.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import personIcon from "assets/icons/Person/person.svg";
import messageIcon from "assets/icons/Message/message.svg";
import downArrowIcon from "assets/icons/DownArrow/arrow_down.svg";
import feeIcon from "assets/icons/Fee/fee.svg";
import { requestETransferErrors } from "utils/MessageCatalog";

import dayjs from "dayjs";

export const getRequestEtransferReviewData = formData => {
  return {
    From: {
      visible: true,
      imageIcon: personIcon,
      title: "Request from",
      label: formData.from?.name
    },
    DownArrow: {
      visible: true,
      imageIcon: downArrowIcon
    },
    To: {
      visible: true,
      imageIcon: accountIcon,
      title: "Deposit account",
      label: formData.to?.name
    },
    Amount: {
      visible: true,
      imageIcon: moneyIcon,
      title: "Request amount",
      label: formData.amount
    },
    Fee: {
      visible: true,
      imageIcon: feeIcon,
      title: "Transaction fee",
      label: fees.ETRANSFER_REQUEST
    },
    CreatedTime: {
      visible: true,
      imageIcon: calendar,
      title: "When",
      label: dayjs().format("MMM DD, YYYY")
    },
    RequestMessage: {
      visible: !!formData.message,
      imageIcon: messageIcon,
      title: "Message",
      label: formData.message ? formData.message : "None"
    },
    Message: {
      visible: true,
      message: requestETransferErrors.MSG_RBET_052C(formData.legalName)
    }
  };
};

export const transformSubmitData = data => {
  if (!data) {
    return {
      recipientId: null,
      accountId: null,
      amount: null,
      amountCurrency: "CAD"
    };
  }
  const transformedData = {
    recipientId: data.from ? data.from.id : null,
    accountId: data.to ? data.to.id : null,
    amount: data.amount
      ? parseFloat(Number(data.amount.replace(/[^0-9.-]+/g, ""))).toFixed(2)
      : null,
    amountCurrency: "CAD",
    beneficiaryMessage: data.message ? data.message : null
  };

  return transformedData;
};
