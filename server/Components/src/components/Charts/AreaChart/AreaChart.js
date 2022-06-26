import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import PropTypes from 'prop-types';
import React, { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { colors as themeColors } from '../../../theme/colors';
import { AreaChartDiv } from './styled';
import { valueTypeIds, displaySizes, getNumberFormats, axisValues } from '../../../utils/chartHelpers';
import { getSizeInPx } from '../../../utils/propHelpers';

const AreaChart = memo((props) => {
  const { config, data, id } = props;
  const { width = '100%', height = '100%' } = config || {};
  const chartState = useRef(null);

  useLayoutEffect(() => {
    const defaultColors = [
      themeColors.blue,
      themeColors.orange,
      themeColors.salmonRed,
      themeColors.plum,
      themeColors.lightBlue,
      themeColors.grey,
    ];

    const defaultFormatValues = {
      valueTypeId: valueTypeIds.number,
      valueFormat: '0.00',
      valueDecimals: 2,
      displaySize: displaySizes.asIs,
    };

    const configuration = {
      bgColor: config?.bgColor || themeColors.white,
      bgOpacity: config?.bgOpacity || 0.5,
      colors: Array.isArray(config?.colors) && config?.colors?.length ? config?.colors : defaultColors,
      sampleField: config?.sampleField || 'date', // same as sampleField
      showTooltip: config?.showTooltip ?? true,
      tooltipText: config?.tooltipText || '{name}: {valueY.value}',
      showScrollbar: config?.showScrollbar ?? false,
      scrollbarScale: config?.scrollbarScale || 1,
      showCursor: config?.showCursor ?? true,
      showLegend: config?.showLegend ?? true,
      labelXAxis: config?.labelXAxis ?? '',
      labelYAxis: config?.labelYAxis ?? '',
      //legendLocation: config?.legendLocation || 0,
      legendLabels: config?.legendLabels || [],
      legendPosition: config?.legendPosition || 'bottom',
      legendScale: config?.legendScale || 0.55,

      showYAxisTooltip: config?.showYAxisTooltip ?? false,
      //inputDateFormat: config?.inputDateFormat || 'yyyy',
      startLocation: config?.startLocation || 0.5,
      endLocation: config?.endLocation || 0.5,

      // We send an array for next 4 values, but we use only first value.
      // Eventualy we can split usage of different format eventualy.
      valueTypeId:
        Array.isArray(config?.valueTypeId) && config?.valueTypeId?.length
          ? config?.valueTypeId[0]
          : config?.valueTypeId || defaultFormatValues.valueTypeId,
      valueFormat:
        Array.isArray(config?.valueFormat) && config?.valueFormat?.length
          ? config?.valueFormat[0]
          : config?.valueFormat || defaultFormatValues.valueFormat,
      valueDecimals:
        Array.isArray(config?.valueDecimals) && config?.valueDecimals?.length
          ? config?.valueDecimals[0]
          : config?.valueDecimals || defaultFormatValues.valueDecimals,
      displaySize:
        Array.isArray(config?.displaySize) && config?.displaySize?.length
          ? config?.displaySize[0]
          : config?.displaySize || defaultFormatValues.displaySize,
      strokeFillOpacity: config?.strokeFillOpacity || 1,
      strokeStacked: config?.strokeStacked ?? true,
      adjustLabelPrecision: config?.adjustLabelPrecision ?? false,
      applyCurrencyFormat: config?.applyCurrencyFormat,
      noOfGridCellsAprox:
        config?.noOfGridCellsAprox && config?.noOfGridCellsAprox >= 3 && config?.noOfGridCellsAprox <= 10
          ? config?.noOfGridCellsAprox
          : 4,
      xAxisFontSize: getSizeInPx(config?.xAxisFontSize) || '10px',
      yAxisFontSize: getSizeInPx(config?.yAxisFontSize) || '10px',

      tooltipBgrColor: config?.tooltipBgrColor || am4core.color(themeColors.white),
      tooltipBorderColor: config?.tooltipBorderColor || am4core.color(themeColors.grey),
      tooltipFontColor: config?.tooltipFontColor || am4core.color(themeColors.black),
      tooltipBorderWidth: config?.tooltipBorderWidth || 1,
      tooltipFontSize: getSizeInPx(config?.tooltipFontSize) || '10px',
      xAxisTooltipFontSize: getSizeInPx(config?.xAxisTooltipFontSize) || '10px',
      axixLinesColors: config?.axixLinesColors || themeColors.mediumGray,
      axisLinesWidth: config?.axisLinesWidth || 1,
      applyTooltipFormat: config.applyTooltipFormat
        ? {
            valueFormat: config.applyTooltipFormat?.valueFormat || '0,000.00',
            displaySize: config.applyTooltipFormat?.displaySize || 'as-is',
            valueTypeId: config.applyTooltipFormat?.valueTypeId || valueTypeIds.currency,
            addNumberFormatting: config.applyTooltipFormat?.addNumberFormatting || 'normal',
          }
        : null,
      applyXAxisFormat: config.applyXAxisFormat
        ? {
            valueFormat: config.applyXAxisFormat?.valueFormat || '0',
            displaySize: config.applyXAxisFormat?.displaySize || 'auto',
            valueTypeId: config.applyXAxisFormat?.valueTypeId || valueTypeIds.currency,
          }
        : null,
    };

    am4core.useTheme(am4themes_animated);
    let chart = am4core.create(id, am4charts.XYChart);
    let errorFounds = false;
    if (!Array.isArray(data)) {
      console.error(`The "AreaChart" component with "id=${id}" expected the "data" prop to be an array but got:`, data);
      errorFounds = true;
    }

    if (!errorFounds) {
      chart.background.fill = am4core.color(configuration.bgColor);
      chart.background.opacity = configuration.bgOpacity;

      configuration.colors.forEach((color) => chart.colors.list.push(am4core.color(color)));

      // number formatting
      const { numberFormat, bigNumberPrefixes } = getNumberFormats({ config: configuration, amchartUse: true });
      chart.numberFormatter.numberFormat = numberFormat;
      chart.numberFormatter.smallNumberThreshold = 0.000001;
      if (bigNumberPrefixes) {
        chart.numberFormatter.bigNumberPrefixes = bigNumberPrefixes;
      }

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.title.text = configuration.labelXAxis;
      dateAxis.renderer.minGridDistance = chart.innerWidth / configuration.noOfGridCellsAprox;
      const gridIntervals = [
        { timeUnit: 'day', count: 1 },
        { timeUnit: 'day', count: 2 },
        { timeUnit: 'day', count: 3 },
        { timeUnit: 'day', count: 4 },
        { timeUnit: 'day', count: 5 },
        { timeUnit: 'day', count: 7 },
        { timeUnit: 'day', count: 14 },
        { timeUnit: 'day', count: 15 },
        { timeUnit: 'day', count: 20 },
        { timeUnit: 'day', count: 30 },
        { timeUnit: 'day', count: 31 },
        { timeUnit: 'day', count: 45 },
        { timeUnit: 'day', count: 46 },
      ];

      dateAxis.gridIntervals.setAll(gridIntervals);
      dateAxis.fontSize = configuration.xAxisFontSize;
      chart.dateFormatter.dateFormat = 'MM-dd';
      dateAxis.tooltip.fontSize = configuration.xAxisTooltipFontSize;

      dateAxis.renderer.line.strokeOpacity = 1;
      dateAxis.renderer.line.strokeWidth = configuration.axisLinesWidth;
      dateAxis.renderer.line.stroke = am4core.color(configuration.axixLinesColors);

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = !configuration.showYAxisTooltip;
      valueAxis.title.text = configuration.labelYAxis;
      valueAxis.adjustLabelPrecision = configuration.adjustLabelPrecision;
      valueAxis.fontSize = configuration.yAxisFontSize;

      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = configuration.axisLinesWidth;
      valueAxis.renderer.line.stroke = am4core.color(configuration.axixLinesColors);

      if (configuration.applyXAxisFormat) {
        const { numberFormat: xAxisFormat, bigNumberPrefixes: xAxisBigNumberPrefixes } = getNumberFormats({
          config: {
            valueFormat: configuration.applyXAxisFormat.valueFormat,
            displaySize: configuration.applyXAxisFormat.displaySize,
            valueTypeId: configuration.applyXAxisFormat.valueTypeId,
          },
          amchartUse: true,
        });

        valueAxis.numberFormatter = new am4core.NumberFormatter();
        valueAxis.numberFormatter.smallNumberThreshold = 0.000001;
        valueAxis.numberFormatter.numberFormat = xAxisFormat;
      }

      data.forEach((singleLine, dataIndex) => {
        if (singleLine.length) {
          const singleLineData = singleLine.map((obj) => {
            // very important, if data is not complete, jsut skip that entry...
            if (obj.value !== null && obj[configuration.sampleField]) {
              return { [axisValues.y]: obj.value, [axisValues.x]: obj[configuration.sampleField] };
            }
          });

          // if decided to use it differently settign colors directly instead on on chart
          // check LineColumn chart to see how it is done.
          // const colorToUse = configuration.colors[dataIndex] ?? defaultColors[dataIndex % 3];
          let series = chart.series.push(new am4charts.LineSeries());
          series.name = configuration.legendLabels?.[dataIndex++];
          series.data = singleLineData;
          series.dataFields.dateX = axisValues.x;
          series.dataFields.valueY = axisValues.y;

          series.tooltip = new am4core.Tooltip();
          series.tooltipText = configuration.showTooltip ? configuration.tooltipText : '';
          series.tooltip.getFillFromObject = false;
          series.tooltip.background.fill = configuration.tooltipBgrColor;
          series.tooltip.background.stroke = configuration.tooltipBorderColor;
          series.tooltip.background.strokeWidth = configuration.tooltipBorderWidth;
          series.tooltip.label.fill = configuration.tooltipFontColor;
          series.tooltip.label.fontSize = configuration.tooltipFontSize;

          if (configuration.applyTooltipFormat) {
            const { numberFormat: tooltipFormat, bigNumberPrefixes: tooltipBigNumberPrefixes } = getNumberFormats({
              config: {
                valueFormat: configuration.applyTooltipFormat.valueFormat,
                displaySize: configuration.applyTooltipFormat.displaySize,
                valueTypeId: configuration.applyTooltipFormat.valueTypeId,
                addNumberFormatting: configuration.applyTooltipFormat.addNumberFormatting,
              },
              amchartUse: true,
            });

            series.tooltip.label.numberFormatter = new am4core.NumberFormatter();
            series.tooltip.label.numberFormatter.smallNumberThreshold = 0.000001;
            series.tooltip.label.numberFormatter.numberFormat = tooltipFormat;
          }

          series.fillOpacity = configuration.strokeFillOpacity;
          series.stacked = configuration.strokeStacked;
        }
      });

      if (configuration.showScrollbar) {
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarX.scale = configuration.scrollbarScale;
      }

      if (configuration.showCursor) {
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
      }

      if (configuration.showLegend) {
        chart.legend = new am4charts.Legend();
        chart.legend.position = configuration.legendPosition;
        chart.legend.scale = configuration.legendScale;
      }

      // this will prevent cutting off label at the right side
      chart.paddingRight = 20;
      chartState.current = chart;
    }

    return () => {
      chart.dispose();
    };
  }, [config, data, id]);

  return <AreaChartDiv id={id} width={width} height={height} />;
});

AreaChart.displayName = 'AreaChart';

AreaChart.propTypes = {
  data: PropTypes.array,
  id: PropTypes.string,
  config: PropTypes.shape({
    bgColor: PropTypes.string,
    bgOpacity: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sampleField: PropTypes.string,
    showTooltip: PropTypes.bool,
    tooltipText: PropTypes.string,
    showScrollbar: PropTypes.bool,
    scrollbarScale: PropTypes.number,
    showCursor: PropTypes.bool,
    showLegend: PropTypes.bool,
    labelXAxis: PropTypes.string,
    labelYAxis: PropTypes.string,
    legendLocation: PropTypes.number,
    legendLabels: PropTypes.arrayOf(PropTypes.string),
    legendPosition: PropTypes.string,
    legendScale: PropTypes.number,
    showYAxisTooltip: PropTypes.bool,
    startLocation: PropTypes.number,
    endLocation: PropTypes.number,
    valueTypeId: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
    valueFormat: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    valueDecimals: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
    displaySize: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    strokeFillOpacity: PropTypes.number,
    strokeStacked: PropTypes.bool,
    adjustLabelPrecision: PropTypes.bool,
    applyCurrencyFormat: PropTypes.string,
    noOfGridCellsAprox: PropTypes.number,
    xAxisFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    yAxisFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tooltipBgrColor: PropTypes.string,
    tooltipBorderColor: PropTypes.string,
    tooltipFontColor: PropTypes.string,
    tooltipBorderWidth: PropTypes.number,
    tooltipFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    xAxisTooltipFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    axixLinesColors: PropTypes.string,
    axisLinesWidth: PropTypes.number,
    applyTooltipFormat: PropTypes.shape({
      valueFormat: PropTypes.string,
      displaySize: PropTypes.string,
      valueTypeId: PropTypes.number,
      addNumberFormatting: PropTypes.string,
    }),
    applyXAxisFormat: PropTypes.shape({
      valueFormat: PropTypes.string,
      displaySize: PropTypes.string,
      valueTypeId: PropTypes.number,
    }),
  }),
};

AreaChart.defaultProps = {
  id: 'chartdiv',
  data: null,
};

export { AreaChart };
