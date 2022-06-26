import React from 'react';
import PropTypes from 'prop-types';
import { colors, ColumnChart, LineColumnChart } from 'mdo-react-components';
import logger from 'utils/logger';
import { DisplayNoData, StrDisclaimer } from 'components';
import { getText } from 'utils/localesHelpers';
import { MessageCloudStyling } from './styled';
import { prepareDataForRollingRevenue, adjustDataForTrend, isDataAvailable } from './utils';
import { WIDGET_ID } from './constants';

const ColumnChartValue = (props) => {
  const { widgetCalculation, widget, dashboardWidget } = props;

  // quicky determine if this is rolling revenue...
  let rollingRevenue = false;
  widgetCalculation.data[0]?.values.map((valueResult, index) => {
    const dataLenght = valueResult.data?.length;
    if (dataLenght && dataLenght > 1) {
      rollingRevenue = true;
    }
  });

  let data = [];
  let valueTypeIds = [];

  let trendData = true;
  if (rollingRevenue) {
    let latestDate = null;
    let earliestDate = null;
    ({ data, valueTypeIds, latestDate, earliestDate } = prepareDataForRollingRevenue(widgetCalculation, trendData));
    data = adjustDataForTrend(data, latestDate, earliestDate);
  } else {
    data = widgetCalculation.data[0]?.values.map((valueResult, index) => {
      const widgetValue = widget.mapWidgetValues?.[valueResult.widgetValueId] || {};
      const label = widgetValue.valueName || '';

      return {
        value: valueResult.data?.[0]?.value,
        valueTypeId: widgetValue.valueTypeId,
        label,
      };
    });
  }

  // TODO: following lines hardcoded, has to come from data, set for phase 2.
  let type = 2;

  //RevPAR (Revenue Per Available Room)
  //ADR (Average Daily Rate)
  let config = {
    bgColor: colors.white,
    bgOpacity: 0.5,
    colors: widget?.widgetValues?.map((item) => item.color),
    fontWeightAxis: 'bold',
    width: '100%',
    categoryText: 'label',
    legendLocation: 0,
    labelXAxis: 'label',
    opacity: 0.8,
    seriesName: 'Items',
    tooltipText: '{categoryX}: [bold]{valueY}[/]',
    lineWidth: 2,
    lineOpacity: 1,
    minGridDistance: 30,
    showLegend: false,
    showTitle: false,
    useBullet: true,
    spacePercentageAndBar: 15,
    bulletTooltip: '{valueY}',
    valueFields: ['value'],
    // TODO: following lines hardcoded, has to come from data, set for phase 2.
    valueTypeId: type,
    showBulletAsTotalPercentage: widget?.id === WIDGET_ID.AR_AGING_WIDGET ? true : false,
    bulletTooltipAsTotalPercentage: "[bold]{valueY.percent.formatNumber('#.')}%",
  };

  if (widget.id === WIDGET_ID.OCCUPANCY) {
    config.valueTypeId = 3;
    config.applyXAxisFormat = {
      valueFormat: '0',
      displaySize: 'auto',
      valueTypeId: 3,
    };
  } else if (!rollingRevenue && type === 2) {
    config.applyXAxisFormat = {
      valueFormat: '0,000',
      displaySize: 'auto',
      valueTypeId: 2,
    };
  }

  if (rollingRevenue) {
    config.labelXAxis = '';
    config.legendPosition = 'bottom';
    config.dataPointsQty = 7;
    config.labelXAxis = '';
    config.legendLabels = widget?.widgetValues?.map((obj) => {
      return obj.valueName;
    });
    config.showLegend = true;
    config.dataTypes = widget?.widgetValues?.map((obj) => {
      return obj.widgetValueTypeId;
    });
    config.legendScale = 0.55;
    config.valueTypeId = valueTypeIds;
    config.valueFormat = widget?.widgetValues?.map((item) => item.valueFormat);
    config.valueDecimals = widget?.widgetValues?.map((item) => item.valueDecimals);

    // this is hardcoded, once we get proper data, remove this:
    config.displaySize = widget?.widgetValues?.map((item) => 'auto');
    //config.displaySize = widget.widgetValues.map((item) => item.displaySize);
    config.tooltipText = '{name}: {valueY.value}';

    // this is hardcoded, once we get proper data, remove this:
    config.applyCurrencyFormat = '0,000.00';
    config.applyTooltipFormat = {
      valueFormat: '0,000.00',
      displaySize: 'as-is',
      valueTypeId: 2,
      addNumberFormatting: 'bold',
    };
    config.applyXAxisFormat = {
      valueFormat: '0',
      displaySize: 'auto',
      valueTypeId: 2,
    };
  }
  config.height = widget.widgetName.includes('STR:') ? 230 : 260;
  (config.name = widget.widgetName),
    logger.debug(`ColumnChartValue: ${widget.widgetName}`, {
      data,
      widget,
      widgetValues: widget?.widgetValues,
      widgetCalculation,
      colors: config.colors,
      config,
    });

  // quickly check if data is available
  const dataIsAvailable = isDataAvailable(data, rollingRevenue);
  if (!dataIsAvailable) {
    return (
      <MessageCloudStyling>
        <DisplayNoData message={getText('widgets.noDataToDisplay')} />
      </MessageCloudStyling>
    );
  }

  if (rollingRevenue) {
    return (
      <>
        <LineColumnChart id={dashboardWidget.id} data={data} config={config} />
        {widget.widgetName.includes('STR:') && <StrDisclaimer />}
      </>
    );
  } else {
    return <ColumnChart id={dashboardWidget.id} data={data} config={config} />;
  }
};

ColumnChartValue.displayName = 'ColumnChartValue';

ColumnChartValue.propTypes = {
  widgetCalculation: PropTypes.any,
  widget: PropTypes.any,
  hotelId: PropTypes.any,
  date: PropTypes.any,
  period: PropTypes.string,
  dashboard: PropTypes.any,
  dashboardWidget: PropTypes.any,
};

export { ColumnChartValue };
