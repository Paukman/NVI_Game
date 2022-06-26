import React from 'react';
import PropTypes from 'prop-types';
import logger from 'utils/logger';
import { NumberValue as NumberValues, NumberValueBars } from 'mdo-react-components';

const NumberValue = (props) => {
  const { widgetCalculation, widget, dashboard, dashboardWidget, hotelId, date, period } = props;

  // TODO: Finish the component to work as per requirements
  if (!widget) {
    return 'No Widget Found';
  }

  // defines design of how number value looks like. There are 2 options: default and alternative
  const widgetVariant = widget.widgetVariant;

  const data = widgetCalculation.data[0]?.values.map((valueResult) => {
    const widgetValue = widget.mapWidgetValues?.[valueResult.widgetValueId] || {};
    const label = widgetValue.valueName || '';

    return {
      value: valueResult.data?.[0]?.value,
      valueTypeId: widgetValue.valueTypeId,
      label,
    };
  });

  const config = {
    colors: widget.widgetValues.map((item) => item.color),
    height: 200,
    valueTypeId: data.map((item) => item.valueTypeId),
    valueFormat: widget.widgetValues.map((item) => item.valueFormat),
    valueDecimals: widget.widgetValues.map((item) => item.valueDecimals),
  };
  logger.debug(`NumberValue: ${widget.widgetName}`, {
    data,
    config,
    widgetValues: widget.widgetValues,
    widgetCalculation,
    widgetVariant,
  });

  return widgetVariant === 'default' ? (
    <NumberValueBars id={dashboardWidget.id} data={data} config={config} />
  ) : (
    <NumberValues id={dashboardWidget.id} data={data} config={config} />
  );
};

NumberValue.displayName = 'NumberValue';

NumberValue.propTypes = {
  widgetCalculation: PropTypes.any,
  widget: PropTypes.any,
  hotelId: PropTypes.any,
  date: PropTypes.any,
  period: PropTypes.string,
  dashboard: PropTypes.any,
  dashboardWidget: PropTypes.any,
};

export { NumberValue };
