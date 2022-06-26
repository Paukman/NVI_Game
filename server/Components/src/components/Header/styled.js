import styled from 'styled-components';
import theme from '../../theme/theme';
const { palette } = theme || {};
const colors = palette.common || {};

export const Container = styled.header`
  flex-direction: row;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${({ bgColor }) => bgColor || colors.white};
  color: ${({ color }) => color || colors.black};
`;

export const HeaderItem = styled.div`
  padding: 0 5px;
  margin-left: ${({ toTheRight }) => (toTheRight === true ? 'auto' : undefined)};
`;
