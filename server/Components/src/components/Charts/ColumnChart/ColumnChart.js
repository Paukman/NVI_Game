import React, { memo, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { colors as themeColors } from '../../../theme/colors';
import { ColumnChartDiv } from './styled';
import { getSizeInPx } from '../../../utils/propHelpers';
import { valueTypeIds, displaySizes, getNumberFormats } from '../../../utils/chartHelpers';

const ColumnChart = memo((props) => {
  const { config = {}, id, data = [] } = props;
  const { width, height, colors } = config || {};

  const chartState = useRef(null);

  useLayoutEffect(() => {
    const defaultColors = [themeColors.red, themeColors.blue, themeColors.orange];

    const defaultFormatValues = {
      valueTypeId: valueTypeIds.currency, // most common one
      valueFormat: '0,000.00',
      valueDecimals: 2,
      displaySize: displaySizes.asIs,
    };

    const defaultYAxisFormat = {
      valueTypeId: valueTypeIds.currency, // most common one
      valueFormat: '0,000.00',
      valueDecimals: 2,
      displaySize: displaySizes.asIs,
    };

    const configuration = {
      name: config?.name || '',
      bgColor: config?.bgColor || themeColors.white,
      bgOpacity: config?.bgOpacity || 0.5,
      colors: Array.isArray(config?.colors) && config?.colors?.length ? config?.colors : defaultColors,
      categoryText: config?.categoryText || 'label',
      legendLocation: config?.legendLocation || 0,
      legendLabels: config?.legendLabels || [],
      minGridDistance: config?.minGridDistance || 30,
      valueFields: Array.isArray(config?.valueFields) && config?.valueFields?.length ? config?.valueFields : ['value'],
      labelXAxis: config?.labelXAxis || 'label',
      seriesName: config?.seriesName || 'Items',
      opacity: config?.opacity || 0.8,
      lineWidth: config?.lineWidth || 2,
      lineOpacity: config?.lineOpacity || 1,
      showLegend: config?.showLegend ?? true,
      legendPosition: config?.legendPosition || 'bottom',

      showTitle: config?.showTitle ?? false,
      mainTitle: config?.mainTitle || '',
      mainTitleFontSize: config?.mainTitleFontSize || '12px',
      mainTitleMarginBottom: config?.mainTitleMarginBottom || 15,
      spacePercentageAndBar: config?.spacePercentageAndBar || 15,

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

      legendScale: config?.legendScale || 0.55,
      tooltipText: config?.tooltipText || '{categoryX}: [bold]{valueY}',
      bulletTooltip: config?.bulletTooltip || '{valueY}',
      showBulletTooltip: config?.showBulletTooltip ?? true,

      xAxisFontSize: getSizeInPx(config?.xAxisFontSize) || '10px',
      xAxisFontWeight: config?.xAxisFontWeight || '600',
      yAxisFontSize: getSizeInPx(config?.yAxisFontSize) || '10px',
      yAxisFontWeight: config?.yAxisFontWeight || 'normal',

      tooltipBgrColor: config?.tooltipBgrColor || am4core.color(themeColors.white),
      tooltipBorderColor: config?.tooltipBorderColor || am4core.color(themeColors.grey),
      tooltipFontColor: config?.tooltipFontColor || am4core.color(themeColors.black),
      tooltipBorderWidth: config?.tooltipBorderWidth || 1,
      tooltipFontSize: getSizeInPx(config?.tooltipFontSize) || '10px',
      xAxisTooltipFontSize: getSizeInPx(config?.xAxisTooltipFontSize) || '10px',
      axixLinesColors: config?.axixLinesColors || themeColors.mediumGray,
      axisLinesWidth: config?.axisLinesWidth || 1,

      bulletFontSize: getSizeInPx(config?.bulletFontSize) || '10px',
      bulletFontWeight: config?.bulletFontWeight || '600',

      axesFontColor: config?.axesFontColor || themeColors.black,
      showBulletAsTotalPercentage: config?.showBulletAsTotalPercentage ?? false,
      bulletTooltipAsTotalPercentage: config?.bulletTooltipAsTotalPercentage || null,

      applyCurrencyFormat: config?.applyCurrencyFormat,
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
            valueFormat: config.applyXAxisFormat?.valueFormat || '0,000',
            displaySize: config.applyXAxisFormat?.displaySize || 'auto',
            valueTypeId: config.applyXAxisFormat?.valueTypeId || valueTypeIds.currency,
          }
        : null,
    };

    am4core.useTheme(am4themes_animated);
    let chart = am4core.create(id, am4charts.XYChart);
    chartState.current = chart;

    configuration.colors.forEach((color) => chart.colors.list.push(am4core.color(color)));

    // number formatting
    const { numberFormat, bigNumberPrefixes } = getNumberFormats({ config: configuration, amchartUse: true });
    // this format is applied to bullet text, wasn't able to set format for that separatelly
    chart.numberFormatter.smallNumberThreshold = 0.000001;
    chart.numberFormatter.numberFormat = numberFormat;
    if (bigNumberPrefixes) {
      chart.numberFormatter.bigNumberPrefixes = bigNumberPrefixes;
    }

    chart.background.fill = am4core.color(configuration.bgColor);
    chart.background.opacity = configuration.bgOpacity;
    chart.data = data.map((obj, index) => {
      return { ...obj, color: configuration.colors[index % configuration.colors.length] };
    });
    chart.data.colors = configuration.colors;

    if (configuration.showTitle) {
      const title = chart.titles.create();
      title.text = configuration.mainTitle;
      title.fontSize = configuration.mainTitleFontSize;
      title.marginBottom = configuration.mainTitleMarginBottom;
    }

    if (configuration.showLegend) {
      chart.legend = new am4charts.Legend();
      chart.legend.position = configuration.legendPosition;
      chart.legend.scale = configuration.legendScale;
    }

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = configuration.categoryText;
    categoryAxis.renderer.grid.template.location = configuration.legendLocation;
    categoryAxis.renderer.minGridDistance = configuration.minGridDistance;
    categoryAxis.renderer.labels.template.fontSize = configuration.xAxisFontSize;
    categoryAxis.renderer.labels.template.fontWeight = configuration.xAxisFontWeight;
    categoryAxis.renderer.labels.template.fill = am4core.color(configuration.axesFontColor);

    categoryAxis.renderer.line.strokeOpacity = 1;
    categoryAxis.renderer.line.strokeWidth = configuration.axisLinesWidth;
    categoryAxis.renderer.line.stroke = am4core.color(configuration.axixLinesColors);

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fill = am4core.color(configuration.axesFontColor);
    valueAxis.renderer.labels.template.fontSize = configuration.yAxisFontSize;
    valueAxis.extraMax = 0.2; //add extra 20% on top so we can see bullets properly
    valueAxis.extraMin = 0.05; //add extra 5% on bottom so we can see bullets properly

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

    if (configuration.valueFields.length === 1) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = configuration.valueFields;
      series.dataFields.categoryX = configuration.labelXAxis;
      series.name = configuration.seriesName;

      series.columns.template.tooltipText = configuration.tooltipText;
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

      series.columns.template.fillOpacity = configuration.opacity;
      series.calculatePercent = true;
      series.columns.template.adapter.add('fill', function (fill, target) {
        return target.dataItem.dataContext['color'];
      });
      series.columns.template.adapter.add('stroke', function (fill, target) {
        return target.dataItem.dataContext['color'];
      });
      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = configuration.lineWidth;
      columnTemplate.strokeOpacity = configuration.lineOpacity;
      if (configuration.showBulletTooltip || configuration.showBulletAsTotalPercentage) {
        let bullet = series.bullets.push(new am4charts.LabelBullet());
        bullet.label.text =
          configuration.showBulletAsTotalPercentage && configuration.bulletTooltipAsTotalPercentage
            ? configuration.bulletTooltipAsTotalPercentage
            : configuration.bulletTooltip;
        bullet.label.fontSize = configuration.tooltipFontSize;
        bullet.label.fontWeight = configuration.bulletFontWeight;

        if (configuration.spacePercentageAndBar) {
          series.columns.template.adapter.add('fill', function (fill, target) {
            if (target.dataItem && target.dataItem.valueY > 0) {
              /**This variable adds space between bar and percentage*/
              bullet.label.dy = -configuration.spacePercentageAndBar;
            } else {
              bullet.label.dy = configuration.spacePercentageAndBar;
            }
            return fill;
          });
        }
      }
    } else {
      configuration.valueFields.forEach((valueField, index) => {
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = valueField;
        series.dataFields.categoryX = configuration.labelXAxis;
        series.name = configuration.legendLabels[index];
        series.columns.template.tooltipText = configuration.tooltipText;
        series.columns.template.fillOpacity = configuration.opacity;

        let columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = configuration.lineWidth;
        columnTemplate.strokeOpacity = configuration.lineOpacity;

        return series;
      });
    }
    return () => {
      chart.dispose();
    };
  }, [config, data, id, colors]);

  return <ColumnChartDiv id={id} width={width} height={height} />;
});

