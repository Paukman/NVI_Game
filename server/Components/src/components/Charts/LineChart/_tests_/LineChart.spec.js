import React from 'react';
import LineChart from '../LineChart';
import { colors } from '../../../../theme/colors';
import { SingleLineData } from '../data';

let props = {
  data: SingleLineData,
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
    labelsYAxis: ['value'],
    tensionX: 0.8,
    strokeWidth: 3,
  },
};

describe('LineChart', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    window.SVGPathElement = () => {};
    render(<LineChart id={'chartdiv'} {...props} />);
    expect(document.querySelector('#chartdiv').innerHTML).not.toBeNull();
  });
});
