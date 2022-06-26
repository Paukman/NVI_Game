import React from 'react';

import { ChartCard } from './ChartCard';
import { LineChart } from '../Charts/LineChart';
import { SingleLineData } from '../Charts/LineChart/data';
import { colors } from '../../theme/colors';

const config = {
  labelsYAxis: ['value'],
  labelXAxis: 'date',
  tensionX: 0.8,
  strokeWidth: 3,
};

export const ChartCardComponent = (args) => {
  return (
    <ChartCard {...args}>
      <LineChart id={'chartdiv'} config={config} data={SingleLineData} />
    </ChartCard>
  );
};

export default {
  title: 'Components/ChartCard',
  component: ChartCard,
  argTypes: {
    titleMargin: {
      control: {
        type: 'number',
      },
      defaultValue: 20,
    },
    titleColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.darkBlue,
    },
    titleFontSize: {
      control: {
        type: 'number',
      },
      defaultValue: 16,
    },
    titleFontWeight: {
      control: {
        type: 'text',
      },
      defaultValue: 'bold',
    },
    backgroundColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.white,
    },
    chartBorderColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.grey,
    },
    chartPadding: {
      control: {
        type: 'text',
      },
      defaultValue: '24px 0px 40px 24px',
    },

    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Chart Title',
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
      defaultValue: '100vh',
    },
    elevation: {
      options: ChartCard.elevations,
      control: {
        type: 'radio',
      },
      defaultValue: ChartCard.elevations[0],
    },
  },
};
