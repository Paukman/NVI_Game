import styled from 'styled-components';
import theme from '../../theme/theme';

const { palette } = theme || {};
const colors = palette.common || {};

export const StyledDiv = styled.div`
  background-color: ${colors.white};
  border: 1px solid ${colors.grey};
  border-radius: 20px;
  box-shadow: 0px 0px 5px ${colors.grey};
  width: 100%;
  flex: 1 1;
  padding: ${({ noPadding }) => (noPadding ? '0' : '16px')};
  padding-top: ${({ noTopPadding }) => (noTopPadding ? '0' : '16px')};
  box-sizing: border-box;
  white-space: nowrap;
  overflow-y: ${({ scrollableY }) => (scrollableY ? 'auto' : 'hidden')};
  overflow-x: ${({ scrollableX }) => (scrollableX ? 'auto' : 'hidden')};
`;

export const StyledCardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 0;
`;
