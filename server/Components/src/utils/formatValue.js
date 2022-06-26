import numeral from 'numeral';
import { getNumberFormats, displaySizes, displaySizesSufixes, valueTypeIds } from './chartHelpers';

const convertValue = (value, displaySize) => {
  if (displaySize) {
    let returnValue = value;
    switch (displaySize) {
      case 'k':
        returnValue = value / 1000;
        break;
      case 'm':
        returnValue = value / 1000000;
        break;
      default:
        break;
    }
    return returnValue;
  }
};

const adjustTrailingZerosFormat = (number, format) => {
  const behindDecimalString = number?.split('.')?.[1];

  // TODO account for auto, percentage and negative numbers
  let noOfTrailingZeros = 0;
  let i = behindDecimalString.length;
  while (i-- && i >= 0) {
    if (behindDecimalString.charAt(i) === '0') {
      noOfTrailingZeros++;
    } else {
      break;
    }
  }

  if (noOfTrailingZeros > 0) {
    const formatLength = format?.length;
    format = format.substring(0, formatLength - noOfTrailingZeros - 1);
  }
  return format;
};

export const formatValue = ({
  value,
  valueTypeId, // 1 number, 2 currency, 3 percentage
  valueFormat, // '#,###.00'
  valueDecimals, //2, 3, 4
  noValueStr, // 'N/A'
  displaySize, // as-is, auto, k, m
  ignoreNotNumbers = false,
  ignoreFormatSign = false,
  removeTrailingDecimalZeros = false, // future feature
}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return noValueStr ?? '';
  }

  if (ignoreNotNumbers && typeof value !== 'number') {
    return value;
  } else {
    const { numberFormat } = getNumberFormats({
      config: {
        valueDecimals,
        valueFormat,
        valueTypeId,
        displaySize,
      },
    });

    const noDisplaySizeSuffix =
      (displaySize !== displaySizes.k && displaySize !== displaySizes.m) || valueTypeId === valueTypeIds.percentage;

    const numValue = Number(value.toString());
    const verySmallNumbersAdjustedValue = Math.abs(numValue) < 1e-6 ? 0 : numValue;

    if (noDisplaySizeSuffix) {
      let number = numeral(verySmallNumbersAdjustedValue).format(numberFormat);
      if (ignoreFormatSign) {
        number = number.replace(/[^\d.,kKmMbB()-]/g, ''); // leave only numbers, dot, comma and - sign
      }
      return number;
    } else {
      const sizedNumber = convertValue(verySmallNumbersAdjustedValue, displaySize);
      let number = `${numeral(sizedNumber).format(numberFormat)}${displaySizesSufixes[displaySize]}`;
      if (ignoreFormatSign) {
        number = number.replace(/[^\d.,kKmMbB()-]/g, '');
      }
      return number;
    }
  }
};
