import styled from 'styled-components';
import theme from '../../theme/theme';

const { palette } = theme || {};
const colors = palette.common || {};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const Message = styled.div`
  padding: 32px 0;
  color: ${colors.mediumGray};
`;

export { Container, Message };
