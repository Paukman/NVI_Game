import React from 'react';
import LineColumnChart from '../LineColumnChart';
import { colors } from '../../../../theme/colors';
import { singleData } from '../data';

let props = {
  data: singleData,
  config: {
    bgColor: colors.white,
    bgOpacity: 0.5,
    showScrollbar: true,
    showCursor: true,
    showTooltip: true,
    tooltipText: '{valueY.value}',
    showYAxisTooltip: true,
    showLegend: false,
    labelXAxis: 'Dates',
    labelYAxis: 'value',
    tensionX: 0.8,
    strokeWidth: 3,
  },
};

describe('LineColumnChart', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    window.SVGPathElement = () => {};
    render(<LineColumnChart id={'chartdiv'} {...props} />);
    expect(document.querySelector('#chartdiv').innerHTML).not.toBeNull();
  });
});
