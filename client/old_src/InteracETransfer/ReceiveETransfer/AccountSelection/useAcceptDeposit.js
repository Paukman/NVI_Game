import React, { useState, useContext } from "react";
import { ModalContext } from "Common/ModalProvider";
import api, { etransfersBaseUrl, manualApiSend } from "api";
import { eTransferErrors, receiveETransferErrors } from "utils/MessageCatalog";
import useIsMounted from "utils/hooks/useIsMounted";

const useAcceptDeposit = onCommit => {
  const [deposit, setState] = useState({
    depositing: false,
    declining: false,
    pageToRender: "AccountSelectionForm",
    error: null
  });
  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const isMounted = useIsMounted();

  const goBack = () => {
    hideModal();
  };

  const onDeposit = async data => {
    const formData = {
      accountId: data.toAccounts,
      beneficiaryMessage: data.beneficiaryMessage
    };
    setState(state => ({
      ...state,
      depositing: true,
      error: null
    }));

    const url = `${etransfersBaseUrl}/incomingetransfers/${data.eTransferId}/accept`;
    try {
      await api.post(url, formData);
      if (!isMounted()) {
        return null;
      }
      setState(state => ({
        ...state,
        depositing: false,
        pageToRender: "ConfirmPage",
        error: null
      }));

      // Unblock PromptProvider to allow page navigation.
      onCommit();

      return null;
    } catch (e) {
      if (!isMounted()) {
        return e;
      }
      setState(state => ({
        ...state,
        error: e,
        depositing: false
      }));
      showModal({
        content: receiveETransferErrors.MSG_RBET_014,
        actions: (
          <button
            type="button"
            className="ui button basic"
            onClick={() => {
              hideModal();
            }}
          >
            OK
          </button>
        )
      });
      return e;
    }
  };

  const onConfirmDecline = async data => {
    hideModal();
    setState(state => ({
      ...state,
      declining: true
    }));
    try {
      await manualApiSend({
        url: `${etransfersBaseUrl}/incomingetransfers/${data.eTransferId}`,
        verb: "DELETE",
        data: {
          declineReason: "declined"
        }
      });
      setState(state => ({
        ...state,
        declining: false,
        pageToRender: "DeclinePage"
      }));

      // Unblock PromptProvider to allow page navigation.
      onCommit();

      return null;
    } catch (e) {
      if (isMounted()) {
        setState(state => ({
          ...state,
          error: e,
          declining: false
        }));
        showModal({
          content: eTransferErrors.MSG_RBET_037D,
          actions: (
            <>
              <button
                type="button"
                className="ui button basic"
                onClick={goBack}
              >
                Try again
              </button>
            </>
          )
        });
      }
      return e;
    }
  };

  const onDecline = data => {
    showModal({
      content: receiveETransferErrors.MSG_RBET_044B(
        data.senderName,
        data.amount
      ),
      actions: (
        <>
          <button type="button" className="ui button basic" onClick={goBack}>
            Cancel
          </button>
          <button
            type="button"
            className="ui button basic"
            onClick={() => onConfirmDecline(data)}
          >
            Confirm
          </button>
        </>
      )
    });
  };

  return {
    deposit,
    onDeposit,
    onDecline,
    onConfirmDecline,
    show: showModal,
    hide: hideModal
  };
};

export default useAcceptDeposit;
