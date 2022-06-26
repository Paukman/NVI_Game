import React from 'react';
import { AreaChart } from '../AreaChart';
import { colors } from '../../../../theme/colors';

let data = [];
let visits = 10;

for (let i = 1; i < 366; i++) {
  visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
  data.push({ date: new Date(2018, 0, i), name: 'name' + i, value: visits });
}

const props = {
  data: data,
  config: {
    fieldDateX: 'date',
    inputDateFormat: 'yyyy',
    fieldValue: ['value', 'count', 'count1', 'count2'],
    minGridDistance: 60,
    startLocation: 0.5,
    endLocation: 0.5,
    tooltip: {
      backgroundColor: '#FFF',
      backgroundStrokeWidth: 3,
      getStrokeFromObject: true,
      getFillFromObject: false,
    },
    stroke: {
      fillOpacity: 1,
      strokeWidth: 2,
      stacked: true,
    },
    startDateRange: new Date(2001, 0, 1),
    endDateRange: new Date(2003, 0, 1),
    startDateRange2: new Date(2007, 0, 1),
    legendPosition: 'top',
  },
};
describe('AreaChart', () => {
  beforeEach(() => {
    cleanup();
  });
  it('render content not to be null', async () => {
    window.SVGPathElement = () => {};
    render(<AreaChart {...props} />);
    expect(document.querySelector('#chartdiv').innerHTML).not.toBeNull();
  });
});
