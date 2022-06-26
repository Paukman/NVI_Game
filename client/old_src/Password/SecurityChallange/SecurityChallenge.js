/* eslint-disable react/jsx-wrap-multilines */
import React, { useCallback } from "react";
import { useAuth0 } from "utils/auth0/Auth0Wrapper";
import { useHistory } from "react-router-dom";
import LoginLayout from "StyleGuide/Layouts/LoginLayout";
import ChallengeForm from "Common/Challenge/ChallengeForm";

const SecurityChallangePage = () => {
  const history = useHistory();
  const { logout } = useAuth0();
  const getRSAHeaders = () => {
    let geoLocation;

    if (window.RSA_DEVICE) {
      geoLocation = window.RSA_GET_GEO_LOCATION();
    }

    const headers = {
      "requester-user-agent": window.navigator.userAgent,
      "rsa-device": "eyJIYXJkd2FyZUlEIjoiV0VCIiwiR2VvTG9jYXRpb25JbmZvIjoiIn0=",
      "rsa-geo": geoLocation
    };
    return headers;
  };

  const handleCancel = useCallback(
    ({ message = "manual" } = {}) => {
      logout({
        returnTo: `${window.location.origin}/logout?loggedOutMessage=${message}`
      });
    },
    [window.location.origin]
  );

  const handleFailure = useCallback(
    () => handleCancel({ message: "unauthorized" }),
    []
  );

  return (
    <>
      <LoginLayout
        title="Security checkpoint"
        leftContent={
          <ChallengeForm
            onSuccess={transactionToken => {
              history.push({
                pathname: "/password/reset-password",
                transactionToken
              });
            }}
            onCancel={handleCancel}
            onFailure={handleFailure}
            rsaHeaders={getRSAHeaders()}
          />
        }
      />
    </>
  );
};

export default SecurityChallangePage;
