import React from "react";
import dayjs from "dayjs";
import person from "assets/icons/Person/person.svg";
import money from "assets/icons/Money/money.svg";
import message from "assets/icons/Message/message.svg";
import endDate from "assets/icons/End Date/end-date.svg";
import fromAccount from "assets/icons/FromAccount/account.svg";
import checkMark from "assets/icons/CheckMark/checkmark-green.svg";
import statement from "assets/icons/Statement/statement.svg";
import { formatName, formatNumber } from "utils/formUtils";
import { formatCurrency } from "utils";
import { getRequester } from "./utils";

export const transformFulfillRequest = (data, postData, width) => {
  return {
    CheckMark: {
      visible: true,
      imageIcon: checkMark,
      title: "",
      label: (
        <>
          You’ve successfully fulfilled a request for money by <em>Interac</em>{" "}
          e-Transfer<sup>&#174;</sup>.
        </>
      )
    },
    To: {
      visible: true,
      imageIcon: person,
      title: "Requester",
      label: getRequester(data)
    },
    Amount: {
      visible: true,
      imageIcon: money,
      title: "Requested amount",
      label: formatCurrency(data.amount / 100)
    },
    MessageFromRequester: {
      visible: data.beneficiaryMessage !== null && true,
      imageIcon: message,
      title: "Message from requester",
      label: data.beneficiaryMessage
    },
    InvoiceNumber: {
      visible:
        data.invoiceDetail !== null && data.invoiceDetail.invoiceNumber && true,
      imageIcon: statement,
      title: "Invoice number",
      label:
        data.invoiceDetail !== null ? data.invoiceDetail.invoiceNumber : null
    },
    InvoiceDate: {
      visible:
        data.invoiceDetail !== null &&
        data.invoiceDetail.dueDate &&
        data.invoiceDetail.dueDate !== "" &&
        true,
      imageIcon: endDate,
      title: "Invoice due",
      label:
        data.invoiceDetail !== null &&
        data.invoiceDetail.dueDate &&
        data.invoiceDetail.dueDate !== ""
          ? dayjs(data.invoiceDetail.dueDate).format("MMM DD, YYYY")
          : null
    },
    From: {
      visible: !!postData.from,
      imageIcon: fromAccount,
      title: "From",
      label: postData.from
        ? `${formatName(postData.from)} ${formatNumber(postData.from, width)}`
        : ""
    },
    Message: {
      visible: !!postData.message,
      imageIcon: message,
      title: "Message",
      label: postData.message
    }
  };
};
