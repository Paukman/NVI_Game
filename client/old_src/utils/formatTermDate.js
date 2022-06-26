import dayjs from "dayjs";
import { isString } from "lodash";

const parseTerm = term => {
  if (!isString(term)) {
    return [];
  }
  const [length, unit = ""] = term.split(" ");
  const formattedUnit = unit.toLowerCase().replace(/s$/, "");
  return [+length, formattedUnit];
};

const validTermUnits = ["year", "month", "week", "day"];

/**
 * Loan terms are formatted as strings. We need to handle each of these cases:
 *    1 Year, X Years, 1 Month, X Months, 1 Week, X Weeks, 1 Day, X Days
 */
const convertTermToDate = term => {
  const now = dayjs();
  const [length, unit] = parseTerm(term);

  if (!Number.isFinite(length) || !validTermUnits.includes(unit)) {
    return now.format("YYYY-MM-DD");
  }
  return now.add(length, unit).format("YYYY-MM-DD");
};

const calculateDateDifference = (end, start) => {
  const startDate = dayjs(start).startOf("day");
  let endDate = dayjs(end).startOf("day");

  const years = endDate.diff(startDate, "year");
  endDate = endDate.subtract(years, "year");

  const months = endDate.diff(startDate, "month");
  endDate = endDate.subtract(months, "month");

  const days = endDate.diff(startDate, "day");
  endDate = endDate.subtract(days, "day");

  return { years, months, days };
};

/**
 * Loan terms are sent as strings from API. This reformats terms into UX defined behaviours.
 * Ex: "24 Months" -> "2 years", "26 Months" -> "2yr 2mo", "1 Week" -> "7 days"
 */
const formatTermDate = term => {
  const parsedDate = convertTermToDate(term);
  const { years, months, days } = calculateDateDifference(parsedDate);

  if (years && months) {
    return `${years}yr ${months}mo`;
  }
  if (years) {
    return `${years} year${years === 1 ? "" : "s"}`;
  }
  if (months) {
    return `${months} month${months === 1 ? "" : "s"}`;
  }
  if (days) {
    return `${days} day${days === 1 ? "" : "s"}`;
  }
  return "None";
};

export { formatTermDate, convertTermToDate };
