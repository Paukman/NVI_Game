import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Container } from './styled';
import { formatValue } from '../../utils/formatValue';

const RenderValue = memo((props) => {
  const {
    value,
    valueTypeId,
    valueFormat,
    valueDecimals,
    displaySize,
    noValueStr,
    colorOnNegative,
    colorOnPositive,
    colorOnZero,
    colorOnNoValue,
    ignoreFormatSign,
  } = props;

  // we should never worry about inputs...
  let numValue = value;
  if (value !== null && value !== undefined) {
    numValue = Number(value.toString());
  }

  return (
    <span>
      <Container
        value={numValue}
        colorOnNegative={colorOnNegative}
        colorOnPositive={colorOnPositive}
        colorOnZero={colorOnZero}
        colorOnNoValue={colorOnNoValue}
      >
        {formatValue({
          value,
          valueTypeId,
          valueFormat,
          valueDecimals,
          noValueStr,
          displaySize,
          ignoreFormatSign: ignoreFormatSign ?? false,
        })}
      </Container>
    </span>
  );
});

RenderValue.displayName = 'RenderValue';

RenderValue.propTypes = {
  value: PropTypes.oneOfType[(PropTypes.string, PropTypes.number)],
  valueTypeId: PropTypes.number,
  valueFormat: PropTypes.string,
  valueDecimals: PropTypes.number,
  displaySize: PropTypes.string,
  noValueStr: PropTypes.string,
  colorOnZero: PropTypes.string,
  colorOnNegative: PropTypes.string,
  colorOnPositive: PropTypes.string,
  colorOnNoValue: PropTypes.string,
  ignoreFormatSign: PropTypes.bool,
};

export default RenderValue;
