import React, { useState } from 'react';

import { Checkbox } from './Checkbox';
import { colors } from '../../../theme/colors';

export const CheckboxComponent = (args) => {
  return <Checkbox {...args} />;
};

export const CheckboxesComponent = (args) => {
  const [active, setActive] = useState({
    'checkbox-3': true,
  });

  return (
    <div>
      {Array.from({ length: 5 }).map((chk, idx) => {
        const chkId = `checkbox-${idx}`;
        return (
          <Checkbox
            {...args}
            key={idx}
            id={chkId}
            checked={active[chkId] === true}
            onChange={(name, value) => {
              setActive({
                ...active,
                [name]: value,
              });
            }}
          />
        );
      })}
    </div>
  );
};

export default {
  title: 'Components/FormElements/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    toTheRight: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    checkboxSize: {
      control: {
        type: 'select',
        options: ['scale(1)', 'scale(1.3)', 'scale(2)', 'scale(3)'],
      },
      defaultValue: 'scale(1)',
    },
    checkedColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.blue,
    },
  },
};
