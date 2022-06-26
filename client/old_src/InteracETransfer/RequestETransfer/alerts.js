import React from "react";
import { requestETransferErrors, eTransferErrors } from "utils/MessageCatalog";

export const invalidEtransferProfile = (history, hide) => {
  return {
    content: eTransferErrors.MSG_RBET_032,
    actions: (
      <>
        <button
          type="button"
          className="ui button basic"
          onClick={() => {
            history.goBack();
            hide();
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="ui button basic"
          onClick={() => {
            history.push("/more/interac-preferences/profile/create-profile");
            hide();
          }}
        >
          Create profile
        </button>
      </>
    )
  };
};

export const alertForCancelRequestETransfer = (
  modal,
  requestETransferSubmit,
  cancelEvent
) => {
  return modal.show({
    content: requestETransferErrors.MSG_RBET_067(
      requestETransferSubmit.to.name,
      requestETransferSubmit.amount
    ),
    actions: (
      <>
        <button
          type="button"
          className="ui button basic"
          onClick={() => {
            modal.hide();
          }}
        >
          Back
        </button>
        <button
          type="button"
          className="ui button basic"
          onClick={() => {
            cancelEvent();
            modal.hide();
          }}
        >
          Confirm
        </button>
      </>
    )
  });
};

export const noEligibleAccounts = (history, hide) => {
  return {
    content: requestETransferErrors.MSG_RBET_066,
    actions: (
      <>
        <button
          type="button"
          className="ui button basic"
          onClick={() => {
            history.push("/overview");
            hide();
          }}
        >
          OK
        </button>
      </>
    )
  };
};

export const noRecipients = (history, hide) => {
  return {
    content: requestETransferErrors.MSG_RBET_041,
    actions: (
      <>
        <button
          type="button"
          className="ui button basic"
          onClick={() => {
            history.goBack();
            hide();
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="ui button basic"
          onClick={() => {
            history.push("/more/manage-contacts/recipients#create");
            hide();
          }}
        >
          Add recipient
        </button>
      </>
    )
  };
};

export const limitsFailed = (history, hide) => {
  return {
    content: eTransferErrors.MSG_RBET_022,
    actions: (
      <>
        <button
          type="button"
          className="ui button basic"
          onClick={() => {
            history.push("/overview");
            hide();
          }}
        >
          OK
        </button>
      </>
    )
  };
};
