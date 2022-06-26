import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { TButton, sizesNames, variantNames } from './styled';
import { Icon } from '../../Icon';
import Progress from '../../Progresses/Progress';
const regular = '20px';
const large = '64px';
const Button = memo((props) => {
  const {
    id,
    text,
    size,
    variant,
    disabled,
    iconName,
    onClick,
    rightIconName,
    rightIconColor,
    inProgress,
    title,
    dataEl,
    width,
    fontSize,
  } = props;
  const attrs = {};
  if (id) {
    attrs['id'] = id;
  }

  return (
    <TButton
      {...attrs}
      // size is MUI attribute, but we use it to calculate min-widht and height
      // accepts only 'small', 'medium' and 'large'
      // will get warning if default is passed in, use medium instead, same values as default
      size={size === 'default' ? 'medium' : size}
      mdo_variant={!inProgress ? variant : 'none'}
      disabled={disabled}
      className={`tbutton`}
      onClick={onClick}
      just_icon={(!!iconName && !text).toString()}
      title={title}
      data-el={dataEl}
      width={width}
      fontSize={fontSize}
    >
      {iconName && <Icon name={iconName} size={!inProgress ? '20' : '15'} />}
      {text && <span>{text}</span>}
      {inProgress && <Progress type={'circularProgress'} size={size == 'large' ? large : regular} />}
      {rightIconName && <Icon name={rightIconName} size={!inProgress ? '20' : '15'} color={rightIconColor} />}
    </TButton>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  size: PropTypes.oneOf(sizesNames),
  variant: PropTypes.oneOf(variantNames),
  disabled: PropTypes.bool,
  iconName: PropTypes.string,
  rightIconName: PropTypes.string,
  rightIconColor: PropTypes.string,
  onClick: PropTypes.func,
  inProgress: PropTypes.bool,
  title: PropTypes.string,
  dataEl: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Button.defaultProps = {
  size: sizesNames[0],
  variant: variantNames[0],
  disabled: false,
  inProgress: false,
  fontSize: 14,
};

Button.sizes = sizesNames;
Button.variants = variantNames;

export { Button };
