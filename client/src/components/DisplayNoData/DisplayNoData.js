import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { NoDataToShow } from 'mdo-react-components';

const DisplayNoData = memo((props) => {
  const { message, dataEl } = props || {};

  return <NoDataToShow message={message} dataEl={dataEl} />;
});

DisplayNoData.displayName = 'DisplayNoData';

DisplayNoData.propTypes = {
  message: PropTypes.string,
  dataEl: PropTypes.string,
};

DisplayNoData.defaultProps = {
  message: '',
  dataEl: 'noDataToShow',
};

export { DisplayNoData };
