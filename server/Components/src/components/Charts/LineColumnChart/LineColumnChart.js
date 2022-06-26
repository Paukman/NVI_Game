import React, { memo, useRef, useLayoutEffect, useMemo } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import PropTypes from 'prop-types';
import { colors as themeColors } from '../../../theme/colors';
import { StyledDiv } from './styled';
import { axisValues, getPointsQtyDataForColumns, dataTypeId } from './utils';
import { getNumberFormats, displaySizes, valueTypeIds } from '../../../utils/chartHelpers';
import { getSizeInPx } from '../../../utils/propHelpers';

const LineColumnChart = memo((props) => {
  const { id, data, config } = props;
  const { width = '100%', height = '100%' } = config || {};
  const chartState = useRef(null);

  useLayoutEffect(() => {
    const defaultColors = [themeColors.widgetsDarkGreen, themeColors.widgetsRed, themeColors.widgetsLightGreen];
    const defaultFormatValues = {
      valueTypeId: valueTypeIds.number,
      valueFormat: '0.00',
      valueDecimals: 2,
      displaySize: displaySizes.asIs,
    };
    const configuration = {
      bgColor: config?.bgColor || themeColors.white,
      bgOpacity: config?.bgOpacity || 0.5,
      showYAxisTooltip: config?.showYAxisTooltip ?? false,
      showTooltip: config?.showTooltip ?? true,
      tooltipText: config?.tooltipText || '{name}: {valueY.value}',
      showScrollbar: config?.showScrollbar ?? false,
      showCursor: config?.showCursor ?? true,
      showLegend: config?.showLegend ?? true,
      labelXAxis: config?.labelXAxis ?? 'Date', //default, could be anything
      labelYAxis: config?.labelYAxis ?? '', //default, could be anything
      //legendLocation: config?.legendLocation || 0,
      legendLabels: config?.legendLabels || [],
      tensionX: config?.tensionX || 0.8,
      strokeWidth: config?.strokeWidth || 3,
      dataPointsQty: config?.dataPointsQty || 7,
      colors: Array.isArray(config?.colors) && config?.colors?.length ? config.colors : [],
      legendPosition: config?.legendPosition || 'bottom',
      sampleField: config?.sampleField || 'date',
      dataTypes: config?.dataTypes || [], // this is mandatory
      twoColumnsFullWidth: config?.twoColumnsFullWidth || 50,
      twoColumnsPartialWidth: config?.twoColumnsPartialWidth || 30,
      legendScale: config?.legendScale || 0.75,
      valueTypeId:
        Array.isArray(config.valueTypeId) && config.valueTypeId?.length
          ? config.valueTypeId[0]
          : config.valueTypeId || defaultFormatValues.valueTypeId,
      valueFormat:
        Array.isArray(config.valueFormat) && config.valueFormat?.length
          ? config.valueFormat[0]
          : config.valueFormat || defaultFormatValues.valueFormat,
      valueDecimals:
        Array.isArray(config.valueDecimals) && config.valueDecimals?.length
          ? config.valueDecimals[0]
          : config.valueDecimals || defaultFormatValues.valueDecimals,
      displaySize:
        Array.isArray(config.displaySize) && config.displaySize?.length
          ? config.displaySize[0]
          : config.displaySize || defaultFormatValues.displaySize,
      adjustLabelPrecision: config.adjustLabelPrecision ?? false,
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

    if (!Array.isArray(data) || (Array.isArray(data) && !data.length)) {
      console.error('The "data" prop of the LineColumnChart component is expected to be an array but got:', data);
      errorFounds = true;
    }
    if (
      !Array.isArray(configuration.dataTypes) ||
      (Array.isArray(configuration.dataTypes) && !configuration.dataTypes.length)
    ) {
      console.error('The "dataTypes" prop of the LineColumnChart component is expected to be an array but got:', data);
      errorFounds = true;
    }
    if (
      Array.isArray(data) &&
      Array.isArray(configuration.dataTypes) &&
      data.length !== configuration.dataTypes.length
    ) {
      console.error(
        'The data and dataTypes do not have the same length, data length',
        data.length,
        ' dataTypes length',
        configuration.dataTypes.length,
      );
      errorFounds = true;
    }

    let columnDataLength = 0;

    if (!errorFounds) {
      columnDataLength = configuration.dataTypes.filter((type) => type === dataTypeId.column)?.length;

      // will be used for only 2 columns display
      let numberOfLinesWithData = data.reduce((allLines, prevLine, index) => {
        if (configuration.dataTypes[index] === dataTypeId.line && prevLine.length) {
          allLines++;
        }
        return allLines;
      }, 0);

      chart.background.fill = am4core.color(configuration.bgColor);
      chart.background.opacity = configuration.bgOpacity;

      // lets leave this for now, and think about other types later...
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      //dateAxis.renderer.grid.template.location = configuration.legendLocation;
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

      // let otherValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      // otherValueAxis.tooltip.disabled = !configuration.showYAxisTooltip;
      // otherValueAxis.title.text = configuration.labelYAxis;
      // otherValueAxis.adjustLabelPrecision = configuration.adjustLabelPrecision;
      // otherValueAxis.fontSize = configuration.yAxisFontSize;

      // otherValueAxis.renderer.line.strokeOpacity = 1;
      // otherValueAxis.renderer.line.strokeWidth = configuration.axisLinesWidth;
      // otherValueAxis.renderer.line.stroke = am4core.color(configuration.axixLinesColors);
      // otherValueAxis.renderer.opposite = true;

      const { numberFormat, bigNumberPrefixes } = getNumberFormats({ config: configuration, amchartUse: true });
      chart.numberFormatter.numberFormat = numberFormat;
      // refer to https://www.amcharts.com/docs/v4/reference/numberformatter/#smallNumberThreshold_property
      chart.numberFormatter.smallNumberThreshold = 0.000001;
      if (bigNumberPrefixes) {
        chart.numberFormatter.bigNumberPrefixes = bigNumberPrefixes;
      }
      let columnIndex = 0;

      let tooltipFormat = null;
      if (configuration.applyTooltipFormat) {
        ({ numberFormat: tooltipFormat } = getNumberFormats({
          config: {
            valueFormat: configuration.applyTooltipFormat.valueFormat,
            displaySize: configuration.applyTooltipFormat.displaySize,
            valueTypeId: configuration.applyTooltipFormat.valueTypeId,
            addNumberFormatting: configuration.applyTooltipFormat.addNumberFormatting,
          },
          amchartUse: true,
        }));
      }

      data.forEach((singleColumn, dataIndex) => {
        if (configuration.dataTypes[dataIndex] === dataTypeId.column && singleColumn.length) {
          const singleColumnData = singleColumn.map((obj) => {
            // very important, if data is not complete, just skip that entry...
            if (obj.value !== null && obj[configuration.sampleField]) {
              return { [axisValues.y]: obj.value, [axisValues.x]: obj[configuration.sampleField] };
            }
          });
          const colorToUse = configuration.colors[dataIndex] ?? defaultColors[dataIndex % 3];
          defaultColors[dataIndex % 3];
          let series = chart.series.push(new am4charts.ColumnSeries());
          series.yAxis = valueAxis;
          series.data = getPointsQtyDataForColumns(singleColumnData, configuration.dataPointsQty);
          series.dataFields.dateX = axisValues.x;
          series.dataFields.valueY = axisValues.y;
          series.name = configuration.legendLabels?.[dataIndex++];
          series.columns.template.stroke = am4core.color(colorToUse);
          series.columns.template.fill = am4core.color(colorToUse);

          series.tooltip = new am4core.Tooltip();
          series.tooltipText = configuration.showTooltip ? configuration.tooltipText : '';
          series.tooltip.getFillFromObject = false;
          series.tooltip.background.fill = configuration.tooltipBgrColor;
          series.tooltip.background.stroke = configuration.tooltipBorderColor;
          series.tooltip.background.strokeWidth = configuration.tooltipBorderWidth;
          series.tooltip.label.fill = configuration.tooltipFontColor;
          series.tooltip.label.fontSize = configuration.tooltipFontSize;

          if (configuration.applyTooltipFormat) {
            series.tooltip.label.numberFormatter = new am4core.NumberFormatter();
            series.tooltip.label.numberFormatter.smallNumberThreshold = 0.000001;
            series.tooltip.label.numberFormatter.numberFormat = tooltipFormat;
          }

          if (
            columnDataLength === 2 &&
            columnIndex === 0 &&
            (singleColumnData.length <= 15 || !numberOfLinesWithData)
          ) {
            series.columns.template.width = am4core.percent(configuration.twoColumnsFullWidth);
            series.clustered = false;
          } else if (
            columnDataLength === 2 &&
            columnIndex === 1 &&
            (singleColumnData.length <= 15 || !numberOfLinesWithData)
          ) {
            series.columns.template.width = am4core.percent(configuration.twoColumnsPartialWidth);
            series.clustered = false;
          }
          columnIndex++;
        }
      });

      data.forEach((singleLine, dataIndex) => {
        if (configuration.dataTypes[dataIndex] === dataTypeId.line && singleLine.length) {
          const singleLineData = singleLine.map((obj) => {
            // very important, if data is not complete, jsut skip that entry...
            if (obj.value !== null && obj[configuration.sampleField]) {
              return { [axisValues.y]: obj.value, [axisValues.x]: obj[configuration.sampleField] };
            }
          });
          const colorToUse = configuration.colors[dataIndex] ?? defaultColors[dataIndex % 3];

          let line = chart.series.push(new am4charts.LineSeries());
          line.yAxis = valueAxis;
          line.name = configuration.legendLabels?.[dataIndex++];
          line.data = singleLineData;
          line.dataFields.dateX = axisValues.x;
          line.dataFields.valueY = axisValues.y;
          line.connect = false;
          line.strokeWidth = configuration.strokeWidth;
          line.tensionX = configuration.tensionX;

          const bullet = line.bullets.push(new am4charts.Bullet());
          const cirlce = bullet.createChild(am4core.Circle);
          cirlce.width = 4;
          cirlce.height = 4;

          line.tooltip = new am4core.Tooltip();
          line.tooltipText = configuration.showTooltip ? configuration.tooltipText : '';
          line.tooltip.getFillFromObject = false;
          line.tooltip.background.fill = configuration.tooltipBgrColor;
          line.tooltip.background.stroke = configuration.tooltipBorderColor;
          line.tooltip.background.strokeWidth = configuration.tooltipBorderWidth;
          line.tooltip.label.fill = configuration.tooltipFontColor;
          line.tooltip.label.fontSize = configuration.tooltipFontSize;

          if (configuration.applyTooltipFormat) {
            line.tooltip.label.numberFormatter = new am4core.NumberFormatter();
            line.tooltip.label.numberFormatter.smallNumberThreshold = 0.000001;
            line.tooltip.label.numberFormatter.numberFormat = tooltipFormat;
          }

          line.fill = am4core.color(themeColors.white);
          line.stroke = am4core.color(colorToUse);

          if (configuration.showScrollbar) {
            let scrollbarX = new am4charts.XYChartScrollbar();
            scrollbarX.series.push(line);
            chart.scrollbarX = scrollbarX;
          }
        }
      });

      chart.cursor = configuration.showCursor ? new am4charts.XYCursor() : null;
      chart.legend = configuration.showLegend ? new am4charts.Legend() : null;
      if (chart.legend) {
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

  return <StyledDiv id={id} width={width} height={height} />;
});

LineColumnChart.displayName = 'LineColumnChart';

LineColumnChart.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  config: PropTypes.shape({
    bgColor: PropTypes.string,
    bgOpacity: PropTypes.number,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    labelXAxis: PropTypes.string,
    labelYAxis: PropTypes.string,
    legendLocation: PropTypes.number,
    legendLabels: PropTypes.arrayOf(PropTypes.string),
    showCursor: PropTypes.bool,
    showTooltip: PropTypes.bool,
    tooltipText: PropTypes.string,
    showScrollbar: PropTypes.bool,
    showYAxisTooltip: PropTypes.bool,
    showLegend: PropTypes.bool,
    tensionX: PropTypes.number,
    strokeWidth: PropTypes.number,
    dataPointsQty: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string),
    legendPosition: PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
    sampleField: PropTypes.string,
    dataTypes: PropTypes.arrayOf(PropTypes.number).isRequired,
    twoColumnsFullWidth: PropTypes.number,
    twoColumnsPartialWidth: PropTypes.number,
    legendScale: PropTypes.number,
    valueDecimals: PropTypes.number,
    valueTypeId: PropTypes.number,
    valueFormat: PropTypes.string,
    displaySize: PropTypes.string,
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

LineColumnChart.defaultProps = {};

export default LineColumnChart;
