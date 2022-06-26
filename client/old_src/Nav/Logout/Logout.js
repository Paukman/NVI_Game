import React, { useEffect, Fragment } from "react";
import { useAuth0 } from "utils/auth0/Auth0Wrapper";

const Logout = () => {
  const { loading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (loading) {
      return;
    }
    const url = new URL(window.location.href);
    const messageType = url.searchParams.get("loggedOutMessage");
    loginWithRedirect({ loggedOutMessage: messageType });
  }, [loading]);

  return <Fragment />;
};

export default Logout;
