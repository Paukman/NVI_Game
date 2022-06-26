import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Button, GlobalThemeProvider } from 'mdo-react-components';
import { DisplayApiErrors } from '../../components';
import { CenteredLayout } from '../../layouts';
import { getText } from '../../utils/localesHelpers';

import { Container } from './styled';

const PageOnAuthError = memo((props) => {
  const { errors, onLogout } = props;

  return (
    <GlobalThemeProvider>
      <CenteredLayout>
        <Container>
          <DisplayApiErrors errors={errors} />
          <Button text={getText('generic.logout')} iconName='ExitToApp' onClick={onLogout} />
        </Container>
      </CenteredLayout>
    </GlobalThemeProvider>
  );
});

PageOnAuthError.displayName = 'PageOnAuthError';

PageOnAuthError.propTypes = {
  errors: PropTypes.array,
  onLogout: PropTypes.func,
};

export { PageOnAuthError };
