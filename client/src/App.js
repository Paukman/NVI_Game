import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import jwt from 'jsonwebtoken';

import { SdFlcReactRouterPages } from '@sdflc/react-router-pages';

import { addLicense, PageLoading } from 'mdo-react-components';

import { componentsMap } from './config/componentsMap';
import { appSettings } from './config/appSettings';

import { ErrorMessage } from './components';

import { PageOnAuthError } from './pages';

import { UserContext, AppContext, HotelContext, GlobalFilterContext } from './contexts';

import { MainLayout } from './layouts';

import { useUserAuth } from './graphql/useUserAuth';
import logger from './utils/logger';
import { useOrganization } from './graphql';

// TODO: Figure out why it fails in CircleCI
//       Or even better - make mdo-react-components to export addLicense
// import { addLicense } from '@amcharts/amcharts4/core';
// addLicense(appSettings.amchartsKey);

const App = (props) => {
  const { authEnvironment, authSettings } = props;
  const {
    isAuthenticated,
    error,
    user,
    isLoading: userLoading,
    loginWithRedirect,
    getAccessTokenSilently,
    logout,
  } = useAuth0();

  const [isPreparing, setPreparing] = useState(true);
  const { signIn, signingIn, errors, mdoToken } = useUserAuth();
  const { user: appUser, setUserInfo } = useContext(UserContext);
  const { clearPortfolio } = useContext(GlobalFilterContext);
  const {
    appPages,
    loading: appPagesAndMenu,
    listAppPages,
    listSideBarItems,
    dashboardList,
    permissionsList,
  } = useContext(AppContext);
  const { listHotels, loadingList } = useContext(HotelContext);
  const { organizationList } = useOrganization();
  useEffect(() => {
    (async () => {
      try {
        if (!isAuthenticated) {
          return;
        }

        const token = await getAccessTokenSilently({
          audience: authSettings.audience,
        });

        logger.debug(`Got token from ${authEnvironment} Auth0, sign in to the application`, token);

        signIn({ params: { token, environment: authEnvironment } });
      } catch (ex) {
        console.error('An exception has occured when requesting access token from Auth0: ', ex.message);
      }
    })();
  }, [isAuthenticated, signIn, getAccessTokenSilently]);

  useEffect(() => {
    if (mdoToken) {
      const decodedToken = jwt.decode(mdoToken);

      logger.debug('Got MDO token from app', mdoToken);
      logger.debug('Decoded token looks like', decodedToken);
      logger.debug('User info from Auth0', user);

      setUserInfo({
        ...user,
        userId: decodedToken?.id,
        roleId: decodedToken?.roleId,
        orgId: decodedToken?.orgId,
        mdoToken,
      });
      organizationList();
      if (appSettings.pendo === 'true' && global.pendo) {
        pendo.initialize({
          visitor: {
            id: user.email,
          },
          account: {
            id: 'myp2',
          },
        });
      }

      addLicense(appSettings.amchartsKey);
      permissionsList({
        appId: 'myp2',
        permissionEntityId: ['page', 'dashboard'],
        referenceId: null,
        permissionTypeId: null,
      });
      listAppPages({ params: {}, pagination: {} });
      listSideBarItems({ params: {}, pagination: {} });
      dashboardList({ params: {} });
    }

    if (mdoToken || errors.length) {
      setTimeout(() => setPreparing(false), 100);
    }
  }, [setUserInfo, listAppPages, listSideBarItems, listHotels, dashboardList, mdoToken, errors, signingIn, user]);

  useEffect(() => {
    if (appUser && appUser.orgId) {
      logger.debug("List hotels for user's organization:", appUser.orgId);

      clearPortfolio();
      listHotels({ orgId: appUser.orgId });
    }
  }, [appUser, listHotels, clearPortfolio]);

  if (!isAuthenticated && !userLoading) {
    loginWithRedirect();
    return null;
  }

  if (isPreparing || appPagesAndMenu || loadingList || userLoading) {
    return <PageLoading open />;
  }

  if (error) {
    // TODO: Replace with loading component from mdo-react-components
    return <ErrorMessage>Oops: {error.message}</ErrorMessage>;
  }

  if (errors.length > 0) {
    // This is user authorization error that came from BE on signing in
    return <PageOnAuthError errors={errors} onLogout={() => logout({ returnTo: window.location.origin })} />;
  }

  return (
    <SdFlcReactRouterPages
      siteMap={appPages.data}
      componentsMap={componentsMap}
      layout={MainLayout}
      rolesDontMatchComponent={'PageNoAccess'}
      rolesDontMatchLayout={MainLayout}
      failoverComponent={() => {
        return <div>This page cannot be displayed as page component was not found.</div>;
      }}
      roles={[]} // array of strings with curreny user roles, should be requested from BE or come from auth0
      routerComponents={{ BrowserRouter, Route, Switch }}
    />
  );
};

App.displayName = 'App';

App.propTypes = {
  authEnvironment: PropTypes.string,
  authSettings: PropTypes.shape({}),
};

export default App;
