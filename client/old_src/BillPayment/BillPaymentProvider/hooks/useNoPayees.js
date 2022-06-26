import React, { useContext, useCallback } from "react";
import { billPaymentErrors } from "utils/MessageCatalog";
import { useHistory } from "react-router-dom";
import { ModalContext } from "Common/ModalProvider";

const useNoPayees = () => {
  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const history = useHistory();

  const onCancel = useCallback(() => {
    hideModal();
  }, [hideModal]);

  const onAddPayee = useCallback(() => {
    hideModal();
    history.push("/move-money/bill-payment/#addPayee");
  }, [hideModal, history]);

  const showNoPayeesAlert = useCallback(() => {
    return showModal({
      content: billPaymentErrors.MSG_RBBP_037B(),
      actions: (
        <>
          <button type="button" className="ui button basic" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="ui button basic"
            onClick={onAddPayee}
          >
            Add payee
          </button>
        </>
      )
    });
  }, [onAddPayee, onCancel, showModal]);

  return {
    showNoPayeesAlert,
    onAddPayee,
    onCancel,
    hide: hideModal,
    history,
    show: showModal
  };
};

export default useNoPayees;
