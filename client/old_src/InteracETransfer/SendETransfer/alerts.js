import React from "react";
import {
  eTransferErrors,
  transferErrors,
  requestETransferErrors
} from "utils/MessageCatalog";
import { formatCurrency, formatCurrencyInText } from "utils/formatCurrency";

const alertForFailedETransfer = () => {
  return {
    title: eTransferErrors.MSG_RBET_014_TITLE,
    errorMessage: eTransferErrors.MSG_RBET_014,
    buttons: [{ buttonName: "Ok", onClick: true }]
  };
};

const alertForFailedTransfer = failureOptions => {
  return {
    title: transferErrors.MSG_RBTR_005_TITLE,
    errorMessage: transferErrors.MSG_RBTR_005(
      failureOptions.accountName
      // REB-10847 force the shorter variation until actual codes returned from API
      // failureOptions.reason
    ),
    buttons: [{ buttonName: "Ok", close: true }]
  };
};

const alertForCancelSendETransfer = (modal, cancelEvent, etransferSubmit) => {
  return modal.show({
    content: eTransferErrors.MSG_RBET_037(
      formatCurrencyInText(etransferSubmit.from.name),
      etransferSubmit.to.name,
      null,
      formatCurrency(etransferSubmit.amount)
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

export const noEligibleAccountsAlert = handleClick => {
  return {
    errorMessage: requestETransferErrors.MSG_RBET_066,
    id: "no-eligible",
    buttons: [
      {
        buttonName: "Ok",
        onClick: handleClick,
        url: "/overview"
      }
    ]
  };
};

const noInteracProfileAlert = (history, modal) => {
  const idModal = "sendETransfernoInteracProfile";
  return {
    content: eTransferErrors.MSG_RBET_032,
    actions: (
      <>
        <button
          type="button"
          className="ui button basic"
          id={`${idModal}-cancel`}
          onClick={() => {
            history.goBack();
            modal.hide();
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          id={`${idModal}-create-profile`}
          className="ui button basic"
          onClick={() => {
            history.push("/more/interac-preferences/profile/create-profile");
            modal.hide();
          }}
        >
          Create profile
        </button>
      </>
    )
  };
};

const noRecipientsAlert = history => {
  return {
    title: eTransferErrors.MSG_RBET_041_TITLE,
    errorMessage: eTransferErrors.MSG_RBET_041,
    id: "no-recipients",
    buttons: [
      {
        buttonName: "Cancel",
        onClick: history.goBack
      },
      {
        buttonName: "Add recipient",
        url: "/more/manage-contacts/recipients#create"
      }
    ]
  };
};

const dailyLimitReachedAlert = (handleOk, outgoingLimits) => {
  return {
    title: eTransferErrors.MSG_RBET_016_TITLE,
    errorMessage: eTransferErrors.MSG_RBET_016F(
      "send",
      "daily",
      formatCurrency(outgoingLimits.max24HrAmount)
    ),
    buttons: [
      {
        buttonName: "OK",
        onClick: handleOk
      }
    ]
  };
};
const weeklyLimitReachedAlert = outgoingLimits => {
  return {
    title: eTransferErrors.MSG_RBET_016B_TITLE,
    errorMessage: eTransferErrors.MSG_RBET_016B(
      formatCurrency(outgoingLimits.max7DayAmount)
    ),
    buttons: [
      {
        buttonName: "Ok",
        url: "/move-money/send-money"
      }
    ]
  };
};
const monthlyLimitReachedAlert = outgoingLimits => {
  return {
    title: eTransferErrors.MSG_RBET_016C_TITLE,
    errorMessage: eTransferErrors.MSG_RBET_016E(
      formatCurrency(outgoingLimits.max30DayAmount)
    ),
    buttons: [
      {
        buttonName: "Ok",
        url: "/move-money/send-money"
      }
    ]
  };
};
export {
  noInteracProfileAlert,
  noRecipientsAlert,
  dailyLimitReachedAlert,
  weeklyLimitReachedAlert,
  monthlyLimitReachedAlert,
  alertForCancelSendETransfer,
  alertForFailedETransfer,
  alertForFailedTransfer
};
