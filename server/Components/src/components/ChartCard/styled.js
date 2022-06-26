import styled from 'styled-components';
import theme from '../../theme/theme';
import { calcCssSize, boxShadow, getSizeInPx } from '../../utils/propHelpers';

const { palette } = theme || {};
const colors = palette.common || {};

export const CardTitleDiv = styled.div`
  display: block;
  text-align: left;
  margin-bottom: ${({ titleMargin }) => getSizeInPx(titleMargin) || '20px'};
  color: ${({ titleColor }) => titleColor || colors.darkBlue};
  & .MuiTypography-h5 {
    font-size: ${({ titleFontSize }) =>
      titleFontSize ? `${getSizeInPx(titleFontSize)} !important` : '16px !important'};
    font-weight: ${({ titleFontWeight }) => (titleFontWeight ? `${titleFontWeight} !important` : 'bold !important')};
  }
`;

export const ChartDiv = styled.div`
  display: block;
  border: none;
  background-color: ${({ backgroundColor }) => backgroundColor || colors.white};
  border: 1px solid ${({ chartBorderColor }) => chartBorderColor || colors.grey};
  border-radius: 20px;
  padding: ${({ chartPadding }) => chartPadding || '24px 0px 40px 24px'};
  box-sizing: border-box;
  white-space: nowrap;
  box-shadow: ${({ elevation }) => boxShadow(elevation || 0)};
  width: ${({ width }) => calcCssSize(width || '100%')};
  height: ${({ height }) => calcCssSize(height || '100%')};
`;
