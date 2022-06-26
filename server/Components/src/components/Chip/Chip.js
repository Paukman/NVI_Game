import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Chip as MaterialUiChip } from '@material-ui/core';
import { buildAttributes } from '../../utils/formHelpers';

const Chip = memo((props) => {
  const { label, disabled, size, variant, color, clickable, onDelete, onClick } = props;

  return (
    <MaterialUiChip
      label={label}
      disabled={disabled}
      size={size}
      variant={variant}
      color={color}
      clickable={clickable}
      onDelete={onDelete}
      onClick={onClick}
      {...buildAttributes(props)}
    />
  );
});

Chip.colors = ['default', 'primary', 'secondary'];
Chip.variants = ['default', 'outlined'];
Chip.sizes = ['small', 'medium'];

Chip.displayName = 'Chip';

Chip.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(Chip.sizes),
  variant: PropTypes.oneOf(Chip.variants),
  color: PropTypes.oneOf(Chip.colors),
  clickable: PropTypes.bool,
  dataEl: PropTypes.string,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};

Chip.defaultProps = {
  disabled: false,
  color: Chip.colors[0],
  variant: Chip.variants[0],
  size: Chip.sizes[0],
  label: 'Chip',
};

export { Chip };
