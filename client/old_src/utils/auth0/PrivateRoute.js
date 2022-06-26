import React, { useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth0 } from "./Auth0Wrapper";

// TODO - move under /hoc directory - this is a higher order component, not so much a util
const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const {
    loading,
    isAuthenticated,
    loginWithRedirect,
    isTempPassword
  } = useAuth0();
  const history = useHistory();

  PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired
  };

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: {
          targetUrl:
            window.location.pathname +
            window.location.hash +
            window.location.search
        }
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);

  useEffect(() => {
    if (isAuthenticated) {
      if (isTempPassword) {
        history.push("/password/security");
      } else if (path !== window.location.pathname) {
        history.push(
          window.location.pathname +
            window.location.hash +
            window.location.search
        );
      }
    }
    // including `history` & `path` in dependency array causes bugs with redirects and quick actions
  }, [isAuthenticated, isTempPassword]);

  const render = props =>
    isAuthenticated === true ? <Component {...props} /> : null;

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;
