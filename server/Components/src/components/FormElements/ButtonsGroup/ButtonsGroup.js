import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import { sizesNames, placements } from '../Button/styled';

import { ButtonsBox, ItemBox } from './styled';

const ButtonsGroup = memo((props) => {
  const { items, size, onClick, isVertical, placement } = props;

  const handleClick = (_, item) => {
    if (typeof item.onClick === 'function') {
      item.onClick(item);
    } else if (typeof onClick === 'function') {
      onClick(item);
    }
  };

  return (
    <ButtonsBox isVertical={isVertical} placement={placement}>
      {items.map((item) => (
        <ItemBox key={item.clickId || item.text}>
          <Button onClick={(event) => handleClick(event, item)} size={size} {...item} />
        </ItemBox>
      ))}
    </ButtonsBox>
  );
});

ButtonsGroup.displayName = 'ButtonsGroup';

ButtonsGroup.propTypes = {
  onClick: PropTypes.func,
  isVertical: PropTypes.bool,
  size: PropTypes.oneOf(sizesNames),
  placement: PropTypes.oneOf(placements),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      clickId: PropTypes.any,
      ...Button.propTypes,
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      onClick: PropTypes.func,
    }),
  ),
};

ButtonsGroup.defaultProps = {
  isVertical: false,
  size: sizesNames[0],
};

export { ButtonsGroup };
