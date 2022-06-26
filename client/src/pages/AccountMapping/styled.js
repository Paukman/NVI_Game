import styled from 'styled-components';

export const DataContainer = styled.div`
  width: 100%;
`;

export const MdoWrapper = styled.div`
  width: 100%;
  height: ${({ withError }) => (withError ? '30px' : '20px')};
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;

  & > * {
    margin-right: 10px !important;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  & div {
    width: 80%;
  }
  & div:last-child {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    p {
      margin: 0;
    }
  }
`;

export const FormContainer = styled.div`
  width: 600px;
  max-width: 100%;
  margin: 0 auto;
`;

export const DeleteRow = styled.div`
  display: flex;
  & div {
    margin-left: 15px;
  }
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

export const SearchDropdown = styled.div`
  width: 500px;
  margin-bottom: 25px;
`;

export const SearchDropdownButton = styled.div`
  padding-left: 35%;
`;
