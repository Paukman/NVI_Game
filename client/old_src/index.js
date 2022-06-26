import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Auth0Provider } from "utils/auth0/Auth0Wrapper";
import AutoLogout from "Nav/AutoLogout";
import { queryClient } from "api";
import { MessageProvider } from "StyleGuide/Components";
import AntModalProvider from "StyleGuide/Components/Modal";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ModalProvider from "./Common/ModalProvider";

import "./index.scss";
import "antd/dist/antd.less";
import "./StyleGuide/ant-styles/index.less";

const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

const auth0Provider = (
  <Auth0Provider
    audience="https://api.atb.com/"
    domain={window.envConfig.AUTH0_DOMAIN}
    client_id={window.envConfig.AUTH0_CLIENTID}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <QueryClientProvider client={queryClient}>
      <MessageProvider>
        <ModalProvider>
          <AntModalProvider>
            <App />
            <AutoLogout />
          </AntModalProvider>
        </ModalProvider>
      </MessageProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </Auth0Provider>
);

ReactDOM.render(auth0Provider, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
