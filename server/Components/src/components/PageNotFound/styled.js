import styled from 'styled-components';
import theme from '../../theme/theme';

const { palette } = theme || {};
const colors = palette.common || {};

const StyledDiv = styled.div`
  div {
    flex-direction: column;
    text-align: center;
    div {
      margin: 15px;
      h1 {
        color: ${colors.mediumGray};
        font-size: 39px;
        font-weight: normal;
        margin-bottom: 10px;
      }
      p {
        font-size: 19px;
        margin: 0;
      }
      img {
        width: 100%;
        max-width: 850px;
      }
    }
  }
`;

export { StyledDiv };
