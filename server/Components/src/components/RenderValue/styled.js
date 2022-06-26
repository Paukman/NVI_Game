import styled from 'styled-components';
import theme from '../../theme/theme';
const { palette } = theme || {};
const colors = palette.common || {};

export const Container = styled.span`
  color: ${({ value, colorOnNegative, colorOnPositive, colorOnZero, colorOnNoValue }) =>
    value === null || value === undefined
      ? colorOnNoValue
        ? colorOnNoValue
        : 'currentColor'
      : value < 0
      ? colorOnNegative
        ? colorOnNegative
        : colors.red
      : value > 0
      ? colorOnPositive
        ? colorOnPositive
        : 'currentColor'
      : value === 0
      ? colorOnZero
        ? colorOnZero
        : 'currentColor'
      : 'currentColor'};
`;
