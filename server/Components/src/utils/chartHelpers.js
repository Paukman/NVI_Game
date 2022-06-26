export const valueTypeIds = {
  number: 1,
  currency: 2,
  percentage: 3,
};

export const displaySizes = {
  asIs: 'as-is',
  auto: 'auto',
  k: 'k',
  m: 'm',
};

export const displaySizesSufixes = {
  k: 'k',
  m: 'm',
};

export const axisValues = {
  x: 'x',
  y: 'y',
};

export const getNumberFormats = ({ config, amchartUse = false }) => {
  //default value if not provided...
  const {
    valueDecimals = 0,
    valueFormat,
    valueTypeId = 1,
    displaySize = 'as-is',
    applyCurrencyFormat = null,
    addNumberFormatting = null,
  } = config || {};

  let applyValueFormat = valueFormat;
  // quick check if format passed in is correct
  if (applyCurrencyFormat != null || applyCurrencyFormat != undefined) {
    const regex = new RegExp(/^[0,]*.[0]*$/);
    if (valueTypeId == 2 && regex.test(applyCurrencyFormat)) {
      applyValueFormat = applyCurrencyFormat;
    }
  }

  let numberFormat = '';
  let displaySizeSufix = '';
  let bigNumberPrefixes = null;

  switch (displaySize) {
    case displaySizes.auto: {
      displaySizeSufix = 'a';
      bigNumberPrefixes = [
        { number: 1e3, suffix: displaySizesSufixes.k },
        { number: 1e6, suffix: displaySizesSufixes.m },
      ];
      break;
    }
    case displaySizes.k: {
      bigNumberPrefixes = [{ number: 1e3, suffix: displaySizesSufixes.k }];
      displaySizeSufix = amchartUse ? 'a' : '';
      break;
    }
    case displaySizes.m: {
      bigNumberPrefixes = [{ number: 1e6, suffix: displaySizesSufixes.m }];
      displaySizeSufix = amchartUse ? 'a' : '';
      break;
    }
    case displaySizes.asIs:
    default: {
      break;
    }
  }

  let typeIdSufix = '';
  let typeIdPrefix = '';
  let bracketLeft = '';
  let bracketRight = '';
  let absoluteSufix = '';

  switch (valueTypeId) {
    case 2: {
      typeIdPrefix = '$';
      absoluteSufix = amchartUse ? 's' : '';
      bracketLeft = '(';
      bracketRight = ')';
      break;
    }
    case 3: {
      typeIdSufix = '%';
      // code a together with % is not suported in amchart,
      // and sinse persentage is always small, will not allow any sizes on percentage
      displaySizeSufix = '';
      break;
    }
    case 1:
    default: {
      break;
    }
  }

  const addNumberFormattingPositive = addNumberFormatting ? `[${addNumberFormatting}]` : '';
  const addNumberFormattingNegative = addNumberFormatting ? ` ${addNumberFormatting}` : '';

  if (applyValueFormat) {
    const formatWords = applyValueFormat?.split('.');
    let afterDecimalPoint = formatWords[1] ?? '';
    const beforeDecimalPoint = amchartUse ? formatWords[0]?.replace(/0/g, '#') : formatWords[0];

    // each data has its own format, but we using only one
    const positiveNumber = `${typeIdPrefix}${beforeDecimalPoint}.${afterDecimalPoint}${typeIdSufix}${displaySizeSufix}`;
    const negativeNumber = `${typeIdPrefix}${beforeDecimalPoint}.${afterDecimalPoint}${absoluteSufix}${displaySizeSufix}${typeIdSufix}`;

    numberFormat = amchartUse
      ? `${addNumberFormattingPositive}${positiveNumber}|[red${addNumberFormattingNegative}]${bracketLeft}${negativeNumber}${bracketRight}`
      : `${bracketLeft}${positiveNumber}${bracketRight}`;
  } else if (!applyValueFormat) {
    let generalFormat = '0';
    let decimalPlaces = valueDecimals > 0 ? `${'0'.repeat(valueDecimals)}` : '';

    if (amchartUse) {
      generalFormat = '#';
      decimalPlaces = valueDecimals > 0 ? `${'#'.repeat(valueDecimals)}` : '';
    }

    const positiveNumber = `${typeIdPrefix}${generalFormat}.${decimalPlaces}${displaySizeSufix}${typeIdSufix}`;
    const negativeNumber = `${typeIdPrefix}${generalFormat}.${decimalPlaces}${absoluteSufix}${displaySizeSufix}${typeIdSufix}`;

    numberFormat = amchartUse
      ? `${addNumberFormattingPositive}${positiveNumber}|[red${addNumberFormattingNegative}]${bracketLeft}${negativeNumber}${bracketRight}`
      : `${bracketLeft}${positiveNumber}${bracketRight}`;
  }

  return { numberFormat, bigNumberPrefixes };
};
