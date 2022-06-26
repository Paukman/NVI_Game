import styled from 'styled-components';

export const IconDiv = styled.div`
  display: ${({ showCloseIcon }) => (showCloseIcon ? 'inline' : 'none')};
`;

export const ButtonDiv = styled.div`
  display: ${({ showButtons }) => (showButtons ? 'inline' : 'none')};
  padding: 2em;
`;

export const TitleDev = styled.div`
  flex: 1 1;
  font-weight: 600;
  font-size: 20px;
`;

export const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  aligh-items: center;
`;

export const Container = styled.div`
  padding: 20px;
`;
