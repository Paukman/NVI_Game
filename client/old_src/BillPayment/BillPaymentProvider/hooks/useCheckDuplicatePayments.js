import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { useEffect, useState } from "react";
import api, { billPaymentsBaseUrl } from "api";
import { unFormatCurrency } from "utils";
import { ON_CHANGE } from "./useOneTimeReducer";
import {
  duplicatePaymentSettingsOneTime,
  duplicatePaymentSettingsFuture
} from "./constants";

dayjs.extend(isToday);

export const getDatesForCompletedPayments = daysBeforeToday => {
  let previousDays = daysBeforeToday;
  if (!daysBeforeToday || daysBeforeToday <= 0) {
    previousDays = 2;
  }
  const toDate = dayjs().format("YYYY-MM-DD");
  const fromDate = dayjs()
    .subtract(previousDays, "day")
    .format("YYYY-MM-DD");

  return { toDate, fromDate };
};

export const getDatesForFuturePayments = ({ period, number }) => {
  let futurePeriod = period;
  let numberInPeriod = number;
  if (
    !period ||
    (period !== "day" &&
      period !== "month" &&
      period !== "year" &&
      period !== "week") ||
    !number ||
    number <= 0
  ) {
    futurePeriod = "year";
    numberInPeriod = 1;
  }
  const fromDate = dayjs().format("YYYY-MM-DD");
  const toDate = dayjs()
    .add(numberInPeriod, futurePeriod)
    .format("YYYY-MM-DD");

  return { fromDate, toDate };
};

export const getPeriodDates = when => {
  if (dayjs(when).isToday()) {
    return getDatesForCompletedPayments(
      duplicatePaymentSettingsOneTime.daysBefore
    );
  }
  return getDatesForFuturePayments({
    period: duplicatePaymentSettingsFuture.timeAhead.period,
    number: duplicatePaymentSettingsFuture.timeAhead.number
  });
};

export const compareReviewDataForDuplicatePayments = (
  state,
  recentPayments
) => {
  // api will return "" if no recent payments
  if (!recentPayments) {
    return [];
  }

  const billPayee = state.billPayees.find(
    payee => payee.billPayeeId === state.to
  );

  const isEqualAmount = payment =>
    payment.amount.value === Number(unFormatCurrency(state.amount));
  const isEqualPayee = payment =>
    payment.payeeName === billPayee.payeeName &&
    payment.payeeNickname === billPayee.payeeNickname;
  const isOneTime = payment =>
    payment.paymentType === "Immediate" ||
    payment.paymentType === "One Time Future Dated";

  const matchingPayments = recentPayments
    .filter(isEqualAmount)
    .filter(isEqualPayee)
    .filter(isOneTime);

  return matchingPayments;
};

export const getDuplicatePayments = async (
  oneTimeBillState,
  updateStateOneTime
) => {
  const { toDate, fromDate } = getPeriodDates(oneTimeBillState.when);
  const url = `${billPaymentsBaseUrl}/billpayments?status=completed,pending&fromDate=${fromDate}&toDate=${toDate}`;
  let matchingPayments = [];
  try {
    const results = await api.get(url);
    matchingPayments = compareReviewDataForDuplicatePayments(
      oneTimeBillState,
      results.data
    );
  } catch (error) {
    // we don't stop paying the bill if we fail on getting payments,
    // most likely it will fail on payment as well
  }

  updateStateOneTime({
    type: ON_CHANGE,
    data: { name: "fetchingPayments", value: false }
  });
  updateStateOneTime({
    type: ON_CHANGE,
    data: { name: "matchingPayments", value: matchingPayments }
  });

  return matchingPayments;
};

const useCheckDuplicatePayments = (state, updateStateOneTime) => {
  const [hasStartedFetching, setHasStartedFetching] = useState(false);

  const shouldFetchPayments = state.fetchingPayments && !hasStartedFetching;

  useEffect(() => {
    async function fetchPayments() {
      if (shouldFetchPayments) {
        setHasStartedFetching(true);
        await getDuplicatePayments(state, updateStateOneTime);
        setHasStartedFetching(false);
      }
    }
    fetchPayments();
  }, [shouldFetchPayments, state, updateStateOneTime]);
};

export default useCheckDuplicatePayments;
