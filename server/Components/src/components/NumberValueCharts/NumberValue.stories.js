import React from 'react';
import { NumberValue } from './NumberValue';
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
    label: 'Actual',
    value: 92.31,
  },
  {
    label: 'Last Year',
    value: 89.54,
  },
  {
    label: 'Budget',
    value: 0.34123,
  },
];

const valueTypeId = [1, 2, 3];
const valueFormat = ['0.00', '0', '0.0'];
const valueDecimals = [0, 0, 0];
const displaySize = ['as-is', 'as-is', 'as-is'];

const colorsValue = [themeColors.widgetsRed, themeColors.widgetsLightGreen, themeColors.mediumGray, themeColors.green];

export const NumberValueComponent = (args) => {
  const props = {
    data: args.data,
    config: { ...args },
    id: args.id,
  };
  return (
    <Container>
      <NumberValue {...props} />
    </Container>
  );
};

export default {
  title: 'Components/NumberValueCharts/NumberValue',
  component: NumberValue,
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

    fontSizeFirstElement: {
      control: {
        type: 'text',
      },
      defaultValue: '54px',
    },
    fontSizeLabels: {
      control: {
        type: 'range',
        min: 10,
        max: 40,
        step: 1,
      },
      defaultValue: 14,
    },
    fontSizeOtherElements: {
      control: {
        type: 'range',
        min: 10,
        max: 100,
        step: 1,
      },
      defaultValue: 30,
    },
    fontWeightValues: {
      control: {
        type: 'text',
      },
      defaultValue: '600',
    },
    fontWeightLabels: {
      control: {
        type: 'text',
      },
      defaultValue: '600',
    },
  },
};
