import { eTransferErrors } from "utils/MessageCatalog";
import { ModalContext, systemErrorAlert } from "Common/ModalProvider";
import { qualtricsIDs } from "globalConstants";
import { useHistory, useLocation } from "react-router-dom";
import AlertModal from "Common/AlertModal";
import PromptProvider from "Common/PromptProvider";
import React, {
  Fragment,
  useState,
  useEffect,
  useContext,
  useCallback
} from "react";
import ReviewAndComplete from "Common/ReviewAndComplete/ReviewAndComplete";
import Stepper from "Common/Stepper";
import useIsMounted from "utils/hooks/useIsMounted";
import checkMarkIcon from "assets/icons/CheckMark/checkmark-green.svg";
import { isEmpty } from "lodash";

import useMoveMoneyAnalytics, {
  moneyMovementType
} from "utils/analytics/useMoveMoneyAnalytics";
import { useEtransferProfile, useRecipients } from "api/hooks";

import CreateETransfer from "./SendETransferForm";
import { ETransferContext } from "../ETransferProvider";
import { SEND_MONEY_PATH } from "../eTransferConstants";

import {
  alertForCancelSendETransfer,
  noRecipientsAlert,
  noInteracProfileAlert
} from "./alerts";

import { transformETransfer, transformSubmitData } from "./transformETransfer";
import { fetchValidationWithoutModal } from "./utils";

import "styles/forms/global.scss";

