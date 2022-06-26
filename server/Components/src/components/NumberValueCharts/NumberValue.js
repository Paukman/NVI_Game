import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { StyledDiv, TextStyle2 } from './styled';
import { Grid, GridItem } from '../Grid';
import { getFontSizeNumber } from './utils';

import { colors as themeColors } from '../../theme/colors';
import { formatValue } from '../../utils/formatValue';
import { valueTypeIds, displaySizes } from '../../utils/chartHelpers';

const NumberValue = memo((props) => {
  const { id, data, config = {} } = props;
  const { width = '100%', height = '100%' } = config;

  if (!data || (Array.isArray(data) && !data.length)) {
    console.error('Error receiving data: ', data);
    return null;
  }

  // if colors not provided, or partialy provided use these
  const defaultColors = [themeColors.widgetsRed, themeColors.widgetsLightGreen, themeColors.mediumGray];
  const defaultValueTypeId = valueTypeIds.number;
  const defaultValueFormat = '0.00';
  const defaultValueDecimals = 2;
  const defaultDisplaySize = displaySizes.asIs;

  const configuration = {
    fontSizeFirstElement: config?.fontSizeFirstElement
      ? `${getFontSizeNumber(config?.fontSizeFirstElement)}px`
      : '54px',
    fontSizeLabels: config?.fontSizeLabels ? `${getFontSizeNumber(config?.fontSizeLabels)}px` : '14px',
    fontSizeOtherElements: config?.fontSizeOtherElements
      ? `${getFontSizeNumber(config?.fontSizeOtherElements)}px`
      : '30px',
    fontWeightValues: config?.fontWeightValues || '600',
    fontWeightLabels: config?.fontWeightLabels || '600',
    colors: Array.isArray(config?.colors) && config?.colors?.length ? config.colors : defaultColors,
    valueTypeId: config.valueTypeId,
    valueFormat: config.valueFormat,
    valueDecimals: config.valueDecimals,
    displaySize: config.displaySize,
  };

  // create index pairs to iterate easy
  const dataPairs = [];
  for (let i = 1; i < data.length; i += 2) {
    dataPairs.push([i, i + 1]); // will be used for value formatting as well
  }

  return (
    <StyledDiv id={id || 'number-value'} width={width} height={height}>
      <TextStyle2
        fontSize={configuration.fontSizeFirstElement}
        color={configuration?.colors?.[0]}
        fontWeight={configuration.fontWeightValues}
      >
        {formatValue({
          value: data[0].value,
          valueTypeId: configuration.valueTypeId?.[0] || defaultValueTypeId,
          valueFormat: configuration.valueFormat?.[0] || defaultValueFormat,
          valueDecimals: configuration.valueDecimals?.[0] || defaultValueDecimals,
          displaySize: configuration.displaySize?.[0] || defaultDisplaySize,
        })}
      </TextStyle2>
      <TextStyle2
        fontSize={configuration.fontSizeLabels}
        color={themeColors.darkGray}
        fontWeight={configuration.fontWeightLabels}
      >
        {data[0].label}
      </TextStyle2>
      {dataPairs.map((obj, index) => {
        return (
          <div key={index}>
            <div style={{ marginBottom: '20px' }} />
            <Grid container spacing={1} justify='center' alignItems='stretch' direction='row'>
              <GridItem xs={6} style={{ borderRight: '1px solid #697177' }}>
                <TextStyle2
                  fontSize={configuration.fontSizeOtherElements}
                  color={configuration?.colors?.[obj[0]] || defaultColors[index % 3]}
                  fontWeight={configuration.fontWeightValues}
                >
                  {formatValue({
                    value: data[obj[0]].value,
                    valueTypeId: configuration.valueTypeId?.[obj[0]] || defaultValueTypeId,
                    valueFormat: configuration.valueFormat?.[obj[0]] || defaultValueFormat,
                    valueDecimals: configuration.valueDecimals?.[obj[0]] || defaultValueDecimals,
                    displaySize: configuration.displaySize?.[obj[0]] || defaultDisplaySize,
                  })}
                </TextStyle2>
                <TextStyle2
                  fontSize={configuration.fontSizeLabels}
                  color={themeColors.darkGray}
                  fontWeight={configuration.fontWeightLabels}
                >
                  {data[obj[0]].label}
                </TextStyle2>
              </GridItem>
              <GridItem xs={6}>
                <TextStyle2
                  fontSize={configuration.fontSizeOtherElements}
                  color={configuration?.colors?.[obj[1]] || defaultColors[(index - 1) % 3]}
                  fontWeight={configuration.fontWeightValues}
                >
                  {formatValue({
                    value: data[obj[1]].value,
                    valueTypeId: configuration.valueTypeId?.[obj[1]] || defaultValueTypeId,
                    valueFormat: configuration.valueFormat?.[obj[1]] || defaultValueFormat,
                    valueDecimals: configuration.valueDecimals?.[obj[1]] || defaultValueDecimals,
                    displaySize: configuration.displaySize?.[obj[1]] || defaultDisplaySize,
                  })}
                </TextStyle2>
                <TextStyle2
                  fontSize={configuration.fontSizeLabels}
                  color={themeColors.darkGray}
                  fontWeight={configuration.fontWeightLabels}
                >
                  {data[obj[1]]?.label}
                </TextStyle2>
              </GridItem>
            </Grid>
          </div>
        );
      })}
    </StyledDiv>
  );
});

NumberValue.displayName = 'NumberValue';
NumberValue.propTypes = {
  data: PropTypes.array,
  id: PropTypes.string,
  config: PropTypes.shape({
    colors: PropTypes.arrayOf(PropTypes.string),
    fontSizeFirstElement: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fontSizeLabels: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fontSizeOtherElements: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fontWeightValues: PropTypes.string,
    fontWeightLabels: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    valueTypeId: PropTypes.arrayOf(PropTypes.number),
    valueFormat: PropTypes.arrayOf(PropTypes.string),
    valueDecimals: PropTypes.arrayOf(PropTypes.number),
    displaySize: PropTypes.arrayOf(PropTypes.string),
  }),
};

NumberValue.defaultProps = {
  data: null,
};

export { NumberValue };
