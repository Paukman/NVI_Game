// TO-DO This is scheduled payment related file. Should be moved under ScheduledPayment
import dayjs from "dayjs";

import { formatCurrency, getFrequencyText } from "utils";

import accountIcon from "assets/icons/FromAccount/account.svg";
import downArrowIcon from "assets/icons/DownArrow/arrow_down.svg";
import payBill from "assets/icons/PayBill/pay-bill.svg";
import money from "assets/icons/Money/money.svg";
import calendar from "assets/icons/Calendar/calendar.svg";
import calendarEnd from "assets/icons/Calendar/calendar-end.svg";
import frequencyIcon from "assets/icons/Frequency/frequency.svg";
import calendarTransfer from "assets/icons/Calendar/calendar-transfer-recur.svg";

const transformScheduledPayment = data => {
  // string interpolations
  const from = `${data.sourceAccountNickname ||
    data.sourceAccountProductName} (${data.sourceAccountNumber})`;

  const to = `${data.payeeNickname || data.payeeName} (${
    data.payeeCustomerReference
  })`;

  const amount = formatCurrency(data.amount.value, data.amount.currency);

  const paymentDate = dayjs(data.paymentDate).format("MMM DD, YYYY");

  // recurring
  const when =
    data.paymentType !== "One Time Future Dated" ? "Next scheduled" : "When";

  const ending =
    data.paymentExecutionCycle && data.paymentExecutionCycle.lastExecutionDate
      ? dayjs(data.paymentExecutionCycle.lastExecutionDate).format(
          "MMM DD, YYYY"
        )
      : "Never";

  const frequency =
    data.paymentExecutionCycle &&
    getFrequencyText(
      data.paymentExecutionCycle.periodFrequency,
      data.paymentExecutionCycle.periodUnit
    );

  const paymentsRemaining = `${data.remainingPayments} payments`;

  return {
    From: {
      visible: true,
      imageIcon: accountIcon,
      title: "From",
      label: from
    },
    DownArrow: {
      visible: true,
      imageIcon: downArrowIcon
    },
    To: {
      visible: true,
      imageIcon: payBill,
      title: "To",
      label: to
    },
    Amount: {
      visible: true,
      imageIcon: money,
      title: "Amount",
      label: amount
    },
    Frequency: {
      visible: data.paymentType !== "One Time Future Dated",
      imageIcon: frequencyIcon,
      title: "Frequency",
      label: frequency
    },
    PaymentDate: {
      visible: true,
      imageIcon: calendar,
      title: when,
      label: paymentDate
    },
    Ending: {
      visible: data.paymentType !== "One Time Future Dated",
      imageIcon: calendarEnd,
      title: "Ending",
      label: ending
    },
    NumOfPayments: {
      visible: data.paymentType === "Recurring With End Date",
      imageIcon: calendarTransfer,
      title: "Number of payments remaining",
      label: paymentsRemaining
    },
    Note: {
      visible: !!data.note,
      imageIcon: money,
      title: "Note to self",
      label: data.note && data.note
    }
  };
};

export default transformScheduledPayment;
