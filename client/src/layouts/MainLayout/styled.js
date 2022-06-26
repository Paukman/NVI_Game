import styled from 'styled-components';
import { localColors } from '../../config/colors';
import { colors } from 'mdo-react-components';

/* TODO: Figure it out why we have theme = {} here
  background-color: ${({ theme }) => theme.palette.common.grey}; */
export const StyledMainLayout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #fafafa;
`;

export const StyledContent = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 1;
  box-shadow: inset 0 1px 10px rgba(0, 0, 0, 0.14);
`;

export const PageHeader = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
  left: -15px;
`;

export const PageTitle = styled.h1`
  font-size: 20px;
  margin: 0;
  padding-left: 10px;
  font-weight: 600;
  flex: 1 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1;
  width: 100%;
  height: 100%;
  margin: 0;
  box-sizing: border-box;
  overflow: hidden;
`;

export const LinkToMyp1Container = styled.div``;

export const LinkToMyp1 = styled.a`
  font-size: 12px;
  color: ${colors.blue};
`;
