import React from 'react';
import styled from 'styled-components';
import LineChart from './LineChart';
import { colors } from '../../../theme/colors';
import { SingleLineData, MultipleLineData } from './data';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 500px;
`;

export const LineChartComponent = (args) => {
  const props = {
    data: args.data,
    config: { ...args },
  };
  return (
    <Container>
      <LineChart id={'chartdiv'} {...props} />
    </Container>
  );
};

export default {
  title: 'Components/Charts/LineChart',
  component: LineChart,
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
      defaultValue: '{valueY.value}',
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
      defaultValue: false,
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
      defaultValue: 'date',
    },
    labelYAxis: {
      control: {
        type: 'text',
      },
    },
    data: {
      options: { SingleLineData: SingleLineData, MultipleLineData: MultipleLineData },
      control: {
        type: 'select',
      },
      defaultValue: SingleLineData,
    },
    labelsYAxis: {
      options: {
        WithData: ['value'],
        WithMultipleData: ['value1', 'value2'],
        WithoutData: [],
      },
      control: {
        type: 'select',
      },
      defaultValue: ['value'],
    },
    tensionX: {
      control: {
        type: 'number',
      },
      defaultValue: 0.8,
    },
    strokeWidth: {
      control: {
        type: 'number',
      },
      defaultValue: 3,
    },
  },
};
