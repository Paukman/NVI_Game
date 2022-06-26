import React from 'react';
import { BarChart } from '../BarChart';
import { colors } from '../../../../theme/colors';
import { SingleColumnData, MultipleColumnData } from '../data';

const props = {
  data: SingleColumnData,
  config: {
    bgColor: colors.white,
    bgOpacity: 0.5,
    colors: colors.red,
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
    labelColor: colors.white,
  },
};

describe('BarGraph', () => {
  afterAll(() => {
    cleanup();
  });

  it('render content not to be null', async () => {
    window.SVGPathElement = () => {};
    render(<BarChart id={'chartdiv0'} {...props} />);
    expect(document.querySelector('#chartdiv0').innerHTML).not.toBeNull();
  });
});
