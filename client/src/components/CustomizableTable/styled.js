import React from 'react';
import styled from 'styled-components';
import { TableCell, Icon, colors } from 'mdo-react-components';

const customTableIconColor = '#979ca1'; // use it from colors once in mdo-react-components

export const RightIcons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const InnerContent = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2px 5px 2px 2px;
`;

export const StyledTableCell = styled(({ hasBorder, hasBackgroundColor, ...rest }) => <TableCell {...rest} />)`
  background-color: ${({ hasBackgroundColor }) => (hasBackgroundColor ? colors.lightGreen : 'none')};
  border-right: ${({ hasBorder }) => (hasBorder ? `1px solid ${colors.blue}` : '')};
`;

export const IconButton = styled.button`
  border: none;
  background-color: transparent;
  color: currentColor;
  cursor: pointer;
  align-items: center;
  flex-direction: row;
  padding: 0px 0px;
`;

export const StyledIcon = styled(({ name }) => <Icon size='20px' color={customTableIconColor} name={name} />)``;
