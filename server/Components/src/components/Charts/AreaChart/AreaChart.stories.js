import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../theme/colors';
import { AreaChart } from './AreaChart';
import { singleData } from './data';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 500px;
`;

const applyTooltipFormat = {
  valueFormat: '0,000.00',
  displaySize: 'as-is',
  valueTypeId: 2,
  addNumberFormatting: 'bold',
};
const applyXAxisFormat = { valueFormat: '0', displaySize: 'auto', valueTypeId: 2 };

const data = (sampleSize, multiplyBy) => {
  let dataArrays = [];
  for (let i = 0; i < 2; i++) {
    const inputData = singleData(sampleSize, multiplyBy);
    dataArrays.push(inputData);
  }
  return dataArrays;
};

export const AreaChartComponent = (args) => {
  const props = {
    data: data(args.dataSampleSize, args.multiplyInputDataBy),
    config: {
      ...args,
    },
  };

  return (
    <Container>
      <AreaChart {...props} />
    </Container>
  );
};

export default {
  title: 'Components/Charts/AreaChart',
  component: AreaChart,
  argTypes: {
    applyTooltipFormat: {
      control: {
        type: 'object',
      },
      defaultValue: applyTooltipFormat,
    },
    applyXAxisFormat: {
      control: {
        type: 'object',
      },
      defaultValue: applyXAxisFormat,
    },
    tooltipBgrColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.white,
    },
    tooltipBorderColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.grey,
    },
    tooltipFontColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.black,
    },
    tooltipBorderWidth: {
      control: {
        type: 'number',
      },
      defaultValue: 1,
    },
    tooltipFontSize: {
      control: {
        type: 'number',
      },
      defaultValue: 10,
    },
    xAxisTooltipFontSize: {
      control: {
        type: 'number',
      },
      defaultValue: 10,
    },

    xAxisFontSize: {
      control: {
        type: 'number',
      },
      defaultValue: 10,
    },
    yAxisFontSize: {
      control: {
        type: 'number',
      },
      defaultValue: 10,
    },
    noOfGridCellsAprox: {
      control: {
        type: 'range',
        min: 3,
        max: 10,
        step: 1,
      },
      defaultValue: 6,
    },

    multiplyInputDataBy: {
      control: {
        type: 'number',
      },
      defaultValue: 1,
    },
    applyCurrencyFormat: {
      control: {
        type: 'text',
      },
      defaultValue: '0,000.00',
    },
    dataSampleSize: {
      control: {
        type: 'range',
        min: 1,
        max: 90,
        step: 1,
      },
      defaultValue: 7,
    },
    bgColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.white,
    },
    colors: {
      control: {
        type: 'array',
      },
      defaultValue: ['#67B7DC', '#C6D250', colors.red, colors.orange],
    },
    bgOpacity: {
      control: {
        type: 'number',
      },
      defaultValue: 0.5,
    },
    width: {
      control: {
        type: 'text',
      },
      defaultValue: '380',
    },
    height: {
      control: {
        type: 'text',
      },
      defaultValue: '220',
    },
    sampleField: {
      control: {
        type: 'text',
      },
      defaultValue: 'date',
    },
    showTooltip: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    tooltipText: {
      control: {
        type: 'text',
      },
      defaultValue: '{valueY.value}',
    },
    showScrollbar: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    scrollbarScale: {
      control: {
        type: 'number',
      },
      defaultValue: 1,
    },
    showCursor: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    showLegend: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    labelXAxis: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    labelYAxis: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    scrollbarScale: {
      control: {
        type: 'number',
      },
      defaultValue: 0.75,
    },
    legendLabels: {
      control: {
        type: 'array',
      },
      defaultValue: ['Actual', 'Budget', 'Future', 'Present'],
    },
    legendPosition: {
      control: {
        type: 'select',
        options: ['top', 'bottom', 'right', 'left'],
      },
      defaultValue: 'bottom',
    },
    legendScale: {
      control: {
        type: 'number',
      },
      defaultValue: 0.55,
    },
    showYAxisTooltip: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    valueTypeId: {
      control: {
        type: 'array',
      },
      defaultValue: [2, 2],
    },
    valueFormat: {
      control: {
        type: 'array',
      },
      defaultValue: ['0.00', '0.00'],
    },
    valueDecimals: {
      control: {
        type: 'array',
      },
      defaultValue: [1, 2],
    },
    displaySize: {
      control: {
        type: 'array',
      },
      defaultValue: ['as-is', 'auto'],
    },
  },
};
