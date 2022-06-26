import React, { createContext } from "react";
import PropTypes from "prop-types";

import useContacts from "./hooks/useContacts";

export const ManageContactsContext = createContext();

const ManageContactsProvider = props => {
  ManageContactsProvider.propTypes = {
    children: PropTypes.node.isRequired
  };

  const {
    recipientToHandle,
    setRecipientToHandle,
    updateRecipient,
    payeeToHandle,
    setPayeeToHandle,
    updatePayee,
    contactsData,
    isLoading,
    setIsLoading,
    pageName,
    setPageName,
    openSnackbar,
    setOpenSnackbar,
    snackbarMessage,
    setSnackbarMessage,
    isAlertShowing,
    setIsAlertShowing,
    alertError,
    getTransferType,
    getApprovedCreditors,
    approvedCreditorsList,
    showAutodeposit,
    setShowAutodeposit,
    mode,
    setMode,
    addRecipient,
    isPosting,
    isProfileEnabled,
    displayNoProfileModal,
    serverErrors,
    clearServerError,
    contacts,
    updateContactState,
    updatePage,
    setLegalName
  } = useContacts();

  const { children } = props;
  return (
    <ManageContactsContext.Provider
      value={{
        contactsInfo: {
          contactsData,
          isLoading,
          setIsLoading,
          isProfileEnabled,
          displayNoProfileModal,
          contacts,
          updateContactState
        },
        page: {
          pageName,
          setPageName,
          mode,
          setMode,
          openSnackbar,
          setOpenSnackbar,
          snackbarMessage,
          setSnackbarMessage,
          isAlertShowing,
          setIsAlertShowing,
          alertError,
          serverErrors,
          clearServerError,
          updatePage
        },
        recipient: {
          recipientToHandle,
          legalName: contacts.legalName,
          setLegalName,
          setRecipientToHandle,
          getTransferType,
          showAutodeposit,
          setShowAutodeposit,
          onSubmit: updateRecipient,
          onAddSubmit: addRecipient,
          isPosting
        },
        payee: {
          payeeToHandle,
          setPayeeToHandle,
          getApprovedCreditors,
          approvedCreditorsList,
          onSubmit: updatePayee,
          isPosting
        }
      }}
    >
      {children}
    </ManageContactsContext.Provider>
  );
};

export default ManageContactsProvider;
