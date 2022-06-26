import React from "react";
import { eTransferErrors, manageContactMessage } from "utils/MessageCatalog";

export const autodepositEnabledMessage = (recipientName, recipientEmail) => {
  return (
    <div className="autodeposit-enabled-message">
      <h3>{manageContactMessage.MSG_RBET_045C_AUTODEPOSIT}</h3>
      <span data-testid="autodeposit-enabled-message">
        {manageContactMessage.MSG_RBET_045C(recipientName, recipientEmail)}
      </span>
    </div>
  );
};

export const autodepositNotRegisteredMessage = () => {
  return (
    <div className="autodeposit-enabled-message">
      <h3>{manageContactMessage.MSG_RBET_045C_AUTODEPOSIT}</h3>
      <span data-testid="autodeposit-not-registered-message">
        {manageContactMessage.MSG_RBET_060B}
      </span>
    </div>
  );
};

export const getNoContactMessage = isPayee => {
  return isPayee
    ? manageContactMessage.MSG_RBET_041
    : eTransferErrors.MSG_RBET_041;
};

export const alertForRecipientSaveSystemError = confirmOnOk => {
  return {
    title: manageContactMessage.MSG_RBET_036F_TITLE,
    errorMessage: manageContactMessage.MSG_RBET_036F,
    id: "system-error",
    buttons: [{ buttonName: "Ok", onClick: confirmOnOk }]
  };
};

export const alertForPayeeSaveSystemError = (confirmOnOk, name) => {
  return {
    title: manageContactMessage.MSG_RBET_036F_TITLE,
    errorMessage: manageContactMessage.MSG_RBBP_024(name),
    id: "system-error",
    buttons: [{ buttonName: "Ok", onClick: confirmOnOk }]
  };
};

export const alertForPayeeCreateSystemError = (confirmOnOk, name) => {
  return {
    title: manageContactMessage.MSG_RBBP_019_TITLE,
    errorMessage: manageContactMessage.MSG_RBBP_019(name),
    id: "system-error",
    buttons: [{ buttonName: "Ok", onClick: confirmOnOk }]
  };
};

export const alertForSystemErrorCreate = confirmOnSysError => {
  return {
    title: manageContactMessage.MSG_RBBP_027_TITLE,
    errorMessage: manageContactMessage.MSG_RBBP_025_UNK,
    id: "system-error",
    buttons: [{ buttonName: "Ok", onClick: confirmOnSysError }]
  };
};

export const invalidEtransferProfile = (history, hide) => {
  return {
    content: eTransferErrors.MSG_RBET_032,
    actions: (
      <>
        <button
          type="button"
          className="ui button basic"
          onClick={() => {
            hide();
          }}
          data-testid="cancel_noprofile"
        >
          Cancel
        </button>
        <button
          type="button"
          className="ui button basic"
          data-testid="create_noprofile"
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
