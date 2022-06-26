import React, { useState } from 'react';
import { ClickAway } from './ClickAway';
import { useClickAwayStyles } from './styled';
import { Button } from '../FormElements/Button';
import { Grid, GridItem } from '../Grid';

export const ClickAwayComponent = () => {
  const classes = useClickAwayStyles();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <Grid alignItems='center' direction='column'>
      <GridItem lg={2}>
        <ClickAway onClickAway={handleClickAway}>
          <div className={classes.root}>
            <Button variant='secondary' onClick={handleClick} text={open ? 'Close Drawer' : 'Open Drawer'} />

            {open ? (
              <div className={classes.dropdown}>Click me, I will stay visible until you click outside.</div>
            ) : null}
          </div>
        </ClickAway>
      </GridItem>
    </Grid>
  );
};

export default {
  title: 'Components/ClickAway',
  component: ClickAway,
  argTypes: {
    mouseEvent: {
      options: ClickAway.mouseEvents,
      control: {
        type: 'select',
      },
      defaultValue: ClickAway.mouseEvents[0],
    },
  },
};
