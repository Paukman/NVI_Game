import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'mdo-react-components';

const PickupDefaultSettings = memo((props) => {
  const { open, onClose /*, onSaved*/ } = props;

  return (
    <Drawer open={open} onClose={onClose} anchor='right'>
      Settings
    </Drawer>
  );
});

PickupDefaultSettings.displayName = 'PickupDefaultSettings';

PickupDefaultSettings.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSaved: PropTypes.func,
};

export { PickupDefaultSettings };
