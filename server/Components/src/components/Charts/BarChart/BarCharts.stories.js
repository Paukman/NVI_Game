import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../theme/colors';
import { BarChart } from './BarChart';
import { MultipleColumnData, SingleColumnData } from './data';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 500px;
`;

export const SingleColumn = (args) => {
  return (
    <Container>
      <BarChart
        id={'chartdiv0'}
        config={{
          ...args,
          valueFields: ['value'],
          valuesLabels: ['[bold]View Label[/]'],
        }}
        data={SingleColumnData}
      />
    </Container>
  );
};

export const MultipleColumns = (args) => {
  return (
    <Container>
      <BarChart
        id={'chartdiv1'}
        config={{
          ...args,
          valueFields: ['value1', 'value2'],
          valuesLabels: ['[bold]View Label 1[/]', '[bold]Value Label 2[/]'],
        }}
        data={MultipleColumnData}
      />
    </Container>
  );
};

export default {
  title: 'Components/Charts/BarChart',
  component: BarChart,
  argTypes: {
    bgColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.white,
    },
    bgOpacity: {
      control: {
        type: 'number',
      },
      defaultValue: 0.5,
    },
    colors: {
      control: {
        type: 'color',
      },
      defaultValue: colors.blue,
    },
    labelColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.grey,
    },
    xandyAxiscolors: {
      control: {
        type: 'color',
      },
      defaultValue: colors.mediumGray,
    },
    width: {
      control: {
        type: 'text',
      },
      defaultValue: '100%',
    },
    height: {
      control: {
        type: 'text',
      },
      defaultValue: '100%',
    },
    categoryText: {
      options: ['label', 'value'],
      control: {
        type: 'select',
      },
      defaultValue: 'label',
    },
    legendLocation: {
      control: {
        type: 'number',
      },
      defaultValue: 0,
    },
    data: {
      control: {
        disabled: true,
      },
    },
    tooltipText: {
      control: {
        type: 'text',
      },
      defaultValue: '{name}: [bold]{valueX}[/]',
    },
    numberFormat: {
      options: BarChart.numberFormats,
      control: {
        type: 'select',
      },
      defaultValue: BarChart.numberFormats[0],
    },
    inversed: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    cellStartLocation: {
      control: {
        type: 'number',
      },
      defaultValue: 0.1,
    },
    cellEndLocation: {
      control: {
        type: 'number',
      },
      defaultValue: 0.9,
    },
    labelDistance: {
      control: {
        type: 'number',
      },
      defaultValue: -10,
    },
    categoryLabelText: {
      options: ['{label}', '{name}'],
      control: {
        type: 'select',
      },
      defaultValue: '{name}',
    },
    categoryLabelDirection: {
      options: ['right', 'left'],
      control: {
        type: 'select',
      },
      defaultValue: 'right',
    },
    valueLabelDirection: {
      options: ['right', 'left'],
      control: {
        type: 'select',
      },
      defaultValue: 'left',
    },
    valueLabelText: {
      options: ['{valueX}', '{categoryY}'],
      control: {
        type: 'select',
      },
      defaultValue: '{valueX}',
    },
    valueLabelHideOversized: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    categoryLabelTruncate: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    templateHeight: {
      control: {
        type: 'number',
      },
      defaultValue: 100,
    },
    topRadius: {
      control: {
        type: 'number',
        min: 0,
      },
      defaultValue: 3,
    },
    bottomRadius: {
      control: {
        type: 'number',
        min: 0,
      },
      defaultValue: 3,
    },
  },
};
