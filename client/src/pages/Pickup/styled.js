import styled from 'styled-components';
import { colors } from 'mdo-react-components';

export const DeltaField = styled.span`
  color: ${({ negative, positive }) => (negative ? colors.red : positive ? colors.darkGreen : colors.black)};
`;
