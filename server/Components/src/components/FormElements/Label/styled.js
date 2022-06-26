import styled from 'styled-components';
import { colors } from '../../../theme/colors';
import { getSizeInPx } from '../../../utils/propHelpers';

const StyledLabel = styled.label`
  display: inline-flex;
  flex-direction: ${({ toTheRight }) => (toTheRight === true ? 'row-reverse' : 'row')};
  align-items: center;
  font-size: ${({ fontSize }) => getSizeInPx(fontSize) || '14px'};
  padding: 0;
  span {
    line-height: ${({ lineHeight }) => lineHeight || 1.5};
  }
  color: ${({ color }) => color || colors.black};
  font-weight: ${({ fontWeight }) => fontWeight || 'normal'};
`;

export { StyledLabel };
