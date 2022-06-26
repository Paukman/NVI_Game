import React, { memo } from 'react';
import PropTypes from 'prop-types';

const GraphValue = (props) => {
  const { dashboard, dashboardWidget, hotelId, date, period } = props;
  // TODO: Finish the component to work as per requirements
  return <div>Gauge</div>;
};

GraphValue.displayName = 'GraphValue';

GraphValue.propTypes = {
  widgetCalculation: PropTypes.any,
  widget: PropTypes.any,
  hotelId: PropTypes.any,
  date: PropTypes.any,
  period: PropTypes.string,
  dashboard: PropTypes.any,
  dashboardWidget: PropTypes.any,
};

export { GraphValue };
