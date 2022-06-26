import { formatValue } from '../../utils/formatValue';

export const getValueFontSize = (data, configuration, defaultFormat) => {
  // dirty trick to calulcate which font to use
  const maxNumberLength = data.reduce((prev, curr, index) => {
    const formattedValue = formatValue({
      value: curr.value,
      valueTypeId: configuration.valueTypeId?.[index] || defaultFormat.valueTypeId,
      valueFormat: configuration.valueFormat?.[index] || defaultFormat.valueFormat,
      valueDecimals: configuration.valueDecimals?.[index] || defaultFormat.valueDecimals,
      displaySize: configuration.displaySize?.[index] || defaultFormat.displaySize,
    });

    if (formattedValue.toString().length > prev) {
      prev = formattedValue.toString().length;
    }

    return prev;
  }, 0);

  const fontMapping = {
    1: 22,
    2: 22,
    3: 22,
    4: 22,
    5: 20,
    6: 16,
    7: 14,
    8: 12,
    9: 11,
    10: 10,
  };

  return fontMapping[maxNumberLength] || 10;
};

export const getFontSizeNumber = (fontSize) => {
  if (!fontSize) {
    return null;
  }
  const fontSizeNumber = Number(fontSize.toString().replace('px', ''));
  return fontSizeNumber;
};
