import styled from 'styled-components';

export const Container = styled.div`
  color: green;
  margin: ${(withMargin) => (withMargin ? '30px 0' : '0')};
`;