ColumnChart.displayName = 'ColumnChart';

ColumnChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.array,
  config: PropTypes.shape({
    name: PropTypes.string,
    bgColor: PropTypes.string,
    bgOpacity: PropTypes.number,
    colors: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categoryText: PropTypes.string,
    legendLocation: PropTypes.number,
    legendLabels: PropTypes.string,
    labelXAxis: PropTypes.string,
    valueFields: PropTypes.arrayOf(PropTypes.string),
    opacity: PropTypes.number,
    seriesName: PropTypes.string,
    lineWidth: PropTypes.number,
    lineOpacity: PropTypes.number,
    minGridDistance: PropTypes.number,
    spacePercentageAndBar: PropTypes.number,
    showBulletTooltip: PropTypes.bool,
    fontWeightAxis: PropTypes.string,
    bulletText: PropTypes.string,

    valueTypeId: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
    valueFormat: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    valueDecimals: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
    displaySize: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    legendScale: PropTypes.number,
    tooltipText: PropTypes.string,
    bulletTooltip: PropTypes.string,

    xAxisFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    xAxisFontWeight: PropTypes.string,
    yAxisFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    yAxisFontWeight: PropTypes.string,
    tooltipBgrColor: PropTypes.string,
    tooltipBorderColor: PropTypes.string,
    tooltipFontColor: PropTypes.string,
    tooltipBorderWidth: PropTypes.number,
    tooltipFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    xAxisTooltipFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    axixLinesColors: PropTypes.string,
    axisLinesWidth: PropTypes.number,
    bulletFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bulletFontWeight: PropTypes.string,
    axesFontColor: PropTypes.string,
    showBulletAsTotalPercentage: PropTypes.bool,
    bulletTooltipAsTotalPercentage: PropTypes.string,
    applyCurrencyFormat: PropTypes.string,
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

ColumnChart.defaultProps = {
  id: 'chartdiv',
};

export { ColumnChart };
