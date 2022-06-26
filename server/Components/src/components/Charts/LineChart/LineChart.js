import React, { memo, useRef, useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import PropTypes from 'prop-types';
import { colors } from '../../../theme/colors';
import { StyledDiv } from './styled';

const LineChart = memo((props) => {
  const { id, data, config } = props;
  const { width, height } = config || {};

  const chartState = useRef(null);

  useLayoutEffect(() => {
    const {
      bgColor,
      bgOpacity,
      showYAxisTooltip,
      showTooltip,
      tooltipText,
      showScrollbar,
      showCursor,
      showLegend,
      labelXAxis,
      labelYAxis,
      labelsYAxis,
      legendLocation,
      tensionX,
      strokeWidth,
    } = config || {};

    am4core.useTheme(am4themes_animated);

    let chart = am4core.create(id, am4charts.XYChart);

    chart.data = data;
    if (!Array.isArray(data)) {
      console.error('The "data" prop of the LineChart component is expected to be an array but got:', data);
      chart.data = [];
    }

    chart.background.fill = am4core.color(bgColor);
    chart.background.opacity = bgOpacity;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = legendLocation;
    dateAxis.title.text = labelXAxis;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = !showYAxisTooltip;
    valueAxis.title.text = labelYAxis;

    labelsYAxis.forEach((labelY) => {
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = labelXAxis;
      series.dataFields.valueY = labelY;
      series.strokeWidth = strokeWidth;
      series.tensionX = tensionX;
      series.bullets.push(new am4charts.CircleBullet());
      series.tooltipText = showTooltip ? tooltipText : '';
      if (showScrollbar) {
        let scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;
      }
    });

    chart.cursor = showCursor ? new am4charts.XYCursor() : null;
    chart.legend = showLegend ? new am4charts.Legend() : null;

    chartState.current = chart;

    return () => {
      chart.dispose();
    };
  }, [config, data, id]);

  return <StyledDiv id={id} width={width} height={height} />;
});

LineChart.displayName = 'LineChart';

LineChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.array,
  config: PropTypes.shape({
    bgColor: PropTypes.string,
    bgOpacity: PropTypes.number,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    labelXAxis: PropTypes.string,
    labelYAxis: PropTypes.string,
    labelsYAxis: PropTypes.arrayOf(PropTypes.string),
    legendLocation: PropTypes.number,
    showCursor: PropTypes.bool,
    showTooltip: PropTypes.bool,
    tooltipText: PropTypes.string,
    showScrollbar: PropTypes.bool,
    showYAxisTooltip: PropTypes.bool,
    showLegend: PropTypes.bool,
    tensionX: PropTypes.number,
    strokeWidth: PropTypes.number,
  }),
};

LineChart.defaultProps = {
  config: {
    bgColor: colors.white,
    bgOpacity: 0.5,
    width: '100%',
    heigth: '100%',
    legendLocation: 0,
    showCursor: true,
    showTooltip: true,
    tooltipText: '{valueY.value}',
    showScrollbar: false,
    showYAxisTooltip: false,
    showLegend: true,
    labelsYAxis: ['value'],
    labelXAxis: 'date',
    tensionX: 0.8,
    strokeWidth: 3,
  },
};

export default LineChart;
