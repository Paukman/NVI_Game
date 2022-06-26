import React, { lazy, Suspense, useEffect } from "react";
import PropTypes from "prop-types";
import { Container } from "semantic-ui-react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import * as analytics from "utils/analytics/analytics";

import PrivateRoute from "utils/auth0/PrivateRoute";
import { useAuth0 } from "utils/auth0/Auth0Wrapper";
import { ScrollToTop } from "utils";
import { Skeleton } from "antd";
import Navbar from "Nav/Navbar";
import Styles from "StyleGuide/Styles";
import "styles/global.scss";
import "styles/responsive.scss";
import "styles/index.less";

import NavTracker from "./NavTracker";

const More = lazy(() => import("Nav/More"));
const MoveMoney = lazy(() => import("Nav/MoveMoney"));
const AccountsOverview = lazy(() => import("AccountsOverview"));
const AccountDetails = lazy(() => import("AccountDetails"));
const PageNotFound = lazy(() => import("Nav/PageNotFound"));
const LoginChallenge = lazy(() => import("LoginChallenge"));
const IncomingChallenge = lazy(() =>
  import("LoginChallenge/IncomingChallenge")
);
const Password = lazy(() => import("Password"));
const Logout = lazy(() => import("Nav/Logout"));
const Expired = lazy(() => import("Nav/Expired"));
const FailedTransactionDrawer = lazy(() =>
  import("FailedTransaction/FailedTransactionDrawer")
);

const pagesWithoutHeader = [
  "/password",
  "/password/security",
  "/challenge",
  "/loginChallenge",
  "/expired"
];

export const Header = ({ isAuth, match: { url } }) => {
  Header.propTypes = {
    isAuth: PropTypes.bool,
    match: PropTypes.shape({
      url: PropTypes.string
    }).isRequired
  };
  const shouldRenderHeader = isAuth && !pagesWithoutHeader.includes(url);
  return shouldRenderHeader ? <Navbar /> : null;
};

const App = () => {
  const { isAuthenticated, isTempPassword } = useAuth0();

  useEffect(() => {
    analytics.init();
  }, []);

  const MainContainer = ({ children }) => {
    MainContainer.propTypes = {
      children: PropTypes.node.isRequired
    };
    return (
      <main className="main-container">
        <Container>{children}</Container>
      </main>
    );
  };

  const Loading = () => {
    return <Skeleton active />;
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="App">
        <NavTracker />
        <Route
          path="*"
          component={({ match }) => (
            <Header isAuth={isAuthenticated} match={match} />
          )}
        />
        <Suspense fallback={<Loading />}>
          <FailedTransactionDrawer />
          <Switch>
            <PrivateRoute
              exact
              path="/"
              component={() => (
                <MainContainer>
                  <AccountsOverview />
                </MainContainer>
              )}
            />
            <PrivateRoute
              path="/styles"
              component={() => (
                <MainContainer>
                  <Styles />
                </MainContainer>
              )}
            />
            <PrivateRoute
              path="/overview"
              component={() => (
                <MainContainer>
                  <AccountsOverview />
                </MainContainer>
              )}
            />
            <PrivateRoute
              exact
              path="/details/:type/:id"
              component={({ match }) => {
                return (
                  <MainContainer>
                    <AccountDetails match={match} />
                  </MainContainer>
                );
              }}
            />
            <PrivateRoute
              path="/move-money"
              component={() => (
                <MainContainer>
                  <MoveMoney />
                </MainContainer>
              )}
            />
            <PrivateRoute
              path="/more"
              component={() => (
                <MainContainer>
                  <More />
                </MainContainer>
              )}
            />
            <PrivateRoute
              path="/password"
              component={() => <Password isTemp={isTempPassword} />}
            />
            <PrivateRoute
              path="/password/security"
              component={() => <Password isTemp={isTempPassword} />}
            />
            <Route
              exact
              path="/challenge"
              component={() => <IncomingChallenge />}
            />
            <Route
              exact
              path="/loginChallenge"
              component={() => <LoginChallenge />}
            />
            <Route exact path="/expired" component={() => <Expired />} />
            <Route
              exact
              path="/logout"
              component={() => (
                <MainContainer>
                  <Logout />
                </MainContainer>
              )}
            />
            <Route
              path="*"
              component={() => (
                <MainContainer>
                  <PageNotFound />
                </MainContainer>
              )}
            />
          </Switch>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default App;
