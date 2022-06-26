import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { AreaChart } from 'mdo-react-components';
import { timestampToShortLocal } from '../../../utils/formatHelpers';
import logger from 'utils/logger';
import { DisplayNoData } from 'components';
import { getText } from 'utils/localesHelpers';
import { MessageCloudStyling } from './styled';

const AreaGraphValue = (props) => {
  const { widgetCalculation, widget, dashboard, dashboardWidget, hotelId, date, period } = props;

  let noData = true;
  let data = [];
  let valueTypeIds = [];

  widgetCalculation.data[0]?.values.map((valueResult, index) => {
    if (!valueResult.data || !valueResult.data.length) {
      data.push([]);
    } else {
      const dataWithLocalDate = valueResult.data.map((obj, index) => {
        if (index === 0) {
          // all are the same, we only need one for this array
          valueTypeIds.push(obj.valueTypeId);
        }
        return { value: obj.value, date: timestampToShortLocal({ timestamp: obj.date }) };
      });
      data.push(dataWithLocalDate);
    }
  });

  const config = {
    colors: widget.widgetValues.map((item) => item.color),
    height: 250,
    valueTypeId: valueTypeIds,
    valueFormat: widget.widgetValues.map((item) => item.valueFormat),
    valueDecimals: widget.widgetValues.map((item) => item.valueDecimals),
    // this is hardcoded, once we get proper data, remove this:
    displaySize: widget.widgetValues.map((item) => 'auto'),
    //displaySize: widget.widgetValues.map((item) => item.displaySize),
    legendLabels: widget.widgetValues.map((obj) => {
      return obj.valueName;
    }),
    tooltipText: '{name}: {valueY.value}',
    // this is hardcoded, once we get proper data, remove this:
    applyCurrencyFormat: '0,000.00',
    legendScale: 0.55,
  };

  //check if no data
  data?.map((dataArray) => {
    const nullDataSize = dataArray.filter((item) => {
      return item.value === null || item.value === undefined;
    })?.length;
    // if array is not empty and not full of nulls we have data
    if (dataArray.length && nullDataSize !== dataArray.length) {
      noData = false;
    }
  });

  if (noData) {
    return (
      <MessageCloudStyling>
        <DisplayNoData message={getText('widgets.noDataToDisplay')} />
      </MessageCloudStyling>
    );
  }

  logger.debug(`AreaChart: ${widget.widgetName}`, {
    config,
    data,
    widgetValues: widget.widgetValues,
    widgetCalculation,
  });
  return <AreaChart id={dashboardWidget.id} data={data} config={config} />;
};

AreaGraphValue.displayName = 'AreaGraphValue';

AreaGraphValue.propTypes = {
  widgetCalculation: PropTypes.any,
  widget: PropTypes.any,
  hotelId: PropTypes.any,
  date: PropTypes.any,
  period: PropTypes.string,
  dashboard: PropTypes.any,
  dashboardWidget: PropTypes.any,
};

export { AreaGraphValue };
