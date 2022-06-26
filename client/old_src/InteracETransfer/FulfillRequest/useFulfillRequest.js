import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import api, { etransfersBaseUrl } from "api";
import { ModalContext } from "Common/ModalProvider";
import useIsMounted from "utils/hooks/useIsMounted";
import useErrorModal from "utils/hooks/useErrorModal";
import { requestETransferErrors } from "utils/MessageCatalog";
import { fetchValidationWithoutModal } from "../SendETransfer/utils";
import { MoneyRequestStatus } from "./constants";

export default id => {
  const [alertError, setAlertError] = useState();
  const [postData, setPostData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    withdrawalAccounts: [],
    depositAccounts: [],
    interacLimits: {}
  });
  const [fulfilled, setFulfilled] = useState(false);
  const [fulfillRequest, setFulfillRequest] = useState({});
  const modal = useContext(ModalContext);
  const history = useHistory();
  const isMounted = useIsMounted();
  const { showErrorModal } = useErrorModal();

  useEffect(() => {
    const fetchRequestDetail = async () => {
      try {
        const requestDetail = await api.get(
          `${etransfersBaseUrl}/incomingmoneyrequest/${id}`
        );

        if (isMounted() && requestDetail && requestDetail.data) {
          setFulfillRequest({
            data: {
              value: requestDetail.data
            }
          });
          if (
            requestDetail.data.moneyRequestStatus ===
            MoneyRequestStatus.COMPLETED
          ) {
            setFulfilled(true);
          } else {
            fetchValidationWithoutModal(
              setAlertError,
              setFormData,
              setShowForm,
              history,
              () => {
                setAlertError(null);
              },
              modal
            );
          }
        }
      } catch (e) {
        if (isMounted()) {
          setFulfillRequest(null);
          showErrorModal(
            requestETransferErrors.MSG_RBET_014_TITLE,
            requestETransferErrors.MSG_RBET_014
          );
        }
      }
    };
    fetchRequestDetail();
  }, [history, id, isMounted, modal]);

  return {
    fulfillRequest,
    alertError,
    formData,
    showForm,
    fulfilled,
    postData,
    setFulfilled,
    setAlertError,
    setPostData
  };
};
