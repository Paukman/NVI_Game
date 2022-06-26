import React from "react";
import { Modal, Divider } from "antd";
import { MessageProvider } from "StyleGuide/Components";
import api, { getRSAHeaders } from "api";
import cross from "assets/icons/Cross/cross.svg";
import { useAuth0 } from "utils/auth0/Auth0Wrapper";

import ChallengeForm from "./ChallengeForm";
import "./styles.less";

const useApiWithRSA = () => {
  const { logout } = useAuth0();

  const handleApiCall = async (method, url, payload) => {
    const options = { headers: getRSAHeaders() };
    const result = await api[method](url, payload, options);

    if (result.status === 230) {
      let resolveIt;
      let rejectIt;
      const promise = new Promise((resolve, reject) => {
        resolveIt = resolve;
        rejectIt = reject;
      });

      try {
        const { deviceTokenCookie, sessionId, transactionId } = result.data;
        const withRSAHeaders = {
          ...options.headers,
          "transaction-id": transactionId,
          "session-id": sessionId,
          "rsa-device-cookie": deviceTokenCookie
        };
        const modal = Modal.confirm({
          className:
            "hide-modal-buttons rebank-modal-form enhanced-security-modal",
          centered: true,
          title: (
            <>
              Enhanced security
              <Divider className="light margin-top-18 margin-bottom-20" />
            </>
          ),
          closable: true,
          closeIcon: <img src={cross} alt="close" />,
          icon: null,
          onCancel: () => {
            modal.destroy();
            rejectIt();
          },
          content: (
            <MessageProvider>
              <ChallengeForm
                rsaHeaders={withRSAHeaders}
                inApp
                onFailure={({ reason } = {}) => {
                  modal.destroy();
                  if (reason === "LOCKED") {
                    logout({
                      returnTo: `${window.location.origin}/logout?loggedOutMessage=unauthorized`
                    });
                  }
                  rejectIt();
                }}
                onSuccess={async transactionToken => {
                  const withRSAHeadersAndToken = {
                    ...withRSAHeaders,
                    "transaction-token": transactionToken
                  };
                  try {
                    const secondResult = await api[method](url, payload, {
                      headers: withRSAHeadersAndToken
                    });
                    resolveIt(secondResult);
                  } catch (e) {
                    rejectIt(e);
                  } finally {
                    modal.destroy();
                  }
                }}
              />
            </MessageProvider>
          )
        });
      } catch (e) {
        rejectIt(e);
      }
      return promise;
    }
    return result;
  };

  const post = async (url, payload) => {
    return handleApiCall("post", url, payload);
  };
  const put = async (url, payload) => {
    return handleApiCall("put", url, payload);
  };

  return {
    post,
    put
  };
};
export default useApiWithRSA;
