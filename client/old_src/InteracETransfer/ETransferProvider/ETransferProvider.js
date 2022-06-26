import React, { createContext } from "react";
import PropTypes from "prop-types";
import useRequestETransfer from "../RequestETransfer/hooks/useRequestETransfer";
import useSendETransfer from "../SendETransfer/hooks/useSendETransfer";

export const ETransferContext = createContext();

const ETransferProvider = props => {
  ETransferProvider.propTypes = {
    children: PropTypes.node.isRequired
  };
  const { children } = props;

  const request = useRequestETransfer();
  const send = useSendETransfer();

  return (
    <ETransferContext.Provider
      value={{
        request: {
          requestState: request.requestState,
          onChange: request.onChange,
          onCleanForm: request.onCleanForm,
          handleAddRecipient: request.handleAddRecipient,
          showAddRecipient: request.showAddRecipient
        },
        send: {
          sendState: send.sendState,
          onChange: send.onChange,
          onCleanForm: send.onCleanForm,
          showAddRecipient: send.showAddRecipient,
          validateEmailAddress: send.validateEmailAddress,
          showEditSecurityQuestionAnswer: send.showEditSecurityQuestionAnswer
        }
      }}
    >
      {children}
    </ETransferContext.Provider>
  );
};
export default ETransferProvider;
