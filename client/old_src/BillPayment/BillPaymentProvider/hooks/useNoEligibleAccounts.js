import React, { useContext, useCallback } from "react";
import { billPaymentErrors } from "utils/MessageCatalog";
import { useHistory } from "react-router-dom";
import { ModalContext } from "Common/ModalProvider";

const useNoEligibleAccounts = () => {
  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const history = useHistory();

  const showNoEligibleAccountsAlert = useCallback(() => {
    showModal({
      content: billPaymentErrors.MSG_RBBP_042,
      actions: (
        <button
          type="button"
          className="ui button basic"
          onClick={() => {
            hideModal();
            history.push("/overview");
          }}
        >
          OK
        </button>
      )
    });
  }, [hideModal, history, showModal]);

  return {
    showNoEligibleAccountsAlert,
    hide: hideModal,
    history,
    show: showModal
  };
};

export default useNoEligibleAccounts;
