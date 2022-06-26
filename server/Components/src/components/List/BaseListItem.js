import React, { Fragment, memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from '../Collapse';
import { ListItem } from './ListItem';
import { ListItemIcon } from './ListItemIcon';
import { ListItemText } from './ListItemText';
import { Icon } from '../Icon';
import { Typography } from '../Typography';

import { useTypographyStyles } from './styled';

/**
 * This is a smart list item that can render children if and and has its own state
 */
const BaseListItem = memo((props) => {
  const {
    listItemClasses,
    disableGutters,
    selectedId,
    dense,
    ListComponent,
    item,
    hasIcons,
    onClick,
    level,
    dividerHeight,
  } = props;
  const { id, label, iconName, disabled, divider, items, selectable, primary, secondary } = item || {};

  const [open, setOpen] = useState(selectedId === id);
  const classes = useTypographyStyles();

  const hasChildren = Array.isArray(items) && items.length > 0;
  const iconSpacer = hasIcons && !iconName;

  const handleItemClick = (event) => {
    event.preventDefault();

    if (divider) {
      return;
    }

    if (hasChildren) {
      setOpen(!open);
    }

    if (selectable !== false && typeof onClick === 'function') {
      if (!open) {
        onClick(item);
      }
    }
  };

  return (
    <Fragment>
      <ListItem
        dividerHeight={dividerHeight}
        button
        selected={selectedId === id}
        dense={dense}
        disabled={disabled}
        divider={divider}
        disableGutters={disableGutters}
        onClick={handleItemClick}
        classes={listItemClasses}
      >
        {(iconName || iconSpacer) && (
          <ListItemIcon>
            {iconName && <Icon name={iconName} size={24} />}
            {!iconName && iconSpacer && <Icon name='spacer' size={24} />}
          </ListItemIcon>
        )}
        <ListItemText
          disableTypography
          textBold={!!primary}
          primary={primary}
          secondary={secondary ? <Typography className={classes.root}>{secondary}</Typography> : undefined}
        >
          {label}
        </ListItemText>
        {hasChildren && typeof open === 'boolean' && <Icon name={open ? 'ExpandLess' : 'ExpandMore'} />}
      </ListItem>
      {hasChildren && (
        <Collapse disablePadding open={open}>
          {
            <ListComponent
              items={items}
              selectedId={selectedId}
              onClick={onClick}
              dense={dense}
              disablePadding={true}
              disableGutters={disableGutters}
              listItemClasses={listItemClasses}
              level={level + 1}
            />
          }
        </Collapse>
      )}
    </Fragment>
  );
});

BaseListItem.displayName = 'BaseListItem';

BaseListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.any,
    label: PropTypes.string,
    iconName: PropTypes.string,
    disabled: PropTypes.bool,
    divider: PropTypes.bool,
    selectable: PropTypes.bool,
    secondary: PropTypes.string,
    primary: PropTypes.string,
  }),
  hasIcons: PropTypes.bool,
  open: PropTypes.any,
  onClick: PropTypes.func,
  disablePadding: PropTypes.bool,
  disableGutters: PropTypes.bool,
  listItemClasses: PropTypes.any,
  selectedId: PropTypes.any,
  dense: PropTypes.bool,
  ListComponent: PropTypes.elementType,
  level: PropTypes.number,
  dividerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

BaseListItem.defaultProps = {
  dividerHeight: '1px',
};

export { BaseListItem };
