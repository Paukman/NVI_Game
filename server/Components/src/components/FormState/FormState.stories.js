import React from 'react';
import { FormState } from './FormState';
import Grid from '../Grid/Grid';
import GridItem from '../Grid/GridItem';
import { InputField } from '../FormElements/InputField/InputField';
import { InputDate } from '../FormElements/InputDate/InputDate';
import { Button } from '../FormElements/Button/Button';
import { action } from '@storybook/addon-actions';

const data = {
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  birthday: '05/19/2021',
};

export const FormStateComponent = (args) => {
  return (
    <FormState
      data={data}
      {...args}
      onSubmit={(value) => {
        action('FormState Changed')(value);
      }}
    >
      {({ data, handleChange, submit }) => (
        <Grid spacing={2} lg={'50%'}>
          <GridItem>
            <InputField label='Username' name='username' value={data?.username} onChange={handleChange} />
          </GridItem>
          <GridItem>
            <InputField label='First Name' name='firstName' value={data?.firstName} onChange={handleChange} />
          </GridItem>
          <GridItem>
            <InputField label='Last Name' name='lastName' value={data?.lastName} onChange={handleChange} />
          </GridItem>
          <GridItem>
            <InputDate label='Birthday' name='birthday' value={data?.birthday} onChange={handleChange} />
          </GridItem>
          <GridItem>
            <Button text='Submit' onClick={submit} />
          </GridItem>
        </Grid>
      )}
    </FormState>
  );
};

export default {
  title: 'Components/FormState',
  component: FormState,
};
