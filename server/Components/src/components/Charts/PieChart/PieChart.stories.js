import React from 'react';
import styled from 'styled-components';
import { PieChart } from './PieChart';
import { PieChartData, RealTimeData } from './data';
import { colors as themeColors } from '../../../theme/colors';

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

const colorValues = ['#67B7DC', '#C6D250', '#67B7DC', '#C6D250', '#67B7DC', '#C6D250'];

export const PieChartComponent = (args) => {
  const props = {
    data: RealTimeData,
    config: { ...args },
  };

  return (
    <Container>
      <PieChart id={'chartdiv'} {...props} />
    </Container>
  );
};

export default {
  title: 'Components/Charts/PieChart',
  component: PieChart,
  argTypes: {
    applyTooltipFormat: {
      control: {
        type: 'object',
      },
      defaultValue: applyTooltipFormat,
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
      defaultValue: [...colorValues],
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
    innerRadius: {
      control: {
        type: 'number',
      },
      defaultValue: 0,
    },
    legendPosition: {
      control: {
        type: 'text',
      },
      defaultValue: 'left',
    },
    legendScale: {
      control: {
        type: 'range',
        min: 0.5,
        max: 2,
        step: 0.05,
      },
      defaultValue: 0.55,
    },
    showLegend: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    showLabels: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    showTicks: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    valueText: {
      control: {
        type: 'text',
      },
      defaultValue: 'value',
    },
    labelText: {
      control: {
        type: 'text',
      },
      defaultValue: 'label',
    },
    labelFontSize: {
      control: {
        type: 'number',
      },
      defaultValue: 10,
    },
    labelFontWeight: {
      control: {
        type: 'text',
      },
      defaultValue: 'normal',
    },
    labelColor: {
      control: {
        type: 'color',
      },
      defaultValue: themeColors.black,
    },

    removeLegendValue: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    removePieLables: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    seriesLabelsTemplateText: {
      control: {
        type: 'text',
      },
      defaultValue: "{value.percent.formatNumber('#.#')}%",
    },
    tooltipText: {
      control: {
        type: 'text',
      },
      defaultValue: "{category}: {value.percent.formatNumber('#.')}% ({value.value.formatNumber('#.00')})",
    },
    legendText: {
      control: {
        type: 'text',
      },
      defaultValue: "{value.percent.formatNumber('#.00')}%",
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
  },
};
