import styled from 'styled-components';

export const Wrapper = styled.div`
  display: table;
  width: 100%;
`;

export const LeftWrapper = styled.div`
  width: 50%;
  float: left;
  .MuiCheckbox-root {
    padding-left: 0px;
  }
`;

export const RightWrapper = styled.div`
  width: 50%;
  float: left;
  ul {
    margin-top: 103px;
    max-height: 300px;
    overflow: auto;
  }
  li {
    list-style: none;
    padding: 3px 0px;
  }
`;

export const CheckboxWrapper = styled.div`
  padding-top: 20px;
  ul {
    padding-left: 0px;
    max-height: 300px;
    overflow: auto;
  }
  li {
    list-style: none;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  button {
    margin: 10px;
    width: 150px !important;
  }
`;
