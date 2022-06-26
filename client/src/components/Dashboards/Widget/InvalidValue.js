import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage } from 'components/ErrorMessage';

const InvalidValue = (props) => {
  return <ErrorMessage>Unsupported Widget Value Type</ErrorMessage>;
};

InvalidValue.displayName = 'InvalidValue';

InvalidValue.propTypes = {
  widgetCalculation: PropTypes.any,
  widget: PropTypes.any,
  hotelId: PropTypes.any,
  date: PropTypes.any,
  period: PropTypes.string,
  dashboard: PropTypes.any,
  dashboardWidget: PropTypes.any,
};

export { InvalidValue };
