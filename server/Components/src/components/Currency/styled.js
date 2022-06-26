import styled from 'styled-components';
import theme from '../../theme/theme';

const { palette } = theme || {};
const colors = palette.common || {};

export const Container = styled.span`
  color: ${({ negative }) => (negative ? colors.red : 'currentColor')};
`;
