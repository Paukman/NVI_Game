import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ClickAwayListener } from '@material-ui/core';

const ClickAway = memo((props) => {
  const { onClickAway, children, mouseEvent } = props;

  return (
    <ClickAwayListener onClickAway={onClickAway} mouseEvent={mouseEvent}>
      {children}
    </ClickAwayListener>
  );
});
ClickAway.displayName = 'ClickAway';
ClickAway.mouseEvents = ['onClick', 'onMouseDown', 'onMouseUp', 'false'];
ClickAway.propTypes = {
  onClickAway: PropTypes.func,
  children: PropTypes.node,
  mouseEvent: PropTypes.oneOf(ClickAway.mouseEvents),
};
export { ClickAway };
