import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Paginate from '@material-ui/lab/Pagination';
import { PaginationItem } from '@material-ui/lab';
import useStyles from './styled';
import { PAGINATION_BUTTON_TYPES } from '../../utils/catalogue';
import PreviousOrNextButton from './PreviousOrNextButton';

const Pagination = memo((props) => {
  const { count, page, onChange } = props;

  const classes = useStyles();

  return (
    <Paginate
      count={count}
      shape='rounded'
      classes={{ root: classes.root }}
      onChange={(event, pageNumber) => onChange(pageNumber)}
      page={page}
      renderItem={(item) => {
        const itemClass =
          'MuiButtonBase-root MuiPaginationItem-root MuiPaginationItem-page MuiPaginationItem-rounded MuiPaginationItem-actions';
        const buttonProps = { count, page, itemClass, onChange };

        switch (item.type) {
          case PAGINATION_BUTTON_TYPES.PREVIOUS:
            return <PaginationItem {...item} component={() => <PreviousOrNextButton {...buttonProps} isPrev />} />;

          case PAGINATION_BUTTON_TYPES.NEXT:
            return (
              <PaginationItem {...item} component={() => <PreviousOrNextButton {...buttonProps} isPrev={false} />} />
            );

          default:
            return <PaginationItem {...item} />;
        }
      }}
    />
  );
});

Pagination.displayName = 'Pagination';

Pagination.propTypes = {
  count: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
};

export default Pagination;
