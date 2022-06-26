import dayjs from "dayjs";
import accountIcon from "assets/icons/FromAccount/account.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import downArrowIcon from "assets/icons/DownArrow/arrow_down.svg";
import calendar from "assets/icons/Calendar/calendar.svg";
import frequency from "assets/icons/Frequency/frequency.svg";
import endDate from "assets/icons/End Date/end-date.svg";
import recurring from "assets/icons/Recurring/recurring.svg";
import scheduled from "assets/icons/NextScheduled/scheduled-transactions.svg";
import { formatCurrency, getFrequencyText } from "utils";
import { transferErrors } from "utils/MessageCatalog";

export const setInvestmentMessage = data => {
  let messageVisibility = false;
  let message = null;

  if (data.targetAccountProductGroup && data.sourceAccountProductGroup) {
    if (data.targetAccountProductGroup === "RSP") {
      message = transferErrors.MSG_RBTR_044;
      messageVisibility = true;
    }
    if (data.targetAccountProductGroup === "TFSA") {
      message = transferErrors.MSG_RBTR_044B;
      messageVisibility = true;
    }
    if (data.sourceAccountProductGroup === "TFSA") {
      message = transferErrors.MSG_RBTR_045;
      messageVisibility = true;
    }
  }

  return {
    visible: messageVisibility,
    message
  };
};

export const transformScheduledTransfer = data => {
  const isVisible = data.paymentType.includes("Recurring");

  const getEnding = () => {
    return data.paymentType === "Recurring No End Date"
      ? "Never"
      : dayjs(data.transferExecutionCycle.lastExecutionDate).format(
          "MMM DD, YYYY"
        );
  };

  return {
    From: {
      visible: true,
      imageIcon: accountIcon,
      title: "From",
      label: `${data.sourceAccountProductName} (${data.sourceAccountNumber})`
    },
    DownArrow: {
      visible: true,
      imageIcon: downArrowIcon
    },
    To: {
      visible: true,
      imageIcon: accountIcon,
      title: "To",
      label: `${data.targetAccountProductName} (${data.targetAccountNumber})`
    },
    Amount: {
      visible: true,
      imageIcon: moneyIcon,
      title: "Amount",
      label: formatCurrency(data.amount.value, data.amount.currency)
    },
    Frequency: {
      visible: isVisible,
      imageIcon: frequency,
      title: "Frequency",
      label: isVisible
        ? getFrequencyText(
            data.transferExecutionCycle.periodFrequency,
            data.transferExecutionCycle.periodUnit
          )
        : ""
    },
    When: {
      visible: !isVisible,
      imageIcon: calendar,
      title: "When",
      label: dayjs(data.paymentDate).format("MMM DD, YYYY")
    },
    NextScheduledDate: {
      visible: isVisible,
      imageIcon: scheduled,
      title: "Next scheduled",
      label: dayjs(data.paymentDate).format("MMM DD, YYYY")
    },
    Ending: {
      visible: isVisible,
      imageIcon: endDate,
      title: "Ending",
      label: isVisible ? getEnding() : ""
    },
    NumOfTransfers: {
      visible: data.paymentType === "Recurring With End Date",
      imageIcon: recurring,
      title: "Number of transfers remaining",
      label: `${data.remainingPayments} transfers`
    },
    Message: setInvestmentMessage(data)
  };
};
