import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TableRow, TableCell } from '@material-ui/core';

import { colors } from '../../theme/colors';

const StyledRootTableCell = styled(
  ({ stickyColumns, stickyHeaders, backgroundColor, borderRight, textColor, index, ...rest }) => (
    <TableCell {...rest} />
  ),
)`
  position: ${({ stickyColumns, stickyHeaders }) => (stickyColumns >= 0 || stickyHeaders ? 'sticky' : 'static')};
  z-index: ${({ stickyColumns, stickyHeaders }) => {
    let zIndex = 0;
    if (stickyColumns >= 0 && stickyHeaders) {
      zIndex = 2;
    } else if ((stickyColumns >= 0 && !stickyHeaders) || (!stickyColumns && stickyHeaders)) {
      zIndex = 1;
    }
    return zIndex;
  }};
  left: ${({ stickyColumns }) => (stickyColumns >= 0 ? 0 : '')};
  // depends how many headers we have. Each one is 30px...
  top: ${({ stickyHeaders, index }) => (stickyHeaders ? `${index * 30}px` : '')};
  background-color: ${({ backgroundColor }) => backgroundColor || colors.white};
  border-right: ${({ borderRight }) => borderRight || ''};
  height: 30px !important;
  & span {
    color: ${({ textColor }) => textColor || colors.black};
    font-size: 12px;
    font-weight: bold;
  }

  &.MuiTableCell-root {
    padding: 0px 2px 0px 2px;
  }
`;

const StyledTableCell = styled(({ stickyHeaders, backgroundColor, borderRight, textColor, index, ...rest }) => (
  <TableCell {...rest} />
))`
  position: ${({ stickyHeaders }) => (stickyHeaders ? 'sticky' : 'static')};
  z-index: ${({ stickyHeaders }) => (stickyHeaders ? 1 : 0)};
  top: ${({ stickyHeaders, index }) => (stickyHeaders ? `${index * 30}px` : '')};
  background-color: ${({ backgroundColor }) => backgroundColor || colors.blue};
  border-right: ${({ borderRight }) => borderRight || `1px solid ${colors.white}`};
  height: 30px !important;

  & span {
    color: ${({ textColor }) => textColor || colors.white};
    font-size: 12px;
    font-weight: bold;
  }

  &.MuiTableCell-root {
    padding: 0px 2px 0px 2px;
  }
`;

export const Headers = (props) => {
  const { data, stickyColumns, stickyHeaders } = props;

  if (!Array.isArray(data) || !data.length) {
    return null;
  }
  return (
    <>
      {data.map((header, index) => {
        return (
          <TableRow key={index}>
            {header?.map((item, itemIndex) => {
              const { span, backgroundColor, borderRight, padding, align, content, textColor } = item;
              if (item['single'] !== undefined) {
                return (
                  <StyledRootTableCell
                    key={itemIndex}
                    index={index}
                    stickyColumns={stickyColumns}
                    stickyHeaders={stickyHeaders}
                    colSpan={span}
                    backgroundColor={backgroundColor}
                    borderRight={borderRight}
                    padding={padding}
                    align={align || 'center'}
                    textColor={textColor}
                  >
                    <span>{content}</span>
                  </StyledRootTableCell>
                );
              } else {
                return (
                  <StyledTableCell
                    key={itemIndex}
                    index={index}
                    stickyHeaders={stickyHeaders}
                    colSpan={span}
                    backgroundColor={backgroundColor}
                    borderRight={borderRight}
                    padding={padding}
                    align={align || 'center'}
                    textColor={textColor}
                  >
                    <span>{content}</span>
                  </StyledTableCell>
                );
              }
            })}
          </TableRow>
        );
      })}
    </>
  );
};

Headers.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        span: PropTypes.number,
        backgroundColor: PropTypes.string,
        borderRight: PropTypes.string,
        padding: PropTypes.string,
        align: PropTypes.string,
        content: PropTypes.string,
        textColor: PropTypes.string,
      }),
    ),
  ),
  stickyColumns: PropTypes.number,
  stickyHeaders: PropTypes.bool,
};

Headers.displayName = 'Headers';
