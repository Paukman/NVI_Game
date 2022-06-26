import styled from 'styled-components';

import { calcCssSize } from '../../../utils/propHelpers';

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
`;
