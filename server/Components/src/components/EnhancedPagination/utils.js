import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import LastPageIcon from '@material-ui/icons/LastPage';

export const getIcons = (classes, id, PaginationIcon, item, extraLeftPadding) => {
  return (
    <div style={{ paddingLeft: extraLeftPadding || '', marginLeft: '-4px' }}>
      <IconButton {...item} className={classes.sizeSmall} data-testid={id} data-el={id}>
        <PaginationIcon />
      </IconButton>
    </div>
  );
};

export const getPaginationItems = (args) => {
  const { items, classes, fontSize, fontWeight, color, pageNo, count } = args;
  let children = [];

  items?.map(({ page, type, selected, ...item }) => {
    switch (type) {
      case 'first':
        children.push(getIcons(classes, 'first', FirstPageIcon, item, '34px'));
        break;
      case 'previous':
        children.push(getIcons(classes, 'previous', ChevronLeftIcon, item));
        break;
      case 'next':
        children.push(getIcons(classes, 'next', ChevronRightIcon, item, '20px'));
        break;
      case 'last':
        children.push(getIcons(classes, 'last', LastPageIcon, item));
        break;
      case 'page':
        if (selected) {
          children.unshift(
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingBottom: '2px',
                fontSize: fontSize,
                fontWeight: fontWeight,
                color: color,
              }}
            >
              <div style={{ paddingRight: '24px' }}>Page</div>
              <div>{`${pageNo} of ${count}`}</div>
            </div>,
          );
        }
        break;
      default:
        break;
    }
  });

  return children;
};
