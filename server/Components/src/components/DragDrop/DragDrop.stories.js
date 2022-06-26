import React from 'react';
import { DragDrop } from './DragDrop';
import { ColumnChart } from '../Charts/ColumnChart';
import { chartData } from '../Charts/ColumnChart/data';
import { colors } from '../../theme/colors';
import { ChartCard } from '../ChartCard';
import { range } from 'lodash';
import { StyledOuterWrapper } from './styled';

const config = {
  bgColor: colors.white,
  bgOpacity: 0.5,
  colors: ['#C6D250', '#67B7DC', '#B64172'],
  fontSizeAxis: 12,
  fontColorAxis: colors.black,
  fontWeightAxis: 'bold',
  width: '100%',
  heigth: '100%',
  categoryText: 'label',
  legendLocation: 0,
  labelXAxis: 'label',
  opacity: 0.8,
  seriesName: 'Items',
  tooltipText: '{categoryX}: [bold]{valueY}[/]',
  lineWidth: 2,
  lineOpacity: 1,
  minGridDistance: 30,
  showLegend: false,
  showTitle: true,
  useBullet: true,
  spacePercentageAndBar: 15,
  bulletText: "[bold]{valueY.percent.formatNumber('#.')}%",
  valueFields: ['value'],
  mainTitle: 'Main Title',
  mainTitleFontSize: 12,
};

/**
 * { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 } are units and widths for items.
 * for lg breakpoint, max width is 11.8, countOfColumns is 1, and ideal height is 3
 * ideal view is width is 5.9, countOfColumns is 2, and ideal height is 3
 * ideal height is 3
 * !!!Scale for width!!!
 * 1. width is 11.8, countOfColumns is 1,
 * 2. width is 5.9, countOfColumns is 2,
 * 3. width is 3.9, countOfColumns is 3,
 * 3. width is 2.9, countOfColumns is 4,
 * 4. width is 2.3, countOfColumns is 5,
 * 5. width is 1.9, countOfColumns is 6,
 * */
const itemParts = range(0, 3).map((item, index) => ({
  wrapper: ChartCard,
  width: 3.3,
  height: 2,
  minHeight: 2,
  maxHeight: 4,
  component: <ColumnChart id={`chartdiv${index}`} data={chartData} config={config} />,
}));

const items = [
  ...itemParts,
  {
    wrapper: 'div',
    width: 3.9,
    height: 2,
    component: <ColumnChart id={`chartdiv${itemParts.length}`} data={chartData} config={config} />,
  },
];

export const DragDropComponent = (args) => {
  return <DragDrop {...args} outerWrapper={StyledOuterWrapper} items={items} />;
};

export default {
  title: 'Components/DragDrop',
  component: DragDrop,
  argTypes: {
    countOfColumns: {
      control: {
        type: 'number',
      },
      defaultValue: 3,
    },
    hasCompaction: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    hasStaticCheckBox: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isDraggable: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
};
