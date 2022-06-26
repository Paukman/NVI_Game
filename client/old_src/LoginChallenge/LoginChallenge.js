/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useAuth0 } from "utils/auth0/Auth0Wrapper";
import ChallengeForm from "Common/Challenge/ChallengeForm";
import LoginLayout from "StyleGuide/Layouts/LoginLayout";
import api from "api";
import { mfaSecurityMessages } from "utils/MessageCatalog";
import { AntModalContext } from "StyleGuide/Components/Modal";

const secondsToAutoLogout = 9 * 60;

const LoginChallenge = () => {
  const [title, setTitle] = useState();
  const { show: showModal } = useContext(AntModalContext);

  const completeLogin = transactionToken => {
    // redirect back to Auth0, passing the successfull transactionToken along with the original state param they gave us
    window.location = `https://${window.envConfig.AUTH0_DOMAIN}/continue?state=${api.challenge.state}&token=${transactionToken}`;
  };

  const { logout } = useAuth0();

  useEffect(() => {
    const autoLogoutTimer = setTimeout(() => {
      logout({
        returnTo: `${window.location.origin}/logout?loggedOutMessage=inactive`
      });
    }, secondsToAutoLogout * 1000);

    return () => clearTimeout(autoLogoutTimer);
  }, [logout]);

  const onChallengeTypeChange = type => {
    if (type) {
      setTitle(
        type === "SMSAuthentication"
          ? "Enhanced Security"
          : "Security Checkpoint"
      );
    }
  };

  const handleCancel = ({ confirm = false, message = "manual" } = {}) => {
    const handleLogout = () => {
      if (api?.challenge?.cancelUrl) {
        window.location = api.challenge.cancelUrl;
        return;
      }

      logout({
        returnTo: `${window.location.origin}/logout?loggedOutMessage=${message}`
      });
    };

    if (confirm) {
      showModal({
        title: mfaSecurityMessages.MSG_RB_AUTH_050B_TITLE,
        content: mfaSecurityMessages.MSG_RB_AUTH_050B,
        okButton: { text: "Back" },
        cancelButton: {
          text: "Log out",
          onClick: handleLogout
        }
      });
    } else {
      handleLogout();
    }
  };

  const handleFailure = useCallback(
    (options = {}) => handleCancel({ ...options, message: "unauthorized" }),
    []
  );

  if (!logout) {
    return null;
  }

  if (!api?.challenge?.headers) {
    logout({
      returnTo: `${window.location.origin}/logout?loggedOutMessage=manual`
    });
    return null;
  }

  return (
    <LoginLayout
      title={title}
      leftContent={
        <ChallengeForm
          rsaHeaders={api.challenge.headers}
          className="text-align-center padding-top-20"
          onSuccess={completeLogin}
          onCancel={handleCancel}
          onFailure={handleFailure}
          onChallengeTypeChange={onChallengeTypeChange}
        />
      }
    />
  );
};

export default LoginChallenge;
