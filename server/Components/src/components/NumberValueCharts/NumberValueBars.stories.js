import React from 'react';
import { NumberValueBars } from './NumberValueBars';
import styled from 'styled-components';
import { colors as themeColors } from '../../theme/colors';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 90vh;
`;

const data = [
  {
    label: 'OOO Rooms',
    value: 0.1,
  },
  {
    label: 'Complimentary Rooms',
    value: 24,
  },
];

const valueTypeId = [3, 1, 3];
const valueFormat = ['0', '0', '0.00'];
const valueDecimals = [0, 0, 2];
const displaySize = ['as-is', 'as-is', 'as-is'];

const colorsValue = [themeColors.blue, themeColors.widgetsDarkGreen, themeColors.lightBlue];

export const NumberValueBarsComponent = (args) => {
  const props = {
    data: args.data,
    config: { ...args },
    id: args.id,
  };
  return (
    <Container>
      <NumberValueBars {...props} />
    </Container>
  );
};

export default {
  title: 'Components/NumberValueCharts/NumberValueBars',
  component: NumberValueBars,
  argTypes: {
    valueTypeId: {
      control: {
        type: 'array',
      },
      defaultValue: [...valueTypeId],
    },
    valueFormat: {
      control: {
        type: 'array',
      },
      defaultValue: [...valueFormat],
    },
    valueDecimals: {
      control: {
        type: 'array',
      },
      defaultValue: [...valueDecimals],
    },
    displaySize: {
      control: {
        type: 'array',
      },
      defaultValue: [...displaySize],
    },
    data: {
      control: {
        type: 'array',
      },
      defaultValue: [...data],
    },
    id: {
      control: {
        type: 'text',
      },
      defaultValue: 'number-value',
    },
    colors: {
      control: {
        type: 'array',
      },
      defaultValue: [...colorsValue],
    },
    bgColorValue: {
      control: {
        type: 'color',
      },
      defaultValue: themeColors.white,
    },
    fontWeightValue: {
      control: {
        type: 'text',
      },
      defaultValue: '600',
    },
    colorLabel: {
      control: {
        type: 'color',
      },
      defaultValue: themeColors.white,
    },
    fontSizeLabel: {
      control: {
        type: 'text',
      },
      defaultValue: '20px',
    },
    fontWeightLabel: {
      control: {
        type: 'text',
      },
      defaultValue: '600',
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
      defaultValue: '200',
    },
  },
};
