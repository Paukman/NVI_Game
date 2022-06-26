import styled from 'styled-components';

export const DataContainer = styled.div`
  width: 100%;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-weight: bold;
`;

export const FormContainer = styled.div`
  width: 600px;
  max-width: 100%;
  margin: 0 auto;
`;

export const Form = styled.form`
  border: none;
  margin: 0 0 30px 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & > * {
    margin-bottom: 10px !important;
    box-sizing: border-box;
  }
`;
