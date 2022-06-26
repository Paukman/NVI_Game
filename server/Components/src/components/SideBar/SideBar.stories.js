import React, { useState } from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { SideBar } from './SideBar';
import { Grid, GridItem } from '../Grid';
import { Button } from '../FormElements/Button';
import { Image } from '../Image';
import { ListSubheader } from '../List';
import { items } from './mock';
import { colors } from '../../theme/colors';

const HeaderWrapper = styled.div`
  padding: 20px 40px;
  background-color: ${colors.darkBlue};
  margin-bottom: 30px;
`;

const Header = () => {
  return (
    <ListSubheader disableGutters={true}>
      <HeaderWrapper>
        <Image src='http://localhost:3000/myp2_logo_white.svg' height={30} />
      </HeaderWrapper>
    </ListSubheader>
  );
};

export const SideBarComponent = (args) => {
  const [selectedId, setSelectedId] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <Grid alignItems='center' direction='column'>
      <GridItem lg={2}>
        <Button
          variant='secondary'
          onClick={() => {
            setOpen(!open);
          }}
          text={open ? 'Close SideBar' : 'Open SideBar'}
        />
        <SideBar
          {...args}
          open={open}
          items={items}
          selectedId={selectedId}
          onClick={(value) => {
            setSelectedId(value.id);
            action('Item clicked')(value);
          }}
          onClose={() => {
            setOpen(false);
          }}
          subheader={<Header />}
        />
      </GridItem>
    </Grid>
  );
};

export default {
  title: 'Components/SideBar',
  component: SideBar,
  argTypes: {
    anchor: {
      control: {
        type: 'select',
        options: SideBar.anchors,
      },
      defaultValue: SideBar.anchors[0],
    },
    dense: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    disableGutters: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    disablePadding: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    open: {
      control: {
        disable: true,
      },
    },
    selectedId: {
      control: {
        disable: true,
      },
    },
    subheader: {
      control: {
        disable: true,
      },
    },
    children: {
      control: {
        disable: true,
      },
    },
    onClick: {
      control: {
        disable: true,
      },
    },
    onClose: {
      control: {
        disable: true,
      },
    },
  },
};
