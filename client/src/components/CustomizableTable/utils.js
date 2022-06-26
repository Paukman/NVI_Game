import React from 'react';
import { colors } from 'mdo-react-components';

import { RightIcons, InnerContent, IconButton, StyledIcon } from './styled';

export const CreateHeaders = (props) => {
  const { onDragColumn, onEditColumn, onDeleteColumn, noOfColumnsToSkip = 1, dragEnabled = false, ...rest } = props;
  const subHeaders = rest?.subHeaders;
  const hasStripes = rest?.hasStripes;

  let headers = [{ span: noOfColumnsToSkip, single: true }];
  subHeaders?.map((subHeader, index) => {
    let backgroundColor = subHeader.bgColor ? colors.lightGreen : colors.white;
    if (hasStripes) {
      backgroundColor = index % 2 === 1 ? colors.lightGreen : colors.white;
    }
    // skip first subHeader column
    if (index >= noOfColumnsToSkip) {
      headers.push({
        borderRight: backgroundColor,
        backgroundColor: backgroundColor,
        content: (
          <InnerContent>
            <IconButton
              data-el={`button-drag-${subHeader.headerName}`}
              onClick={
                onDragColumn
                  ? () => onDragColumn({ id: subHeader.id, index, name: subHeader.headerName, subHeader })
                  : () => {}
              }
            >
              {dragEnabled && <StyledIcon name='DragHandle' />}
            </IconButton>

            <RightIcons>
              <IconButton
                data-el={`button-edit-${subHeader.headerName}`}
                onClick={
                  onEditColumn
                    ? () => onEditColumn({ id: subHeader.id, index, name: subHeader.headerName, subHeader })
                    : () => {}
                }
              >
                <StyledIcon name='Settings' />
              </IconButton>
              <IconButton
                data-el={`button-delete-${subHeader.headerName}`}
                onClick={
                  onDeleteColumn
                    ? () => onDeleteColumn({ id: subHeader.id, index, name: subHeader.headerName, subHeader })
                    : () => {}
                }
              >
                <StyledIcon name='Delete' />
              </IconButton>
            </RightIcons>
          </InnerContent>
        ),
        span: 1,
      });
    }
  });

  return headers;
};
