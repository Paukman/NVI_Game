import styled from 'styled-components';

export const SectionHeader = styled.div`
  font-weight: bold;
`;

export const FiltersContainer = styled.div`
  width: 100%;
  min-width: 320px;
  max-width: 100%;
  flex: 1 1;
  background-color: #fff;
  color: #000;
  padding: 20px;
  box-sizing: border-box;

  & > * {
    box-sizing: border-box;
  }
`;

export const FilterTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 30px 0;
`;

export const FormContainer = styled.div`
  width: 500px;
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
    margin-bottom: 30px !important;
    box-sizing: border-box;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 5%;
  width: 100%;
  & > * {
    margin-right: 20px !important;
  }
`;

export const MdoWrapper = styled.div`
  width: 100%;
  height: ${({ withError }) => (withError ? '30px' : '20px')};
`;

export const RightBorder = styled.div`
  height: 100%;
  border-right: 1px solid #cad3da;
`;

export const CsvUploadContainer = styled.div`
  height: 100%;
  width: 1000px;
  margin: 20px auto;
`;

export const UploadWrapper = styled.div`
  button {
    color: #3b6cb4 !important;
    float: right;
    padding-right: 0px !important;
  }
`;

export const CoaSelectWrapper = styled.div`
  width: 500px;
  margin: 20px 0px;
`;
