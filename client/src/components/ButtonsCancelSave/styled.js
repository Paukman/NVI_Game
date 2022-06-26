import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ centered }) => (centered ? 'center' : 'flex-start')};

  & > div {
    width: ${({ centered }) => (centered ? 'auto' : '100%')};
  }
`;

export { Container };
