import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';

import { ListItemIcon, ListItemText } from '../../List';
import { Icon } from '../../Icon';
import { Menu, MenuItem } from '../../Menu';
import { Button } from '../Button';

import { useStyles } from './styled';

const ButtonDropdown = memo((props) => {
  const { iconName, rightIconName, rightIconColor, disabled, text, title, dataEl, width, items, onClick, variant } =
    props;
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const handleMenuClick = (event, item) => {
    event.preventDefault();
    if (typeof onClick === 'function') {
      handleClose();
      onClick(item);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        dataEl={dataEl}
        variant={variant}
        onClick={handleClick}
        disabled={disabled}
        className={classes.buttonBgColor}
        iconName={iconName}
        rightIconName={rightIconName}
        rightIconColor={rightIconColor}
        text={text}
        title={title}
        width={width}
      />
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {items.map((item) => (
          <MenuItem
            key={item.label}
            disabled={item.disabled}
            data-el={item.dataEl}
            onClick={(event) => handleMenuClick(event, item)}
          >
            {item.icon && (
              <ListItemIcon>
                <Icon name={item.icon} size={20} />
              </ListItemIcon>
            )}
            <ListItemText primary={item.label} secondary={item.desription} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
});

ButtonDropdown.displayName = 'ButtonDropdown';

ButtonDropdown.propTypes = {
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  iconName: PropTypes.string,
  rightIconName: PropTypes.string,
  rightIconColor: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      icon: PropTypes.string,
      desription: PropTypes.string,
      dataEl: PropTypes.string,
    }),
  ),
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(Button.variants),
  title: PropTypes.string,
  dataEl: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

ButtonDropdown.defaultProps = {
  dataEl: 'buttonDropdown',
};

export { ButtonDropdown };
