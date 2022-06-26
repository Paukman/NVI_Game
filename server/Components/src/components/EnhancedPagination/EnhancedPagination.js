import React, { memo } from 'react';

import PropTypes from 'prop-types';
import useStyles from './styled';
import { GoToPage } from './GoToPage';
import { LinkActions } from '../LinkActions';
import { useEnhancedPagination } from './useEnhancedPagination';
import { leftButtons, rightButtons } from './constants';

const EnhancedPagination = memo((props) => {
  const { count, page, onChange, fontSize = '14px', fontWeight = 'normal', color } = props;
  const { state, handleGoToPageInpput, onChangePage, onHandleLeftButtons, onHandleRightButtons } =
    useEnhancedPagination(page, count, onChange);
  const classes = useStyles();

  return (
    <nav>
      <ul className={classes.ul}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingBottom: '2px',
            fontSize: fontSize,
            fontWeight: fontWeight,
            color: color,
          }}
        >
          <div style={{ paddingRight: '24px' }}>Page</div>
          <div>{`${page} of ${count}`}</div>
        </div>
        <li>
          <LinkActions
            noPadding
            disabled={state?.leftButtonsDisabled}
            items={leftButtons(state?.leftButtonColors)}
            onClick={(value) => {
              onHandleLeftButtons('leftButtons', value);
            }}
          />
        </li>
        <li>
          <LinkActions
            noPadding
            disabled={state?.rightButtonsDisabled}
            items={rightButtons(state?.rightButtonColors)}
            onClick={(value) => {
              onHandleRightButtons('rightButtons', value);
            }}
          />
        </li>
        <li style={{ paddingLeft: '24px' }}>
          <GoToPage
            value={state?.goToPage}
            onChange={handleGoToPageInpput}
            fontSize={props?.fontSize}
            fontWeight={props?.fontWeight}
            color={props?.color}
            iconColor={state?.iconColor}
            onSubmitPage={onChangePage}
          />
        </li>
      </ul>
    </nav>
  );
});

EnhancedPagination.displayName = 'EnhancedPagination';

EnhancedPagination.defaultProps = {
  fontSize: '14px',
  fontWeight: 'normal',
  page: 1,
};

EnhancedPagination.propTypes = {
  count: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  fontSize: PropTypes.string,
  fontWeight: PropTypes.string,
  color: PropTypes.string,
};

export default EnhancedPagination;
