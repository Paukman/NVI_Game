import React from 'react';
import PropTypes from 'prop-types';
import { List } from './List';
import { BaseListItem } from './BaseListItem';

/**
 * This is a recursion component which renders as many levels of itself as needed.
 */
const BaseListImpl = (props) => {
  const { items, selectedId, onClick, dense, disablePadding, disableGutters, listItemClasses, subheader, level } =
    props;

  const hasIcons = items.some((item) => item.iconName);

  return (
    <List dense={dense} disablePadding={disablePadding} subheader={subheader} level={level}>
      {items.map((item) => {
        return (
          <BaseListItem
            ListComponent={BaseListImpl}
            key={item.id || item.label}
            button
            selectedId={selectedId}
            dense={dense}
            disableGutters={disableGutters}
            onClick={onClick}
            listItemClasses={listItemClasses}
            item={item}
            hasIcons={hasIcons}
            level={level}
          />
        );
      })}
    </List>
  );
};

BaseListImpl.displayName = 'BaseListImpl';

BaseListImpl.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any,
      label: PropTypes.string,
      iconName: PropTypes.string,
      disabled: PropTypes.bool,
      divider: PropTypes.bool,
      selectable: PropTypes.bool,
      secondary: PropTypes.string,
      primary: PropTypes.string,
      textBold: PropTypes.bool,
    }),
  ),
  selectedId: PropTypes.any,
  onClick: PropTypes.func,
  dense: PropTypes.bool,
  disablePadding: PropTypes.bool,
  disableGutters: PropTypes.bool,
  listItemClasses: PropTypes.any,
  subheader: PropTypes.node,
  level: PropTypes.number,
};

export { BaseListImpl };
