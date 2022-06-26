import styled from 'styled-components';
import theme from '../../theme/theme';

const { palette } = theme || {};
const colors = palette.common || {};

const StyledDiv = styled.div`
  background-image: ${({ bgImage }) => (bgImage ? `url('${bgImage}')` : '')};
  background-color: ${({ bgColor }) => (colors[bgColor] ? `${colors[bgColor]}` : `${colors || colors.white}`)};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export { StyledDiv };
