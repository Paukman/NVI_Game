import styled from 'styled-components';

export const StyledTdFirstColumn = styled.td`
  background-color: rgb(255, 255, 255);
  padding: 0px 10px;
  text-align: left;
  font-size: 12px;
  border-right: none;
  line-height: 0;
  width: 150px;
  z-index: 0;
  left: 0px;
  white-space: nowrap;
`;

export const StyledCloseIcon = styled.div`
  margin-left:auto;
`;

export const StyledHeaderWrap = styled.div`
  flex-direction: row;
  display: flex;
`;

export const StyledButton = styled.div`
  border:no-border;
  margin-top:5px;
  cursor:pointer;
`;

export const StyledTd = styled.td`
  background-color: rgb(255, 255, 255);
  padding: 0px 10px;
  text-align: left;
  font-size: 12px;
  border-right: none;
  line-height: 0;
  width: 400px;
  z-index: 0;
  left: 0px;
  white-space: nowrap;
`;

export const StyledBox = styled.div`
  display: table;
  table-layout: fixed;
  border-spacing: 10px;
  width:fit-content;
`;

export const StyledSquare = styled.div`
  height: 20px;
  width: 20px;
  margin-bottom: 15px;
  border: 1px solid lightgrey;
  background-color: ${(props) => props.color};
  display: table-cell;
`;

export const StyledInputDate = styled.div`
  padding-top: 0px;
`;

export const Container = styled.div`
  display: flex;
  flex-flow: row;
  width: 98%;
  height: 300px;
  margin-left:20px;
  margin-bottom: 40px;
  > *:first-child {
    margin-right: 30px;
  }
`;

export const StyledMessages = styled.span`
  top: 117px;
  left: 231px;
  width: 69px;
  height: 19px;
  font: normal normal bold 14px Open Sans;
  letter-spacing: 0px;
  color: #3b6cb4;
  text-align: left;
  color: #3b6cb4;
  opacity: 1;
`;

export const StyledProperty = styled.span`
  top: 55px;
  left: 205px;
  width: 260px;
  height: auto;
  font: normal normal lighter 16px Open Sans;
  letter-spacing: 0px;
  color: #000000;
  text-align: left;
  opacity: 1;
`;

export const StyledHeader = styled.span`
  top: 18px;
  left: 205px;
  width: 105px;
  height: 40px;
  letter-spacing: 0px;
  font-size: 20px;
  color: #000000;
  text-align: left;
  letter-spacing: 0px;
  opacity: 1;
`;

export const StyledCommentDate = styled.div`
  top: 187px;
  left: 205px;
  width: 275px;
  font: normal normal normal 12px Open Sans;
  letter-spacing: 0px;
  text-align: left;
  letter-spacing: 0px;
  color: #0000008a;
  opacity: 1;
  margin-bottom: 5px;
`;

export const StyledCommentMessage = styled.a`
  top: 187px;
  left: 205px;
  width: 275px;
  font: normal normal lighter 14px Open Sans;
  letter-spacing: 0px;
  text-align: left;
  opacity: 1;
  word-wrap: break-word;
  border: none;
  background-color: white;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* number of lines to show */
  -webkit-box-orient: vertical;
`;

export const StyledCommentAllMessage = styled.p`
  top: 187px;
  left: 205px;
  width: 275px;
  font: normal normal normal 14px Open Sans;
  letter-spacing: 0px;
  text-align: left;
  opacity: 1;
  word-wrap: break-word;
  border: none;
  background-color: white;
  margin-bottom: 15px;
`;

export const StyledItem = styled.span`
  width: 72px;
  height: 17px;
  margin-right: 7px;
  font: normal normal lighter 12px Open Sans;
  letter-spacing: 0px;
  color: ${(props) => props.color};
  text-align: right;
  opacity: 1;
  display: ${(props) => (props.column ? 'table-cell' : 'inline')};
`;

export const StyledToolBarItem = styled.div`
  width: 150px;
`;

export const StyledToolBarItemMessage = styled.div`
  margin-bottom: 15px;
  margin-top: 15px;
  display:flex;
  flex-direction:row;
  margin-left:-10px;
`;

export const StyledCancel = styled.div`
  padding-top: 17px;
  > *:first-child {
    margin-right: 20px;
  }
`;

export const StyledError = styled.div`
  color: red;
  margin-left: 30%;
  margin-top: 10%;
`;

export const StyledLink = styled.div`
  margin-left: -12px;;
`;