import React, { memo } from 'react';
import * as MaterialIcons from '@material-ui/icons';
import PropTypes from 'prop-types';

import { Wrapper } from './styled';
import { ICONS } from './iconTypes';

const MaterialIconsNames = Object.keys(MaterialIcons);

const Icon = memo((props) => {
  const { name, size, color, disabled, ...rest } = props;

  const IconToUse = ICONS[name] || MaterialIcons[name] || ICONS.default;

  return (
    <Wrapper
      size={size}
      color={color}
      hidden={name === 'spacer'}
      disabled={disabled}
      local={!!ICONS[name] ? 1 : 0}
      {...rest}
    >
      <IconToUse />
    </Wrapper>
  );
});

Icon.displayName = 'Icon';

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string,
  disabled: PropTypes.bool,
};

Icon.defaultProps = {
  size: 32,
  color: '',
};

Icon.names = [...Object.keys(ICONS), ...MaterialIconsNames];
Icon.localNames = Object.keys(ICONS);
Icon.materialUiNames = MaterialIconsNames;

export default Icon;
