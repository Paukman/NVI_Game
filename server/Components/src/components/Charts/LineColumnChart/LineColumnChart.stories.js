import React from 'react';
import styled from 'styled-components';
import LineColumnChart from './LineColumnChart';
import { colors as themeColors } from '../../../theme/colors';
import { singleData, singlePartialData, singleIncompleteData } from './data';
import { dataTypeId } from './utils';

const dataType = {
  column: 'COLUMN',
  line: 'LINE',
  sample: 'SAMPLE',
};

const applyTooltipFormat = {
  valueFormat: '0,000.00',
  displaySize: 'as-is',
  valueTypeId: 2,
  addNumberFormatting: 'bold',
};
const applyXAxisFormat = { valueFormat: '0', displaySize: 'auto', valueTypeId: 2 };

const inputData = (
  dataSampleSize,
  lines,
  columns,
  partialLineData,
  partialColumnData,
  multiplyBy,
  onlyPositiveValues,
) => {
  const inputData = [];
  for (let i = 0; i < lines; i++) {
    if (partialLineData === 'partial') {
      inputData.push(singlePartialData(dataSampleSize, multiplyBy, onlyPositiveValues ? 1 : -1));
    } else if (partialLineData === 'full') {
      inputData.push(singleData(dataSampleSize, multiplyBy, onlyPositiveValues ? 1 : -1));
    } else if (partialLineData === 'incomplete') {
      inputData.push(singleIncompleteData(dataSampleSize, multiplyBy, onlyPositiveValues ? 1 : -1));
    } else {
      inputData.push([]);
    }
  }
  for (let i = 0; i < columns; i++) {
    if (partialColumnData === 'partial') {
      inputData.push(singlePartialData(dataSampleSize, multiplyBy, onlyPositiveValues ? 1 : -1));
    } else if (partialColumnData === 'full') {
      inputData.push(singleData(dataSampleSize, multiplyBy, onlyPositiveValues ? 1 : -1));
    } else if (partialColumnData === 'incomplete') {
      inputData.push(singleIncompleteData(dataSampleSize, multiplyBy, onlyPositiveValues ? 1 : -1));
    } else {
      inputData.push([]);
    }
  }
  return inputData;
};

const inputTypes = (linesNo, columnsNo) => {
  return [...Array(linesNo).fill(dataTypeId.line), ...Array(columnsNo).fill(dataTypeId.column)];
};

const Container = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 500px;
`;

const colorsValue = [themeColors.lightBlue, themeColors.orange, themeColors.plum];

export const LineColumnChartComponent = (args) => {
  const props = {
    data: inputData(
      args.dataSampleSize,
      args.lines,
      args.columns,
      args.lineData,
      args.columnData,
      args.multiplyInputDataBy,
      args.onlyPositiveValues,
    ),
    config: { ...args, dataTypes: inputTypes(args.lines, args.columns) },
  };

  return (
    <Container>
      <LineColumnChart id={'chartdiv'} {...props} />
    </Container>
  );
};
export default {
  title: 'Components/Charts/LineColumnChart',
  component: LineColumnChart,
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

    onlyPositiveValues: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    axixLinesColors: {
      control: {
        type: 'color',
      },
      defaultValue: themeColors.mediumGray,
    },
    axisLinesWidth: {
      control: {
        type: 'number',
      },
      defaultValue: 1,
    },
    tooltipBgrColor: {
      control: {
        type: 'color',
      },
      defaultValue: themeColors.white,
    },
    tooltipBorderColor: {
      control: {
        type: 'color',
      },
      defaultValue: themeColors.grey,
    },
    tooltipFontColor: {
      control: {
        type: 'color',
      },
      defaultValue: themeColors.black,
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
      defaultValue: 4,
    },
    multiplyInputDataBy: {
      control: {
        type: 'number',
      },
      defaultValue: 100,
    },
    applyCurrencyFormat: {
      control: {
        type: 'text',
      },
      defaultValue: '0,000.00',
    },
    displaySize: {
      control: {
        type: 'select',
        options: ['as-is', 'auto', 'k', 'm'],
      },
      defaultValue: 'auto',
    },
    valueDecimals: {
      control: {
        type: 'range',
        min: 0,
        max: 4,
        step: 1,
      },
      defaultValue: 2,
    },
    valueTypeId: {
      control: {
        type: 'select',
        options: [1, 2, 3],
      },
      defaultValue: 1,
    },
    valueFormat: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    legendScale: {
      control: {
        type: 'range',
        min: 0.5,
        max: 2,
        step: 0.05,
      },
      defaultValue: 0.65,
    },
    twoColumnsFullWidth: {
      control: {
        type: 'number',
      },
      defaultValue: 50,
    },
    twoColumnsPartialWidth: {
      control: {
        type: 'number',
      },
      defaultValue: 30,
    },
    lineData: {
      control: {
        type: 'select',
        options: ['full', 'partial', 'none', 'incomplete'],
      },
      defaultValue: 'full',
    },
    columnData: {
      control: {
        type: 'select',
        options: ['full', 'partial', 'none', 'incomplete'],
      },
      defaultValue: 'full',
    },

    bgColor: {
      control: {
        type: 'color',
      },
      defaultValue: themeColors.white,
    },
    colors: {
      control: {
        type: 'array',
      },
      defaultValue: [...colorsValue],
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
      defaultValue: '780',
    },
    height: {
      control: {
        type: 'text',
      },
      defaultValue: '420',
    },
    showScrollbar: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    showCursor: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
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
      defaultValue: '{name}: {valueY.value}',
    },
    showYAxisTooltip: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    showLegend: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    legendLocation: {
      control: {
        type: 'number',
      },
      defaultValue: 0,
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
    dataSampleSize: {
      control: {
        type: 'range',
        min: 1,
        max: 90,
        step: 1,
      },
      defaultValue: 7,
    },
    dataPointsQty: {
      control: {
        type: 'number',
        min: 1,
        max: 90,
        step: 1,
      },
      defaultValue: 7,
    },

    columns: {
      control: {
        type: 'number',
        min: 0,
        max: 10,
        step: 1,
      },
      defaultValue: 2,
    },
    lines: {
      control: {
        type: 'number',
        min: 0,
        max: 10,
        step: 1,
      },
      defaultValue: 1,
    },
    tensionX: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.1,
      },
      defaultValue: 0.8,
    },
    strokeWidth: {
      control: {
        type: 'number',
      },
      defaultValue: 3,
    },

    legendLabels: {
      control: {
        type: 'array',
      },
      defaultValue: ['Actual', 'Budget', 'Forecast'],
    },
    legendPosition: {
      control: {
        type: 'select',
        options: ['top', 'bottom', 'right', 'left'],
      },
      defaultValue: 'bottom',
    },
    sampleField: {
      control: {
        type: 'text',
      },
      defaultValue: 'date',
    },
  },
};
