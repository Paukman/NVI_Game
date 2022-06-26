import React from 'react';
import { Tooltip } from './Tooltip';
import { Button } from '../FormElements/Button';
import { colors } from '../../theme/colors';

export const TooltipComponent = (args) => {
  return (
    <>
      <Tooltip {...args}>
        <Button text='Tooltip' variant='none' />
      </Tooltip>
      <br />
      <Tooltip
        {...args}
        html={true}
        title={
          <div>
            <div>Missing Dates</div>
            <h5>This is sample</h5>
            <p>JAN 2022 - 1, 2, 3, 4, 5, 8, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 28, 31</p>
          </div>
        }
      ></Tooltip>
    </>
  );
};

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'This is a Tooltip',
    },
    placement: {
      options: Tooltip.placements,
      control: {
        type: 'select',
      },
      defaultValue: Tooltip.placements[3],
    },
    arrow: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    html: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'This is a Tooltip',
    },
    maxWidth: {
      control: {
        type: 'number',
      },
      defaultValue: 220,
    },
    fontColor: {
      control: {
        type: 'text',
      },
      defaultValue: colors.black,
    },
    fontWeight: {
      control: {
        type: 'text',
      },
      defaultValue: 'normal',
    },
    fontSize: {
      control: {
        type: 'text',
      },
      defaultValue: '14px',
    },
    backgroundColor: {
      control: {
        type: 'text',
      },
      defaultValue: colors.white,
    },
    padding: {
      control: {
        type: 'text',
      },
      defaultValue: '15px',
    },
    border: {
      control: {
        type: 'text',
      },
      defaultValue: `1px solid ${colors.lightGrey}`,
    },
    borderRadius: {
      control: {
        type: 'text',
      },
      defaultValue: '5px',
    },
    boxShadow: {
      control: {
        type: 'text',
      },
      defaultValue: `0 0 8px 0 ${colors.iconGrey}`,
    },
  },
};
