/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */

import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api, { getRSAHeaders } from "api";

const IncomingChallenge = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const state = query.get("state");
    const transactionId = query.get("txn");
    const sessionId = query.get("ses");
    const cancelUrl = query.get("cancelUrl");

    const headers = {
      ...getRSAHeaders(),
      "transaction-id": transactionId,
      "session-id": sessionId
    };

    api.setToken(token, {
      headers,
      state,
      cancelUrl
    });

    history.push("/loginChallenge");
  }, []);

  return null;
};

export default IncomingChallenge;