const ETransfer = () => {
  const id = "etransfer";
  const history = useHistory();
  const location = useLocation();
  const { hash } = location;
  const moveMoneyAnalytics = useMoveMoneyAnalytics(
    moneyMovementType.E_TRANSFER_SEND
  );

  // TODO: Only here until Review is handled
  // eslint-disable-next-line no-unused-vars
  const [etransferSubmit, setETransferSubmit] = useState({});
  const [edit, setEdit] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [alertError, setAlertError] = useState();
  const [showForm, setShowForm] = useState(false);
  const [isShowing, setIsShowing] = useState(true);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const modal = useContext(ModalContext);
  const isMounted = useIsMounted();
  const [formData, setFormData] = useState({
    withdrawalAccounts: [],
    depositAccounts: [],
    interacLimits: {}
  });

  const { send } = useContext(ETransferContext);
  const { onCleanForm } = send;

  const { data: isProfileEnabled } = useEtransferProfile({
    onSuccess: profileEnabled => {
      if (profileEnabled === false) {
        modal.show(noInteracProfileAlert(history, modal));
      }
    },
    onError: () => {
      modal.show(systemErrorAlert(history, modal.hide));
    },
    select: useCallback(data => !!data?.enabled, [])
  });

  const { data: recipients } = useRecipients({
    enabled: !!isProfileEnabled,
    onSuccess: recipientData => {
      if (isEmpty(alertError) && recipientData?.length === 0) {
        setAlertError(noRecipientsAlert(history));
      }
      setFormData(prevState => ({
        ...prevState,
        depositAccounts: recipientData
      }));
    },
    onError: () => {
      modal.show(systemErrorAlert(history, modal.hide));
    }
  });

  const config = {
    url: "/api/atb-rebank-api-etransfers/",
    isRSA: true,
    renderMessage: eTransferErrors.MSG_RBET_013
  };

  const alertMessage = {
    title: eTransferErrors.MSG_RBET_014_TITLE,
    errorMessage: eTransferErrors.MSG_RBET_014,
    buttons: [{ buttonName: "OK", close: true }]
  };

  // TODO - the complete flow here needs to be e2e tested
  // while unit test code coverage here could be achieved, the true outcome of this logic is already handled by children components
  const handleEdit = () => {
    setEdit(true);
  };

  const handleOk = () => {
    setIsShowing(false);
  };

  const handleSendAnotherTransfer = prevTab => {
    moveMoneyAnalytics.started();
    onCleanForm();
    setIsDataUpdated(prevState => !prevState);
    setCancel(true);
    prevTab(true);
  };

  const confirmOnClick = () => {
    history.push(`${SEND_MONEY_PATH}#create`);
    onCleanForm();
    setIsDataUpdated(prevState => !prevState);
    setETransferSubmit({});
  };

  const handleCancelForReview = () => {
    alertForCancelSendETransfer(modal, confirmOnClick, etransferSubmit);
  };

  const handleSubmit = data => {
    setETransferSubmit(data);
    setEdit(false);
    setCancel(false);
    moveMoneyAnalytics.review({ ...data, ...formData });
  };

  useEffect(() => {
    moveMoneyAnalytics.started();
  }, []);

  useEffect(() => {
    if (isProfileEnabled) {
      fetchValidationWithoutModal(
        setAlertError,
        setFormData,
        setShowForm,
        history,
        handleOk,
        modal
      );
    }
  }, [isDataUpdated, isProfileEnabled]);

  useEffect(() => {
    if (hash === "#send") {
      if (window.QSI && window.QSI.API) {
        window.QSI.API.unload();
        window.QSI.API.load();
      }
    }
  }, [hash]);

  // necessary to cancel submission on button press
  useEffect(() => {
    if (!isMounted()) return;
    if (cancel) {
      setEdit(false);
    }
  }, [cancel, isMounted]);

  useEffect(() => {
    if (!isMounted()) return;
    // sets editable state in form if create form was submitted
    if (etransferSubmit.from && !cancel) {
      setEdit(true);
    }
  }, [hash, isMounted]);

  // TODO - Dan - I've never been more confused with form state handling in my life, this entire flow should be re-worked
  const renderCreate = (prevTab, nextTab) => (
    <Fragment>
      <CreateETransfer
        id={`${id}-create`}
        eTransferData={formData}
        setETransferSubmit={handleSubmit}
        nextTab={nextTab}
        persistedData={edit ? etransferSubmit : null}
        showForm={showForm && !!recipients}
        setShowForm={setShowForm}
        setFormData={setFormData}
      />
    </Fragment>
  );
  const renderReview = (prevTab, nextTab, editForm) => (
    <Fragment>
      <PromptProvider>
        <ReviewAndComplete
          id={`${id}-review`}
          type="review"
          prevTab={() => handleCancelForReview()}
          editButton={editForm}
          nextTab={nextTab}
          // TODO - testing logic like this would be easier by feeding `props` into Page Containers
          labelData={transformETransfer(etransferSubmit)}
          config={config}
          dataToPost={transformSubmitData(etransferSubmit)}
          failureAlert={() => {
            return alertMessage;
          }}
          onConfirmAnalytics={() =>
            moveMoneyAnalytics.confirm({ ...etransferSubmit, ...formData })
          }
          onSuccessAnalytics={() =>
            moveMoneyAnalytics.success({ ...etransferSubmit, ...formData })
          }
          onFailureAnalytics={() =>
            moveMoneyAnalytics.failed({ ...etransferSubmit, ...formData })
          }
        />
      </PromptProvider>
    </Fragment>
  );

  const renderComplete = prevTab => (
    <Fragment>
      <PromptProvider>
        <div className="move-money-complete-label clearfix">
          <img
            className="checkmark-icon"
            alt="Check Mark"
            src={checkMarkIcon}
          />
          <span className="label" id={qualtricsIDs.eTransferSend}>
            {eTransferErrors.MSG_RBET_013}
          </span>
        </div>
        <ReviewAndComplete
          id={`${id}-complete`}
          type="complete"
          labelData={transformETransfer(etransferSubmit)}
          prevTab={() => handleSendAnotherTransfer(prevTab)}
          config={config}
          className="send-another-transfer"
        />
      </PromptProvider>
    </Fragment>
  );

  // the title property should be fed to the progress bar to be dynamic
  const tabs = [
    { title: "Create", render: renderCreate },
    { title: "Review", render: renderReview },
    { title: "Complete", render: renderComplete }
  ];

  // forces route back to #create when no data persistence exists
  useEffect(() => {
    if (
      location.pathname === SEND_MONEY_PATH &&
      !etransferSubmit.from &&
      hash !== "#create"
    ) {
      history.replace("#create");
    }
  }, [hash, location.pathname]);

  return (
    <>
      {alertError && (
        <AlertModal
          key={alert.id}
          id="etransfer"
          alertMessage={alertError}
          setShowForm={setShowForm}
          isShowing={isShowing}
        />
      )}
      <Stepper id={id} tabs={tabs} onEdit={handleEdit} />
    </>
  );
};

export default ETransfer;
