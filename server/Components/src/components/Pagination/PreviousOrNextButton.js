import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { CATALOGUE } from '../../utils/catalogue';
import { Visible } from '../Visible';

const PreviousOrNextButton = memo(
  React.forwardRef((props, ref) => {
    const { itemClass, page, count, isPrev, onChange } = props;
    const isDisabled = isPrev ? page === 1 : page === count;

    return (
      <Button
        ref={ref}
        aria-label={isPrev ? CATALOGUE.PREV_ARIA_LABEL : CATALOGUE.NEXT_ARIA_LABEL}
        className={`${itemClass} ${isDisabled ? 'Mui-disabled' : ''}`}
        onClick={() => onChange(isPrev ? page - 1 : page + 1)}
      >
        <Visible on={['md', 'lg']}>{isPrev ? CATALOGUE.PREV_LABEL_TEXT : CATALOGUE.NEXT_LABEL_TEXT}</Visible>
        <Visible on={['xs', 'sm']}>{isPrev ? <ChevronLeftIcon /> : <ChevronRightIcon />}</Visible>
      </Button>
    );
  }),
);

PreviousOrNextButton.displayName = 'PreviousOrNextButton';
PreviousOrNextButton.propTypes = {
  itemClass: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  isPrev: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PreviousOrNextButton;
