import React from 'react';
import { ColumnChart } from '../ColumnChart';
import { colors } from '../../../../theme/colors';
import { chartData } from '../data';

const props = {
  data: chartData,
  config: {
    bgColor: colors.white,
    bgOpacity: 0.5,
    colors: [colors.red, colors.blue, colors.orange],
    width: '100%',
    heigth: '100%',
    categoryText: 'label',
    legendLocation: 0,
    labelXAxis: 'label',
    valueFields: ['value'],
    opacity: 0.8,
    seriesName: 'Items',
    lineWidth: 2,
    lineOpacity: 1,
    minGridDistance: 30,
    showLegend: true,
  },
};

describe('ColumnChart', () => {
  beforeEach(() => {
    cleanup();
  });

  it('render content not to be null', async () => {
    window.SVGPathElement = () => {};
    render(<ColumnChart {...props} />);
    expect(document.querySelector('#chartdiv').innerHTML).not.toBeNull();
  });
});
