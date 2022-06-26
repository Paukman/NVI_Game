import React, { useState } from 'react';
import { Button } from '../FormElements/Button';
import { Grid, GridItem } from '../Grid';
import { Drawer } from './Drawer';

export const DrawerComponent = (args) => {
  const [open, setOpen] = useState(false);

  return (
    <Grid alignItems='center' direction='column'>
      <GridItem lg={2}>
        <Button
          variant='secondary'
          onClick={() => {
            setOpen(!open);
          }}
          text={open ? 'Close Drawer' : 'Open Drawer'}
        />
        <Drawer
          {...args}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <p>HERE WE HAVE CONTENT.</p>
          <p>USE LIST HERE AS SOON AS IT IS READY</p>
        </Drawer>
      </GridItem>
    </Grid>
  );
};

export default {
  title: 'Components/Drawer',
  component: Drawer,
  argTypes: {
    elevation: {
      control: {
        type: 'number',
      },
      defaultValue: 16,
    },
    anchor: {
      control: {
        type: 'select',
        options: Drawer.anchors,
      },
      defaultValue: Drawer.anchors[0],
    },
    variant: {
      control: {
        type: 'select',
        options: Drawer.variants,
      },
      defaultValue: Drawer.variants[2],
    },
  },
};
