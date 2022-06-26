import React from 'react';
import styled from 'styled-components';
import { GaugeChart } from './GaugeChart';
import { colors } from '../../../theme/colors';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 500px;
`;

export const GaugeChartComponent = (args) => {
  const ranges = [
    {
      value: 0,
      endValue: 70,
      axisFillOpacity: 1,
      axisFillColor: colors.lightOrange,
      axisFillZIndex: -1,
    },
    {
      value: 70,
      endValue: 90,
      axisFillOpacity: 1,
      axisFillColor: colors.green,
      axisFillZIndex: -1,
    },
    {
      value: 90,
      endValue: 100,
      axisFillOpacity: 1,
      axisFillColor: colors.red,
      axisFillZIndex: -1,
    },
  ];
  const props = {
    config: { ...args, ranges },
  };

  return (
    <Container>
      <GaugeChart id={'chartdiv'} {...props} />
    </Container>
  );
};

export default {
  title: 'Components/Charts/GaugeChart',
  component: GaugeChart,
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
    axisMin: {
      control: {
        type: 'number',
      },
      defaultValue: 0,
    },
    axisMax: {
      control: {
        type: 'number',
      },
      defaultValue: 100,
    },
    axisStrictMinMax: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    innerRadius: {
      control: {
        type: 'number',
      },
      defaultValue: -20,
    },
    handValue: {
      control: {
        type: 'number',
      },
      defaultValue: 30,
    },
    handPinRadius: {
      control: {
        type: 'number',
      },
      defaultValue: 15,
    },
    handPinZIndex: {
      control: {
        type: 'number',
      },
      defaultValue: 1,
    },
    handFill: {
      control: {
        type: 'color',
      },
      defaultValue: '#7D7C84',
    },
    handStroke: {
      control: {
        type: 'color',
      },
      defaultValue: '#7D7C84',
    },
    handStartWidth: {
      control: {
        type: 'number',
      },
      defaultValue: 15,
    },
  },
};
