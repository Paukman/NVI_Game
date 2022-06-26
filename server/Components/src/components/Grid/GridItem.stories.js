import React, { Fragment } from 'react';
import Grid from './Grid';
import GridItem from './GridItem';
import InputField from '../FormElements/InputField/InputField';

export const GridItemComponent = (args) => {
  return (
    <Fragment>
      <Grid spacing={1}>
        <GridItem lg={12}>
          This story shows how the &lt;Grid&gt; and &lt;GridItem&gt; work together. On big strings the next intputs are
          in one line and when use switch to mobile view each input will be on its own line and will take full width.
        </GridItem>
      </Grid>
      <hr />
      <Grid spacing={1}>
        <GridItem lg={6}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget augue vitae neque sagittis convallis. Morbi
          blandit risus vel neque convallis, id dictum erat laoreet. Donec congue lacus vitae erat porttitor, at
          pellentesque nisl viverra. Suspendisse condimentum hendrerit nisi. Sed eget pellentesque metus.
        </GridItem>
      </Grid>
      <hr />
      <Grid spacing={1}>
        <GridItem {...args}>First Name</GridItem>
        <GridItem {...args}>Last Name</GridItem>
        <GridItem {...args}>Email</GridItem>
      </Grid>
    </Fragment>
  );
};

export default {
  title: 'Components/Grid/GridItem',
  component: GridItem,
  argTypes: {
    xs: {
      control: {
        type: 'number',
      },
      defaultValue: 12,
    },
    sm: {
      control: {
        type: 'number',
      },
      defaultValue: 12,
    },
    md: {
      control: {
        type: 'number',
      },
      defaultValue: 6,
    },
    lg: {
      control: {
        type: 'number',
      },
      defaultValue: 4,
    },
    xl: {
      control: {
        type: 'number',
      },
      defaultValue: 4,
    },
    zeroMinWidth: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
};
