import styled from 'styled-components';

export const HeaderFooter = styled.div`
  font-weight: bold;
  padding: 0;
`;

export const NameColumn = styled.div`
  font-weight: ${(props) => (props.topLevelHeaders ? 700 : props.subLevelHeaders ? 500 : 300)};
  text-transform: ${(props) => (props.topLevelHeaders ? 'uppercase' : 'capitalize')};
  display: inline-block;
  margin-left: ${(props) =>
    props.isMappingSummary ? (props.subLevelHeaders ? (!props.hasChildren ? '25px' : '0') : '12px') : '0'};
`;

export const DataContainer = styled.div`
  width: 100%;
`;

export const StyledPeriod = styled.div`
  padding-top: 1px;
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
  padding-left: 35%;
  padding-top: 10%;
  & > * {
    margin-right: 25px !important;
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

export const StyledFrame = styled.div`
  width: 35%;
  margin-left: 35%;
  margin-top: 27px;
`;
export const StyledNote = styled.div`
  margin-bottom: -120px;
  height:300px
`;
export const StyledDate = styled.div`
  padding-right: ${(props) => (props.left ? `10px` : '0px')};
  padding-top: 10px;
  padding-bottom: 10px;
`;
