import styled from 'styled-components';

import theme from '../../theme/theme';
import { calcCssSize } from '../../utils/propHelpers';

const { palette } = theme || {};
const colors = palette.common || {};

export const StyledDiv = styled.div.attrs((props) => {
  const { width, height } = props;

  return {
    style: {
      width: calcCssSize(width || '100%'),
      height: calcCssSize(height || '100%'),
    },
  };
})`
  display: block;
  border: none;
  padding: 2px 4px 2px 4px;
`;

export const StyledElement = styled.div`
  background-color: ${({ bgColor }) => bgColor || colors.blue};
  border-radius: 5px;
  width: 100%;
  padding: 8px 0px 8px 16px;
  margin-top: 16px;
  box-sizing: border-box;
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

export const Circle = styled.div`
  background-color: ${({ bgColor }) => bgColor || colors.white};
  display: inline-block;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  text-align: center;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TextStyle = styled.div`
  font-size: ${({ fontSize }) => fontSize || '20px'};
  font-weight: ${({ fontWeight }) => fontWeight || '600'};
  color: ${({ color }) => color || ''};
`;

export const TextStyle2 = styled.div`
  font-size: ${({ fontSize }) => fontSize || '20px'};
  font-weight: ${({ fontWeight }) => fontWeight || '600'};
  color: ${({ color }) => color || ''};
  display: flex;
  justify-content: center;
`;
