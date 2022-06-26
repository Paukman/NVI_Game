import styled from 'styled-components';

export const FormContainer = styled.div`
  display: flex;
  width: ${({ width }) => (width ? `${width}px` : `380px`)};
  flex-direction: column;
  margin-left: ${({ formPlacement }) => (formPlacement === 'right' ? 'auto' : '')};
  margin-right: ${({ formPlacement }) => (formPlacement === 'left' ? 'auto' : '')};
  margin: ${({ formPlacement }) => (formPlacement === 'center' ? 'auto' : '')};
  max-width: 100%;
`;

export const TextStyle = styled.div`
  font-size: ${({ fontSize }) => fontSize || ''};
  font-weight: ${({ fontWeight }) => fontWeight || ''};
  text-align: ${({ textAlign }) => textAlign || ''};
  line-height: ${({ lineHeight }) => lineHeight || ''};
  color: ${({ color }) => color || ''};
`;
