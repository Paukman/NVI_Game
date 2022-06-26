import React, { useState, useRef } from 'react';
import { action } from '@storybook/addon-actions';
import { ButtonSideBar, Grid, GridItem, InputField, ToolBar, ToolBarItem } from '../../../index';

import { generateItems } from './data';

const items = generateItems(1000);

export const ButtonSideBarComponent = (args) => {
  const [formula, setFormula] = useState('');
  const formulaRef = useRef();

  return (
    <Grid spacing={2}>
      <GridItem sm={12}>
        <ToolBar>
          <ToolBarItem toTheRight>
            <ButtonSideBar
              items={items}
              onChange={(name, value) => {
                const selectionStart = formulaRef.current.selectionStart;
                const selectionEnd = formulaRef.current.selectionEnd;
                const newPart = `[${value.primary}]`;
                const newFormula = formula.slice(0, selectionStart) + newPart + formula.slice(selectionEnd);

                setFormula(newFormula);

                setImmediate(() => {
                  formulaRef.current.focus();
                  formulaRef.current.setSelectionRange(selectionEnd + newPart.length, selectionEnd + newPart.length);
                });
              }}
              {...args}
            />
          </ToolBarItem>
        </ToolBar>
      </GridItem>
      <GridItem sm={12}>
        <InputField
          ref={formulaRef}
          name='formula'
          label='Formula'
          value={formula}
          onChange={(name, value) => setFormula(value)}
        />
      </GridItem>
    </Grid>
  );
};

export default {
  title: 'Components/FormElements/ButtonSideBar',
  component: ButtonSideBar,
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Select MDO GL Code',
    },
    searchLabel: {
      control: {
        type: 'text',
      },
      defaultValue: 'Search',
    },
    text: {
      control: {
        type: 'text',
      },
      defaultValue: 'GL Code',
    },
    name: {
      control: {
        type: 'text',
      },
      defaultValue: 'mdoGlCode',
    },
    anchor: {
      options: ButtonSideBar.anchors,
      control: {
        type: 'select',
      },
      defaultValue: ButtonSideBar.anchors[2],
    },
    dataEl: {
      control: {
        type: 'text',
      },
      defaultValue: 'mdoSelector',
    },
  },
};
