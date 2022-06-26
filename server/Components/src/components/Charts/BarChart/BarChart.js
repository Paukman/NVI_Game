import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import PropTypes from 'prop-types';
import React, { memo, useLayoutEffect, useRef } from 'react';
import { colors } from '../../../theme/colors';
import { BarChartDiv } from './styled';

const BarChart = memo((props) => {
  const { data, id, config } = props;
  const { width, height } = config || {};

  const chartState = useRef(null);

  useLayoutEffect(() => {
    const {
      bgColor,
      bgOpacity,
      colors,
      categoryText,
      legendLocation,
      valueFields,
      valuesLabels,
      tooltipText,
      numberFormat,
      inversed,
      cellStartLocation,
      cellEndLocation,
      labelDistance,
      categoryLabelText,
      categoryLabelDirection,
      valueLabelDirection,
      valueLabelText,
      valueLabelHideOversized,
      valueLabelTruncate,
      categoryLabelHideOversized,
      categoryLabelTruncate,
      labelColor,
      topRadius,
      bottomRadius,
      xandyAxiscolors,
    } = config || {};

    am4core.useTheme(am4themes_animated);

    let chart = am4core.create(id, am4charts.XYChart);

    chartState.current = chart;

    if (Array.isArray(colors)) {
      colors.forEach((color) => chart.colors.list.push(am4core.color(color)));
    } else if (colors) {
      chart.colors.list.push(am4core.color(colors));
    }

    chart.background.fill = am4core.color(bgColor);
    chart.background.opacity = bgOpacity;

    chart.data = data;

    if (!Array.isArray(data)) {
      chart.data = [];
      console.error(`The "BarChart" component with "id=${id}" expected the "data" prop to be an array but got:`, data);
    }

    let valueFields2Use = valueFields;
    if (!Array.isArray(valueFields)) {
      console.error(
        `The "BarChart" component with "id=${id}" expected the "valueFields" prop to be an array but got:`,
        valueFields,
      );
      valueFields2Use = [];
    }

    let valuesLabels2Use = valuesLabels;
    if (!Array.isArray(valuesLabels2Use)) {
      console.error(
        `The "BarChart" component with "id=${id}" expected the "valuesLabels" prop to be an array but got:`,
        valuesLabels2Use,
      );
      valuesLabels2Use = valueFields2Use;
    } else if (valuesLabels2Use.length < valueFields2Use.length) {
      console.error(
        `The "BarChart" component with "id=${id}" expected the "valuesLabels" prop to be exact same length as "valueFields" but it is ${valuesLabels2Use.length} vs expected ${valueFields2Use.length}`,
      );
      valuesLabels2Use = valueFields2Use;
    }

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.labels.template.fill = am4core.color(xandyAxiscolors);

    categoryAxis.dataFields.category = categoryText;
    categoryAxis.numberFormatter.numberFormat = numberFormat;
    categoryAxis.renderer.inversed = inversed;
    categoryAxis.renderer.grid.template.location = legendLocation;
    categoryAxis.renderer.cellStartLocation = cellStartLocation;
    categoryAxis.renderer.cellEndLocation = cellEndLocation;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;
    valueAxis.renderer.labels.template.fill = am4core.color(xandyAxiscolors);

    valueFields2Use.forEach((valueField, idx) => {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = valueField;
      series.dataFields.categoryY = categoryText;
      series.name = valuesLabels2Use[idx]; // We may not need this
      series.columns.template.tooltipText = tooltipText;
      series.columns.template.column.cornerRadiusTopRight = topRadius;
      series.columns.template.column.cornerRadiusBottomRight = bottomRadius;
      series.columns.template.column.cornerRadiusTopLeft = topRadius;
      series.columns.template.column.cornerRadiusBottomLeft = bottomRadius;

      let valueLabel = series.bullets.push(new am4charts.LabelBullet());
      valueLabel.label.text = valueLabelText;
      valueLabel.label.horizontalCenter = valueLabelDirection;
      valueLabel.label.dx = labelDistance * -1;
      valueLabel.label.hideOversized = valueLabelHideOversized;
      valueLabel.label.truncate = valueLabelTruncate;

      let categoryLabel = series.bullets.push(new am4charts.LabelBullet());
      categoryLabel.label.text = categoryLabelText;
      categoryLabel.label.horizontalCenter = categoryLabelDirection;
      categoryLabel.label.dx = labelDistance;
      categoryLabel.label.fill = am4core.color(labelColor);
      categoryLabel.label.hideOversized = categoryLabelHideOversized;
      categoryLabel.label.truncate = categoryLabelTruncate;
    });

    return () => {
      chart.dispose();
    };
  }, [config, data, id]);

  return <BarChartDiv id={id} width={width} height={height} />;
});

BarChart.numberFormats = ['#', '00.00', '#.', '#,###', '#.##e', '#.0a', '#.0b', '#.0s', '#,###|(#,###s)|" - "'];

BarChart.displayName = 'BarChart';

BarChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.array,
  config: PropTypes.shape({
    bgColor: PropTypes.string,
    bgOpacity: PropTypes.number,
    colors: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categoryText: PropTypes.string,
    legendLocation: PropTypes.number,
    //labelXAxis: PropTypes.string,
    valueFields: PropTypes.arrayOf(PropTypes.string),
    valuesLabels: PropTypes.arrayOf(PropTypes.string),
    tooltipText: PropTypes.string,
    numberFormat: PropTypes.string,
    inversed: PropTypes.bool,
    cellStartLocation: PropTypes.number,
    cellEndLocation: PropTypes.number,
    labelDistance: PropTypes.number,
    categoryLabelText: PropTypes.string,
    categoryLabelDirection: PropTypes.string,
    valueLabelDirection: PropTypes.string,
    valueLabelText: PropTypes.string,
    valueLabelHideOversized: PropTypes.bool,
    valueLabelTruncate: PropTypes.bool,
    categoryLabelHideOversized: PropTypes.bool,
    categoryLabelTruncate: PropTypes.bool,
    sequencedInterpolation: PropTypes.bool,
    //valueAxisOpposite: PropTypes.bool,
    labelColor: PropTypes.string,
    topRadius: PropTypes.number,
    bottomRadius: PropTypes.number,
    xandyAxiscolors: PropTypes.string,
  }),
};

BarChart.defaultProps = {
  config: {
    bgColor: colors.white,
    bgOpacity: 0.5,
    colors: colors.blue,
    width: '100%',
    heigth: '100%',
    categoryText: 'label',
    legendLocation: 0,
    valueFields: ['value'],
    valuesLabels: ['Value Label'],
    numberFormat: '#',
    inversed: true,
    cellStartLocation: 0.1,
    cellEndLocation: 0.9,
    labelDistance: -10,
    categoryLabelText: '{name}',
    categoryLabelDirection: 'right',
    valueLabelDirection: 'left',
    valueLabelText: '{valueX}',
    valueLabelHideOversized: false,
    valueLabelTruncate: false,
    categoryLabelHideOversized: false,
    categoryLabelTruncate: false,
    sequencedInterpolation: false,
    labelColor: colors.white,
    topRadius: 3,
    bottomRadius: 3,
    xandyAxiscolors: colors.mediumGray,
  },
};

export { BarChart };
