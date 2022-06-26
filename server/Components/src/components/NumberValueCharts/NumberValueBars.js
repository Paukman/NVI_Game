import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { StyledDiv, StyledElement, Circle, TextStyle } from './styled';
import { getValueFontSize, getFontSizeNumber } from './utils';

import { colors as themeColors } from '../../theme/colors';
import { formatValue } from '../../utils/formatValue';
import { valueTypeIds, displaySizes } from '../../utils/chartHelpers';

const NumberValueBars = memo((props) => {
  const { id, data, config = {} } = props;
  const { width = '100%', height = '100%' } = config;

  if (!data || (Array.isArray(data) && !data.length)) {
    console.error('Error receiving data: ', data);
    return null;
  }

  // if colors not provided, or partialy provided use these
  const defaultColors = [themeColors.blue, themeColors.widgetsDarkGreen];
  const defaultFormat = {
    valueTypeId: valueTypeIds.number,
    valueFormat: '0',
    valueDecimals: 0,
    visplaySize: displaySizes.asIs,
  };

  const configuration = {
    bgColorValue: config?.bgColorValue || themeColors.white,
    fontWeightValue: config?.fontWeightValue || '600',
    colorLabel: config?.colorLabel || themeColors.white,
    fontSizeLabel: config?.fontSizeLabel ? `${getFontSizeNumber(config?.fontSizeLabel)}px` : '20px',
    fontWeightLabel: config?.fontWeightLabel || '600',
    colors: Array.isArray(config?.colors) && config?.colors?.length ? config.colors : defaultColors,
    valueTypeId: config.valueTypeId,
    valueFormat: config.valueFormat,
    valueDecimals: config.valueDecimals,
    displaySize: config.displaySize,
  };

  const fontSizeValue = getValueFontSize(data, configuration, defaultFormat);

  return (
    <StyledDiv id={id || 'number-value'} width={width} height={height}>
      {data.map((obj, index) => {
        return (
          <div key={index}>
            <StyledElement
              id={id ? `${id}-${obj.label}` : `${obj.label}`}
              bgColor={configuration?.colors?.[index] || defaultColors[index % 2]}
            >
              <Circle bgColor={configuration?.bgColorValue || configuration.bgColorValue}>
                <TextStyle
                  fontSize={`${fontSizeValue}px`}
                  fontWeight={configuration?.fontWeightValue || configuration.fontWeightValue}
                >
                  {formatValue({
                    value: obj.value,
                    valueTypeId: configuration.valueTypeId?.[index] || defaultFormat.valueTypeId,
                    valueFormat: configuration.valueFormat?.[index] || defaultFormat.valueFormat,
                    valueDecimals: configuration.valueDecimals?.[index] || defaultFormat.valueDecimals,
                    displaySize: configuration.displaySize?.[index] || defaultFormat.displaySize,
                  })}
                </TextStyle>
              </Circle>
              <TextStyle
                color={configuration?.colorLabel || configuration.colorLabel}
                fontSize={configuration?.fontSizeLabel || configuration.fontSizeLabel}
                fontWeight={configuration?.fontWeightLabel || configuration.fontWeightLabel}
              >
                {obj.label}
              </TextStyle>
            </StyledElement>
          </div>
        );
      })}
    </StyledDiv>
  );
});

NumberValueBars.displayName = 'NumberValueBars';
NumberValueBars.propTypes = {
  data: PropTypes.array,
  id: PropTypes.string,
  config: PropTypes.shape({
    colors: PropTypes.arrayOf(PropTypes.string),
    bgColorValue: PropTypes.string,
    fontWeightValue: PropTypes.string,
    colorLabel: PropTypes.string,
    fontSizeLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fontWeightLabel: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    valueTypeId: PropTypes.arrayOf(PropTypes.number),
    valueFormat: PropTypes.arrayOf(PropTypes.string),
    valueDecimals: PropTypes.arrayOf(PropTypes.number),
    displaySize: PropTypes.arrayOf(PropTypes.string),
  }),
};

NumberValueBars.defaultProps = {
  data: null,
};

export { NumberValueBars };
