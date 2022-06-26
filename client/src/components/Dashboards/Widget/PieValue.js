import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { PieChart, colors } from 'mdo-react-components';
import logger from 'utils/logger';
import { toNumber } from 'utils/formatHelpers';
import { DisplayNoData } from 'components';
import { getText } from 'utils/localesHelpers';
import { MessageCloudStyling } from './styled';

const PieValue = (props) => {
  const { widgetCalculation, widget, dashboard, dashboardWidget, hotelId, date, period } = props;

  let totalAmount = 0;

  // TODO: Finish the component to work as per requirements
  const data = widgetCalculation.data[0]?.values.map((valueResult) => {
    const widgetValue = widget.mapWidgetValues?.[valueResult.widgetValueId] || {};
    const label = widgetValue.valueName || '';

    totalAmount += toNumber(valueResult.data?.[0]?.value);

    return {
      value: valueResult.data?.[0]?.value,
      valueTypeId: widgetValue.valueTypeId,
      label,
    };
  });

  const config = {
    colors: widget.widgetValues.map((item) => item.color),
    width: '100%',
    height: '250px',
    innerRadius: 30,
    valueText: 'value',
    labelText: 'label',
    legendPosition: 'bottom',
    removeLegendValue: true,
    removePieLables: true,
    /**
     * This is template format in https://www.amcharts.com/docs/v4/concepts/formatters/formatting-strings/
     * */
    seriesLabelsTemplateText: "{value.percent.formatNumber('#.#')}%",
    tooltipText: "{category}: {value.percent.formatNumber('#.')}% ({value.value.formatNumber('#.00')})",
    legendText: "{value.percent.formatNumber('#.00')}%",
    applyTooltipFormat: {
      valueFormat: '0,000.00',
      displaySize: 'as-is',
      valueTypeId: 2,
      addNumberFormatting: 'bold',
    },
  };

  logger.debug(`PieChart: ${widget.widgetName}`, {
    data,
    widget,
    widgetValues: widget.widgetValues,
    widgetCalculation,
    config,
  });

  if (totalAmount == 0) {
    return (
      <MessageCloudStyling>
        <DisplayNoData message={getText('widgets.noDataToDisplay')} />
      </MessageCloudStyling>
    );
  }

  return <PieChart id={dashboardWidget.id} data={data} config={config} />;
};

PieValue.displayName = 'PieValue';

PieValue.propTypes = {
  widgetCalculation: PropTypes.any,
  widget: PropTypes.any,
  hotelId: PropTypes.any,
  date: PropTypes.any,
  period: PropTypes.string,
  dashboard: PropTypes.any,
  dashboardWidget: PropTypes.any,
};

export { PieValue };
