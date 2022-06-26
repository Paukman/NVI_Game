import React from 'react';
import { PieChart } from '../PieChart';
import { PieChartData } from '../data';

const props = {
  data: PieChartData,
  config: {
    innerRadius: 40,
    showLegend: true,
    showLabels: true,
    showTicks: true,
    showColors: false,
    colorText: 'color',
    valueText: 'value',
    labelText: 'label',
  },
};

describe('PieChart', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    window.SVGPathElement = () => {};
    render(<PieChart id={'chartdiv'} {...props} />);
    expect(document.querySelector('#chartdiv').innerHTML).not.toBeNull();
  });
});
