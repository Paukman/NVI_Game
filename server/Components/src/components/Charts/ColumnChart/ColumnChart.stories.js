import React from 'react';
import { ColumnChart } from './ColumnChart';
import styled from 'styled-components';
import { colors as themeColors } from '../../../theme/colors';
import { chartData, chartMultiData, dynamicData } from './data';

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

const colorsValue = [themeColors.widgetsLightGreen, '#67B7DC', '#B64172'];

export const SingleColumn = (args) => {
  return (
    <Container>
      <ColumnChart data={dynamicData(args.multiplyInputDataBy)} config={{ ...args, valueFields: ['value'] }} />
    </Container>
  );
};
export const MultipleColumns = (args) => {
  return (
    <Container>
      <ColumnChart data={chartMultiData} config={{ ...args, valueFields: ['value1', 'value2', 'value3'] }} />
    </Container>
  );
};

export default {
  component: ColumnChart,
  title: 'Components/Charts/ColumnChart',
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
      defaultValue: 2,
    },
    valueFormat: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    showBulletTooltip: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
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
    xAxisFontWeight: {
      control: {
        type: 'text',
      },
      defaultValue: 'normal',
    },
    yAxisFontSize: {
      control: {
        type: 'number',
      },
      defaultValue: 10,
    },
    yAxisFontWeight: {
      control: {
        type: 'text',
      },
      defaultValue: 'normal',
    },

    multiplyInputDataBy: {
      control: {
        type: 'number',
      },
      defaultValue: 10000,
    },

    bgColor: {
      control: {
        type: 'color',
      },
      defaultValue: themeColors.white,
    },
    bgOpacity: {
      control: {
        type: 'number',
      },
      defaultValue: 0.5,
    },
    colors: {
      control: {
        type: 'array',
      },
      defaultValue: [...colorsValue],
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
    categoryText: {
      control: {
        type: 'text',
      },
      defaultValue: 'label',
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
      defaultValue: 'label',
    },
    opacity: {
      control: {
        type: 'number',
      },
      defaultValue: 0.8,
    },
    seriesName: {
      control: {
        type: 'text',
      },
      defaultValue: 'Items',
    },
    tooltipText: {
      control: {
        type: 'text',
      },
      defaultValue: '{categoryX}: [bold]{valueY}',
    },
    bulletTooltip: {
      control: {
        type: 'text',
      },
      defaultValue: '{valueY}',
    },
    lineWidth: {
      control: {
        type: 'number',
      },
      defaultValue: 2,
    },
    lineOpacity: {
      control: {
        type: 'number',
      },
      defaultValue: 1,
    },
    showLegend: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    minGridDistance: {
      control: {
        type: 'number',
      },
      defaultValue: 30,
    },
    legendPosition: {
      control: {
        type: 'text',
      },
      defaultValue: 'right',
    },
    showTitle: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    mainTitle: {
      control: {
        type: 'text',
      },
      defaultValue: 'Main Title',
    },
    mainTitleFontSize: {
      control: {
        type: 'number',
      },
      defaultValue: '',
    },
    mainTitleMarginBottom: {
      control: {
        type: 'number',
      },
      defaultValue: '',
    },
    fontSizeAxis: {
      control: {
        type: 'number',
      },
      defaultValue: 20,
    },
    fontColorAxis: {
      control: {
        type: 'text',
      },
      defaultValue: 'blue',
    },
    bulletFontWeight: {
      control: {
        type: 'text',
      },
      defaultValue: 'normal',
    },
    legendLabels: {
      control: {
        type: 'array',
      },
      defaultValue: ['Actual', 'Budget', 'Forecast'],
    },
    spacePercentageAndBar: {
      control: {
        type: 'number',
      },
      defaultValue: 15,
    },
    showBulletAsTotalPercentage: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    bulletTooltipAsTotalPercentage: {
      control: {
        type: 'text',
      },
      defaultValue: "[bold]{valueY.percent.formatNumber('#.')}%",
    },
  },
};
