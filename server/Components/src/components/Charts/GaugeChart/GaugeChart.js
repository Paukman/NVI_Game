import React, { memo, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { colors } from '../../../theme/colors';
import { StyledDiv } from './styled';

const GaugeChart = memo((props) => {
  const { id, config } = props;
  const { width, height } = config || {};
  const chartState = useRef(null);
  useLayoutEffect(() => {
    const {
      bgColor,
      bgOpacity,
      axisMin,
      axisMax,
      axisStrictMinMax,
      innerRadius,
      ranges,
      handValue,
      handPinRadius,
      handPinZIndex,
      handFill,
      handStroke,
      handStartWidth,
    } = config || {};

    am4core.useTheme(am4themes_animated);

    let chart = am4core.create(id, am4charts.GaugeChart);
    chartState.current = chart;

    let axis = chart.xAxes.push(new am4charts.ValueAxis());
    axis.min = axisMin;
    axis.max = axisMax;
    axis.strictMinMax = axisStrictMinMax;

    chart.innerRadius = innerRadius;

    const ranges2use = ranges;
    if (!Array.isArray(ranges) || ranges.length === 0) {
      console.error(`The 'GaugeChart' expects 'ranges' prop to be an array with at lease one element but got `, ranges);
      ranges2use = [];
    }

    chart.background.fill = am4core.color(bgColor);
    chart.background.opacity = bgOpacity;

    ranges2use.forEach((range) => {
      const amRange = axis.axisRanges.create();
      amRange.value = range.value;
      amRange.endValue = range.endValue;
      amRange.axisFill.fillOpacity = range.axisFillOpacity;
      amRange.axisFill.fill = range.axisFillColor;
      amRange.axisFill.zIndex = range.axisFillZIndex;
    });

    let hands = chart.hands.push(new am4charts.ClockHand());
    hands.value = handValue;
    hands.pin.radius = handPinRadius;
    hands.pin.zIndex = handPinZIndex;
    hands.fill = handFill;
    hands.stroke = handStroke;
    hands.startWidth = handStartWidth;

    return () => {
      chart.dispose();
    };
  }, [config, id]);

  return <StyledDiv id={id} width={width} height={height} />;
});

GaugeChart.displayName = 'GaugeChart';

GaugeChart.propTypes = {
  id: PropTypes.string,
  config: PropTypes.shape({
    bgColor: PropTypes.string,
    bgOpacity: PropTypes.number,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    axisMin: PropTypes.number,
    axisMax: PropTypes.number,
    axisStrictMinMax: PropTypes.bool,
    innerRadius: PropTypes.number,
    ranges: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.number,
        endValue: PropTypes.number,
        axisFillOpacity: PropTypes.number,
        axisFillColor: PropTypes.string,
        axisFillZIndex: PropTypes.number,
      }),
    ),
    handValue: PropTypes.number,
    handPinRadius: PropTypes.number,
    handPinZIndex: PropTypes.number,
    handFill: PropTypes.string,
    handStroke: PropTypes.string,
    handStartWidth: PropTypes.number,
  }),
};

GaugeChart.defaultProps = {
  config: {
    bgColor: colors.white,
    bgOpacity: 0.5,
    width: '100%',
    heigth: '100%',
    axisMin: 0,
    axisMax: 100,
    axisStrictMinMax: true,
    innerRadius: -20,
    ranges: [
      {
        value: 0,
        endValue: 70,
        axisFillOpacity: 1,
        axisFill: colors.lightOrange,
        axisFillZIndex: -1,
      },
      {
        value: 70,
        endValue: 90,
        axisFillOpacity: 1,
        axisFill: colors.green,
        axisFillZIndex: -1,
      },
      {
        value: 90,
        endValue: 100,
        axisFillOpacity: 1,
        axisFill: colors.red,
        axisFillZIndex: -1,
      },
    ],
    handValue: 30,
    handPinRadius: 15,
    handPinZIndex: 1,
    handFill: colors.grey,
    handStroke: colors.grey,
    handStartWidth: 15,
  },
};

export { GaugeChart };
