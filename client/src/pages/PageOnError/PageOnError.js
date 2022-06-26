import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { GlobalThemeProvider } from 'mdo-react-components';
import { CenteredLayout } from '../../layouts';

/**
 * This component should be used on any global error after which user needs reload page.
 * Note that the page should be displayed on the same URL
 */
const PageOnError = memo((props) => {
  const { children } = props;

  return (
    <GlobalThemeProvider>
      <CenteredLayout>{children}</CenteredLayout>
    </GlobalThemeProvider>
  );
});

PageOnError.displayName = 'PageOnError';

PageOnError.propTypes = {
  children: PropTypes.node,
};

export { PageOnError };
