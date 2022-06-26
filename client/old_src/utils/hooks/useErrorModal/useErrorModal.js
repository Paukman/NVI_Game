import { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Modal } from "antd";
import { eTransferErrors, SYSTEM_ERROR } from "utils/MessageCatalog";

const useErrorModal = () => {
  const history = useHistory();
  let isOpen = false;

  useEffect(() => Modal.destroyAll, []);

  const showErrorModal = useCallback(
    (
      title = SYSTEM_ERROR,
      errorMessage = eTransferErrors.MSG_REBAS_000_CONTENT
    ) => {
      if (!isOpen) {
        Modal.info({
          content: errorMessage,
          title,
          autoFocusButton: null,
          centered: true,
          icon: null,
          okButtonProps: {
            className: "ant-btn-link md-link"
          },
          okType: "link",
          afterClose: () => {
            isOpen = false;
            history.push("/overview");
          }
        });
        isOpen = true;
      }
    },
    []
  );

  return { showErrorModal, closeErrorModal: Modal.destroyAll };
};

export default useErrorModal;
