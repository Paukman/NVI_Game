import React, { memo } from 'react';
import queryString from 'query-string';
import { Auth0Provider } from '@auth0/auth0-react';
import Cookies from 'universal-cookie';
import { GlobalThemeProvider } from 'mdo-react-components';

import { GlobalProvider } from './providers/GlobalProvider';

import { appSettings } from './config/appSettings';

import App from './App';
import { logger } from './utils';
import { PageOnError } from 'pages';
import { ErrorMessage } from 'components';

const AuthWrapper = memo((props) => {
  const search = queryString.parse(location.search);
  const cookies = new Cookies();

  // Step 1. Assign default Auth0 environment
  let authEnvironment = appSettings.authEnvironment;

  // Step 2. Check if custom auth environment is requested and if yes then use it
  if (appSettings.authEnvironments[search.auth]) {
    // Step 3. If there is auth search parameters in the URL try to use it
    logger.debug(`Using the '${search.auth}' authorization environment from the URL search parameters`);
    authEnvironment = search.auth;
    cookies.set('auth', authEnvironment, { path: '/' });
  } else {
    const authCookie = cookies.get('auth');
    if (authCookie) {
      logger.debug(`Using the '${authCookie}' authorization environment from the auth cookie`);
      authEnvironment = authCookie;
    }
  }

  //const authSettings = appSettings.authEnvironments[authEnvironment];
  const authSettings = appSettings.authEnvironments[authEnvironment.toLowerCase()];

  if (!authSettings) {
    if (['PROD'].indexOf(appSettings.appEnvironment) === -1) {
      // If we are not in the PROD let's provide details on what is wrong:
      console.log('The auth environment to use:', authEnvironment);
      console.log('The auth settings:', authSettings);
      console.log('The app settings:', appSettings);
    }

    if (search.debug === 'yes') {
      console.log('The auth environment to use:', authEnvironment);
      console.log('The auth settings:', authSettings);
      console.log('The app settings:', appSettings);
    }

    return (
      <PageOnError>
        <ErrorMessage>There is a misconfiguration in the application: no auth settings found.</ErrorMessage>
      </PageOnError>
    );
  }

  const auth0Props = {};

  if (authSettings.audience) {
    auth0Props['audience'] = authSettings.audience;
  }

  if (authSettings.connection) {
    auth0Props['mdo_login_connection'] = authSettings.connection;
  }

  return (
    <Auth0Provider
      domain={authSettings.domain}
      clientId={authSettings.clientId}
      redirectUri={`${window.location.origin}${location.search}`}
      {...auth0Props}
    >
      <GlobalThemeProvider>
        <GlobalProvider>
          <App authEnvironment={authEnvironment} authSettings={authSettings} />
        </GlobalProvider>
      </GlobalThemeProvider>
    </Auth0Provider>
  );
});

AuthWrapper.displayName = 'AuthWrapper';

export { AuthWrapper };
