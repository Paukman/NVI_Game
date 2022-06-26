import styled from 'styled-components';
import { calcCssSize, getSizeInPx } from '../../utils/propHelpers';

export const Container = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ noPadding }) => (noPadding === true ? '0' : '8px 8px')};
`;

export const ToolBarItem = styled.div`
  padding: 0 8px;
  margin-left: ${({ toTheRight }) => (toTheRight === true ? 'auto' : undefined)};
  width: ${({ width }) => (width ? calcCssSize(width) : 'auto')};
  margin-right: ${({ marginRight }) => (marginRight ? getSizeInPx(marginRight) : '')};
  margin-top: ${({ marginTop }) => (marginTop ? getSizeInPx(marginTop) : '')};
`;
