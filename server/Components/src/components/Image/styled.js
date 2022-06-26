import styled from 'styled-components';
import { calcCssSize } from '../../utils/propHelpers';

export const StyledImage = styled.img.attrs((props) => {
  const { width, height } = props;
  return {
    style: {
      ...(width && { width: calcCssSize(width) }),
      ...(height && { height: calcCssSize(height) }),
    },
  };
})`
  display: block;
  border: none;
`;
