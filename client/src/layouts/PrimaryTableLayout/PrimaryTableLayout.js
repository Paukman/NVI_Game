import React from 'react';
import PropTypes from 'prop-types';

import { MainLayout } from '../index';
import { HmgGlCodeProvider } from '../../providers';

const PrimaryTableLayout = (props) => {
  const { children, ...rest } = props;

  return (
    <MainLayout {...rest}>
      <HmgGlCodeProvider>{children}</HmgGlCodeProvider>
    </MainLayout>
  );
};

PrimaryTableLayout.displayName = 'PrimaryTableLayout';

PrimaryTableLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export { PrimaryTableLayout };
