import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from '../Drawer';
import { BaseList } from '../List';

import { useListItemStyles, useDrawerStyles } from './styled';

const SideBar = memo((props) => {
  const { items, open, anchor, onClick, selectedId, onClose, subheader, dense, disableGutters, disablePadding } = props;
  const listItemClasses = useListItemStyles();
  const drawerStyled = useDrawerStyles();

  return (
    <Drawer open={open} anchor={anchor} onClose={onClose} classes={drawerStyled}>
      <BaseList
        items={items}
        onClick={onClick}
        selectedId={selectedId}
        listItemClasses={listItemClasses}
        subheader={subheader}
        dense={dense}
        disableGutters={disableGutters}
        disablePadding={disablePadding}
      />
    </Drawer>
  );
});

SideBar.displayName = 'SideBar';

SideBar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      iconName: PropTypes.string,
      url: PropTypes.string,
    }),
  ).isRequired,
  anchor: PropTypes.oneOf(Drawer.anchors),
  dense: PropTypes.bool,
  disableGutters: PropTypes.bool,
  disablePadding: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  selectedId: PropTypes.any,
  subheader: PropTypes.node,
};

SideBar.defaultProps = {
  anchor: Drawer.anchors[0],
  dense: false,
  disablePadding: false,
  disableGutters: false,
};

SideBar.anchors = Drawer.anchors;

export { SideBar };
