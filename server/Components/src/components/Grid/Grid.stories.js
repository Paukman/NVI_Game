import React, { Fragment } from 'react';
import Grid from './Grid';
import GridItem from './GridItem';
import { InputField } from '../FormElements/InputField/InputField';

export const GridComponent = (args) => {
  return (
    <Fragment>
      <Grid {...args}>
        <GridItem lg={6}>
          This story shows how the &lt;Grid&gt; and &lt;GridItem&gt; work together. On big strings the next intputs are
          in one line and when use switch to mobile view each input will be on its own line and will take full width.
          You can play with controls below to see how &lt;Grid&gt; changes.
        </GridItem>
        <GridItem lg={6}>
          This story shows how the &lt;Grid&gt; and &lt;GridItem&gt; work together. On big strings the next intputs are
          in one line and when use switch to mobile view each input will be on its own line and will take full width.
          You can play with controls below to see how &lt;Grid&gt; changes.
        </GridItem>
      </Grid>
      <hr />
      <Grid {...args}>
        <GridItem md={4} lg={4} xl={4}>
          <InputField label='First name' name='firstName' onChange={() => {}} />
        </GridItem>
        <GridItem md={4} lg={4} xl={4}>
          <InputField label='Last name' name='lastName' onChange={() => {}} />
        </GridItem>
        <GridItem md={4} lg={4} xl={4}>
          <InputField label='Email' name='email' onChange={() => {}} />
        </GridItem>
      </Grid>
      <hr />
      <Grid {...args}>
        <GridItem lg={12}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget augue vitae neque sagittis convallis. Morbi
          blandit risus vel neque convallis, id dictum erat laoreet. Donec congue lacus vitae erat porttitor, at
          pellentesque nisl viverra. Suspendisse condimentum hendrerit nisi. Sed eget pellentesque metus.
        </GridItem>
      </Grid>
      <hr />
      <Grid {...args}>
        <GridItem md={4} lg={4} xl={4}>
          First Name
        </GridItem>
        <GridItem md={4} lg={4} xl={4}>
          Last Name
        </GridItem>
        <GridItem md={4} lg={4} xl={4}>
          Email
        </GridItem>
      </Grid>
    </Fragment>
  );
};

export default {
  title: 'Components/Grid/Grid',
  component: Grid,
  argTypes: {
    spacing: {
      control: {
        type: 'number',
      },
      defaultValue: 1,
    },
    alignContent: {
      control: {
        type: 'radio',
        options: ['stretch', 'center', 'flex-start', 'flex-end', 'space-between', 'space-around'],
      },
      defaultValue: 'stretch',
    },
    alignItems: {
      control: {
        type: 'radio',
        options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
      },
      defaultValue: 'stretch',
    },
    direction: {
      control: {
        type: 'radio',
        options: ['row', 'row-reverse', 'column', 'column-reverse'],
      },
      defaultValue: 'row',
    },
    justify: {
      control: {
        type: 'radio',
        options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
      },
      defaultValue: 'flex-start',
    },
    wrap: {
      control: {
        type: 'radio',
        options: ['nowrap', 'wrap', 'wrap-reverse'],
      },
      defaultValue: 'wrap',
    },
  },
};
