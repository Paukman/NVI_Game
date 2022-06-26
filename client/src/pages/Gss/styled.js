import { TextCellRenderer } from '../ProfitAndLoss/TextCellRenderer';
import styled from 'styled-components';
import { colors } from 'mdo-react-components';

export const MHeaderCell = styled(TextCellRenderer)`
  display: flex;
  align-items: center;
`;

export const SetPriorityLink = styled.a`
  text-decoration: underline;

  ${({ isPermitted }) =>
    isPermitted
      ? `
  color: ${colors.blue};
  cursor: pointer;
  `
      : `color: ${colors.grey};
 `}
`;
