import styled from 'styled-components';

export const HiddenButton = styled.button`
  display: block;
  height: 1px;
  width: 1px;
  opacity: 0;
  position: fixed;
  left: --100px;
`;
