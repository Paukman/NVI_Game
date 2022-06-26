import React, { useState } from 'react';
import { Button } from '../FormElements/Button';
import { Grid, GridItem } from '../Grid';
import { Collapse } from './Collapse';

export const CollapseComponent = (args) => {
  const [open, setOpen] = useState(false);

  return (
    <Grid alignItems='center' direction='column'>
      <GridItem lg={2}>
        <Button
          variant='secondary'
          onClick={() => {
            setOpen(!open);
          }}
          text={open ? 'Close Collapse' : 'Open Collapse'}
        />
        <Collapse open={open}>
          <p>HERE WE HAVE CONTENT.</p>
          <p>USE LIST HERE AS SOON AS IT IS READY</p>
        </Collapse>
      </GridItem>
    </Grid>
  );
};

export default {
  title: 'Components/Collapse',
  component: Collapse,
  argTypes: {},
};
