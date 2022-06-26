import React, { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { ModalContext } from "Common/ModalProvider";
import { manageContactMessage } from "utils/MessageCatalog";
import { getInitialPayeeValues } from "./utils";

const useNonExistingPayee = () => {
  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const history = useHistory();

  const showNonExistingPayeeAlert = useCallback(
    payee =>
      showModal({
        content: manageContactMessage.MSG_RBBP_037C,
        actions: (
          <>
            <button
              type="button"
              className="ui button basic"
              onClick={hideModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="ui button basic"
              onClick={() => {
                hideModal();
                history.push({
                  pathname: "/move-money/bill-payment",
                  hash: "#addPayee",
                  initialPayee: getInitialPayeeValues(payee)
                });
              }}
              id="addPayee"
            >
              Add payee
            </button>
          </>
        )
      }),
    [hideModal]
  );

  return {
    showNonExistingPayeeAlert
  };
};

export default useNonExistingPayee;
