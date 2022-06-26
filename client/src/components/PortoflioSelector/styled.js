import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;

  & > * {
    margin-right: 16px;
  }

  & > *:last-of-type {
    margin-right: 0;
  }
`;

export const PortfolioItem = styled.div`
  width: 300px;
`;

export const HotelItem = styled.div`
  width: 200px;
`;
