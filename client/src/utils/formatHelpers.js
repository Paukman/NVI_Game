import numeral from 'numeral';
import { padStart } from 'lodash';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(localizedFormat);
dayjs.extend(utc);

export const strReplace = (str, obj) => {
  if (!obj || typeof obj !== 'object' || !str) {
    return str;
  }

  let result = str;

  Object.keys(obj).forEach((key) => {
    result = result.replace(new RegExp(`:${key}`, 'g'), obj[key]);
  });

  return result;
};

export const numberFilter = (value) => {
  value = value.toString();
  // check if starting character is 0-9
  if (value.match(/^[0-9]/)) {
    // then replace whatever is not 0-9 or dot with ''
    const newValue = value.replace(/[^0-9.]/g, '');
    // replace any additional dots
    return newValue
      .replace(/(\.[0-9.]+)\.+/g, '$1')
      .replace(/(\.)\./g, '$1') // extra case for two dots together (..)
      .replace(/(\.\w{2})\w+/g, '$1'); // allow only 2 decimals
  }
  return '';
};

export const formatPrice = (number) => {
  if (number === '') {
    return '';
  }
  return numeral(number).format('0,0.00');
};

export const formatPercentage = (value) => {
  return numeral(value).format('0[.]00%');
};

export const formatPercentageWithThousandSeparator = (value) => {
  return numeral(value).format('0,0[.]00%');
};

export const formatCurrency = (value, decimals) => {
  if (value === '') {
    return '';
  }
  const numberValue = Number(value);
  const value2render = numeral(value).format(`($0,0.${padStart('', decimals, '0')})`);
  return value2render;
};

export const timestampToShortLocal = (args) => {
  const { timestamp, format = 'MM/DD/YYYY', utc = false } = args || {};

  if (!timestamp) {
    return '';
  }
  if (!dayjs(timestamp).isValid()) {
    return timestamp;
  }

  if (timestamp.length === 13 && !isNaN(timestamp)) {
    if (utc) {
      return dayjs.utc(Number(timestamp)).format(format);
    }
    return dayjs(Number(timestamp)).format(format);
  } else {
    if (utc) {
      return dayjs.utc(timestamp).format(format);
    }
    return dayjs(timestamp).format(format);
  }
};

export const timestampNoSeparators = (timestamp) => {
  return dayjs(Number(timestamp)).utc().format('YYYYMMDD');
};

export const timestampToMonthDay = (timestamp) => {
  return dayjs(Number(timestamp)).utc().format('DD MMM YYYY');
};

export const valueConvertor = (value, type) => {
  let result;
  switch (type) {
    case 1:
      result = parseInt(value);
      break;
    case 2:
      result = formatCurrency(value, 2);
      break;
    case 3:
      result = formatPercentage(value);
      break;
    case 4:
      result = value === 'true';
      break;
    case 5:
      result = value.toString();
      break;
    default:
      result = value;
  }
  return result;
};

export const toNumber = (value) => {
  return isNaN(value) || value == null ? 0 : Number(value);
};

export const isValidDate = (date) => {
  return dayjs(date, 'MM/DD/YYYY').isValid();
};

const currentYear = new Date().getFullYear();
const yearStartDate = new Date(currentYear, 0, 1);
const yearEndDate = new Date(currentYear, 11, 31);

export const isCurrentYear = (date) => {
  if ((dayjs(date).isBefore(yearStartDate) || dayjs(date).isAfter(yearEndDate)) && !dayjs(date).isSame(currentYear)) {
    return false;
  } else {
    return true;
  }
};

export const calcPxSize = (value) => {
  if (!value) {
    return null;
  }
  const regex = new RegExp(/^[0-9]*px*$/);
  if (regex.test(value)) {
    // string with px at the end
    return value;
  }
  return isNaN(Number(value)) ? null : `${value}px`;
};
