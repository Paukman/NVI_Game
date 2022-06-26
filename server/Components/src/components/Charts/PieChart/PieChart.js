import React, { memo, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { colors as themeColors } from '../../../theme/colors';
import { StyledDiv } from './styled';
import { valueTypeIds, displaySizes, getNumberFormats, axisValues } from '../../../utils/chartHelpers';
import { getSizeInPx } from '../../../utils/propHelpers';

const PieChart = memo((props) => {
  const { config, data, id } = props;
  const { width = '100%', height = '100%' } = config || {};
  const chartState = useRef(null);

  useLayoutEffect(() => {
    const defaultColors = [
      themeColors.widgetsPlum,
      themeColors.widgetsLightGreen,
      themeColors.salmonRed,
      themeColors.widgetsBlush,
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
      innerRadius: config?.innerRadius,

      legendPosition: config?.legendPosition || 'left',
      legendScale: config?.legendScale || 0.55,
      showLegend: config?.showLegend ?? true,
      showLabels: config?.showLabels ?? true,
      showTicks: config?.showTicks ?? true,
      valueText: config?.valueText || 'value',
      labelText: config?.labelText || 'label',
      labelFontSize: getSizeInPx(config?.labelFontSize) || '10px',
      labelFontWeight: config?.labelFontWeight || 'normal',
      labelColor: config?.labelColor || themeColors.black,
      tooltipText:
        config?.tooltipText || `{category}: {value.percent.formatNumber('#.')}% ({value.value.formatNumber('#.00')})`,
      removeLegendValue: config?.removeLegendValue ?? true,
      removePieLables: config?.removePieLables ?? true,
      seriesLabelsTemplateText: config?.seriesLabelsTemplateText,

      // We send an array for next 4 values, but we use only first value.
      // Eventualy we can split usage of different format eventualy.
      // this is not used here, will leave it for consistency
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

      tooltipBgrColor: config?.tooltipBgrColor || am4core.color(themeColors.white),
      tooltipBorderColor: config?.tooltipBorderColor || am4core.color(themeColors.grey),
      tooltipFontColor: config?.tooltipFontColor || am4core.color(themeColors.black),
      tooltipBorderWidth: config?.tooltipBorderWidth || 1,
      tooltipFontSize: getSizeInPx(config?.tooltipFontSize) || '10px',
      applyTooltipFormat: config.applyTooltipFormat
        ? {
            valueFormat: config.applyTooltipFormat?.valueFormat || '0,000.00',
            displaySize: config.applyTooltipFormat?.displaySize || 'as-is',
            valueTypeId: config.applyTooltipFormat?.valueTypeId || valueTypeIds.currency,
            addNumberFormatting: config.applyTooltipFormat?.addNumberFormatting || 'normal',
          }
        : null,
    };

    am4core.useTheme(am4themes_animated);
    let chart = am4core.create(id, am4charts.PieChart);
    let errorFounds = false;
    if (!Array.isArray(data)) {
      errorFounds = true;
      console.error(`The "PieChart" component with "id=${id}" expected the "data" prop to be an array but got:`, data);
    }

    if (!errorFounds) {
      chart.background.fill = am4core.color(configuration.bgColor);
      chart.background.opacity = configuration.bgOpacity;
      chart.data = data;

      // number formatting we don't need it here, all done via tooltips
      // const { numberFormat, bigNumberPrefixes } = getNumberFormats({ config: configuration, amchartUse: true });
      // chart.numberFormatter.numberFormat = numberFormat;
      // chart.numberFormatter.smallNumberThreshold = 0.000001;
      // if (bigNumberPrefixes) {
      //   chart.numberFormatter.bigNumberPrefixes = bigNumberPrefixes;
      // }

      let series = chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = configuration.valueText;
      series.dataFields.category = configuration.labelText;

      series.labels.template.disabled = !configuration.showLabels;
      series.ticks.template.disabled = !configuration.showTicks;

      series.labels.template.fontSize = configuration.labelFontSize;
      series.labels.template.fontWeight = configuration.labelFontWeight;
      series.labels.template.color = am4core.color(configuration.labelColor);

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

      configuration.colors.forEach((color) => series.colors.list.push(am4core.color(color)));
      /**
       * This is template format in https://www.amcharts.com/docs/v4/concepts/formatters/formatting-strings/
       * An example of template format is "{value.percent.formatNumber('#.#')}%"
       */
      if (configuration.removePieLables) {
        series.labels.template.text = configuration.seriesLabelsTemplateText;
      }

      if (configuration.showLegend) {
        chart.legend = new am4charts.Legend();
        chart.legend.position = configuration.legendPosition;
        chart.legend.scale = configuration.legendScale;
        chart.legend.valueLabels.template.disabled = configuration.removeLegendValue;
      }

      chart.innerRadius = configuration.innerRadius > 0 ? configuration.innerRadius : 0;
      chartState.current = chart;
    }
    return () => {
      chart.dispose();
    };
  }, [config, data, id]);

  return <StyledDiv id={id} width={width} height={height}></StyledDiv>;
});

PieChart.displayName = 'PieChart';

PieChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.array,
  config: PropTypes.shape({
    bgColor: PropTypes.string,
    bgOpacity: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    innerRadius: PropTypes.number,
    legendPosition: PropTypes.string,
    legendScale: PropTypes.number,
    showLegend: PropTypes.bool,
    showLabels: PropTypes.bool,
    showTicks: PropTypes.bool,

    valueText: PropTypes.string.isRequired,
    labelText: PropTypes.string.isRequired,
    labelFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    labelFontWeight: PropTypes.string,
    labelColor: PropTypes.string,
    tooltipText: PropTypes.string,
    removeLegendValue: PropTypes.bool,
    removePieLables: PropTypes.bool,
    seriesLabelsTemplateText: PropTypes.string,

    valueTypeId: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
    valueFormat: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    valueDecimals: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
    displaySize: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),

    tooltipBgrColor: PropTypes.string,
    tooltipBorderColor: PropTypes.string,
    tooltipFontColor: PropTypes.string,
    tooltipBorderWidth: PropTypes.number,
    tooltipFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    applyTooltipFormat: PropTypes.shape({
      valueFormat: PropTypes.string,
      displaySize: PropTypes.string,
      valueTypeId: PropTypes.number,
      addNumberFormatting: PropTypes.string,
    }),
  }),
};

PieChart.defaultProps = {};

export { PieChart };
