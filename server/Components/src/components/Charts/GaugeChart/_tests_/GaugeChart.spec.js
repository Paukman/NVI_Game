import React from 'react';
import { GaugeChart } from '../GaugeChart';
import { colors } from '../../../../theme/colors';

const props = {
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

describe('GaugeChart', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    window.SVGPathElement = () => {};
    render(<GaugeChart id={'chartdiv'} {...props} />);
    expect(document.querySelector('#chartdiv').innerHTML).not.toBeNull();
  });
});
