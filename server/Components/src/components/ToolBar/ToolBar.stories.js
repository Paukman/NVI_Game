import React from 'react';

import { ToolBar, ToolBarItem } from './index';
import { Dropdown } from '../../index';

/**
 * TODO:
 * The toolbar for now uses HTML buttons as by now we have no button component.
 * As soon as it is added we need to replace <button> to our component <Button>.
 */

export const ToolBarComponent = (args) => (
  <ToolBar {...args}>
    {args.noChildren !== true && (
      <React.Fragment>
        <ToolBarItem>
          <Dropdown
            label='Stack'
            value={'react'}
            onChange={() => {}}
            items={[
              {
                label: 'react',
                value: 'react',
              },
              {
                label: 'redux',
                value: 'redux',
              },
              {
                label: 'flux',
                value: 'flux',
              },
            ]}
          />
        </ToolBarItem>
        <ToolBarItem>
          <button>Some Button</button>
        </ToolBarItem>
        <ToolBarItem toTheRight={true}>
          <button>Create New</button>
        </ToolBarItem>
        <ToolBarItem marginRight={args.marginRight} marginTop={args.marginTop}>
          <button>Download</button>
        </ToolBarItem>
      </React.Fragment>
    )}
  </ToolBar>
);

export default {
  title: 'Components/ToolBar',
  component: ToolBar,
  argTypes: {
    id: {
      control: {
        type: 'text',
      },
      defaultValue: 'toolbar',
    },
    hidden: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    noChildren: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    marginRight: {
      control: {
        type: 'number',
      },
      defaultValue: '',
    },
    marginTop: {
      control: {
        type: 'number',
      },
      defaultValue: '',
    },
  },
};
