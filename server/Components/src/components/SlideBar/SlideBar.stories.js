import React, { useState, Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { SlideBar } from './SlideBar';
import { InputField } from '../FormElements/InputField';
import { Button } from '../FormElements/Button';
import { FormState } from '../FormState';
import { Grid } from '../Grid';

export const SlideBarComponent = (args) => {
  const [open, setOpen] = useState(false);
  const data = {
    address1: '167',
    address2: 'Moorside Road',
    city: 'Manchester',
    stateProvince: 'Manchester',
    postalCode: 'M27 9LD',
    country: 'England',
  };
  return (
    <Fragment>
      <Button
        variant='secondary'
        onClick={() => {
          setOpen(!open);
        }}
        text={open ? 'Close SlideBar' : 'Open SlideBar'}
      />
      <SlideBar
        onCancel={() => setOpen(false)}
        onSave={() => {
          action('User clicked save');
        }}
        open={open}
        {...args}
      >
        <Fragment>
          <FormState
            data={data}
            onSubmit={(value) => {
              action('FormState Changed')(value);
            }}
          >
            {({ data, handleChange, submit }) => (
              <Grid>
                <InputField
                  required
                  name='address1'
                  label={'Address1'}
                  helperText={'Required'}
                  value={data?.address1}
                  onChange={handleChange}
                />
                <InputField
                  required
                  name='address2'
                  label={'Address2'}
                  helperText={'Required'}
                  value={data?.address2}
                  onChange={handleChange}
                />
                <InputField
                  required
                  name='city'
                  label={'City'}
                  helperText={'Required'}
                  value={data?.city}
                  onChange={handleChange}
                />
                <InputField
                  required
                  name='stateProvince'
                  label={'State/Province'}
                  helperText={'Required'}
                  value={data?.stateProvince}
                  onChange={handleChange}
                />
                <InputField
                  required
                  name='postalCode'
                  label={'ZipCode/PostalCode'}
                  helperText={'Required'}
                  value={data?.postalCode}
                  onChange={handleChange}
                />
                <InputField
                  required
                  name='country'
                  label={'Country'}
                  helperText={'Required'}
                  value={data?.country}
                  onChange={handleChange}
                />
              </Grid>
            )}
          </FormState>
        </Fragment>
      </SlideBar>
    </Fragment>
  );
};

export default {
  title: 'Components/SlideBar',
  component: SlideBar,
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Test Form',
    },
    showCloseIcon: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    showButtons: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    buttonSaveText: {
      control: {
        type: 'text',
      },
      defaultValue: 'Save',
    },
    buttonCancelText: {
      control: {
        type: 'text',
      },
      defaultValue: 'Cancel',
    },
    anchor: {
      control: {
        type: 'select',
        options: SlideBar.anchors,
      },
      defaultValue: SlideBar.anchors[0],
    },
    titleVariant: {
      control: {
        type: 'select',
        options: SlideBar.variants,
      },
      defaultValue: SlideBar.variants[4],
    },
    onCancel: {
      control: {
        disable: true,
      },
    },
    onSave: {
      control: {
        disable: true,
      },
    },
  },
};
