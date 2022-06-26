/* eslint-disable react/no-typos */
import React, { createContext } from "react";
import PropTypes from "prop-types";
import useProfile from "../../InteracUserProfile/useProfile";
import useReceiveETransfer from "./useReceiveETransfer";

export const ReceiveETransferContext = createContext();

const ReceiveETransferProvider = ({ children, id }) => {
  ReceiveETransferProvider.propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired
  };

  const { profile, goNext } = useProfile();
  const { receiveEState, authenticateTransfer } = useReceiveETransfer(id);

  return (
    <ReceiveETransferContext.Provider
      value={{
        userProfile: {
          profile,
          goNext
        },
        receiveETransfer: {
          receiveEState,
          authenticateTransfer
        }
      }}
    >
      {children}
    </ReceiveETransferContext.Provider>
  );
};

export default ReceiveETransferProvider;
