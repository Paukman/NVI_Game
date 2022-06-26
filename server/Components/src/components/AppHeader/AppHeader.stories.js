import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { AppHeader } from './AppHeader';

export const AppHeaderComponent = (args) => {
  return (
    <AppHeader
      name={'username'}
      logo={''}
      onLogout={() => {}}
      picture={''}
      rightIconName='ExpandMore'
      iconName='Assignment'
      onMenuItemClick={action('AppHeader Menu changed')}
      menuItems={[
        {
          icon: 'AccountBalance',
          name: 'Balance',
          label: 'Balance',
        },
      ]}
    />
  );
};

export default {
  title: 'Components/AppHeader',
  component: AppHeader,
};
