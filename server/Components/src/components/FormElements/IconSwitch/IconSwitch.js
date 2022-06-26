import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Switch } from './../Switch';
import { Icon } from './../../Icon';
import { colors } from '../../../theme/colors';

import { IconSwitchWrapper } from './styled';

const IconSwitch = memo((props) => {
  const { value, iconName, ...rest } = props;
  return (
    <IconSwitchWrapper>
      <Icon name={iconName} color={value === true ? colors.blue : colors.lightGray} />
      <Switch value={value} {...rest} />
    </IconSwitchWrapper>
  );
});

IconSwitch.displayName = 'IconSwitch';

IconSwitch.propTypes = {
  iconName: PropTypes.string,
  ...Switch.propTypes,
};

IconSwitch.defaultProps = {
  iconName: 'BarChart',
  value: false,
};

export { IconSwitch };
