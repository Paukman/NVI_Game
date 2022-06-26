/* istanbul ignore file */ // << This file was provided by Auth0, need to look into hooks/testing of this
/* eslint react/prop-types: 0 */

import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import api from "api";
import * as analytics from "utils/analytics/analytics";

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

const CHANGE_PWD_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, "/password/security");

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);

export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [isTempPassword, setIsTempPassword] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes("error=unauthorized")) {
        const loggedOutMessage = window.location.search.includes(
          "error_description=BETA_ACCESS_DENIED"
        )
          ? "beta"
          : "unauthorized";

        auth0FromHook.loginWithRedirect({
          appState: {
            targetUrl: "/"
          },
          loggedOutMessage
        });
      } else {
        if (window.location.search.includes("code=")) {
          const { appState } = await auth0FromHook.handleRedirectCallback();
          onRedirectCallback(appState);
        }

        const isAuth = await auth0FromHook.isAuthenticated();

        setIsAuthenticated(isAuth);

        if (isAuth) {
          const u = await auth0FromHook.getUser();
          setUser(u);

          analytics.setUser(u);
          const token = await auth0FromHook.getTokenSilently();
          // redirect to change password page
          if (u.changeTemporaryPassword) {
            setIsTempPassword(true);
            onRedirectCallback = CHANGE_PWD_REDIRECT_CALLBACK;
          }
          analytics.loginSuccess();
          api.setToken(token);
        }

        setLoading(false);
      }
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      // console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const u = await auth0Client.getUser();
    setUser(u);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const u = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(u);
  };

  const handleLogout = (...p) => {
    analytics.logout();
    if (auth0Client) {
      auth0Client.logout(...p);
    }
  };

  const deleteCookies = () => {
    document.cookie.split(";").forEach(c => {
      const key = c.split("=")[0];
      if (key.includes("a0.spajs.txs.")) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      }
    });
  };

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        isTempPassword,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: p => {
          deleteCookies();
          auth0Client.loginWithRedirect({
            ...p,
            platformVersion: window.envConfig.VERSION_HASH // short SHA of the commit #
          });
        },
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => handleLogout(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
