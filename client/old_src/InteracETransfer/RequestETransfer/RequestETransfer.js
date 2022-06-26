import { ModalContext } from "Common/ModalProvider";
import { qualtricsIDs } from "globalConstants";
import { requestETransferErrors } from "utils/MessageCatalog";
import { useHistory, useLocation } from "react-router-dom";
import PromptProvider from "Common/PromptProvider";
import React, { Fragment, useState, useEffect, useContext } from "react";
import ReviewAndComplete from "Common/ReviewAndComplete";
import Stepper from "Common/Stepper";
import useAccountHolderName from "utils/hooks/useAccountHolderName";

import checkMarkIcon from "assets/icons/CheckMark/checkmark-green.svg";

import useMoveMoneyAnalytics, {
  moneyMovementType
} from "utils/analytics/useMoveMoneyAnalytics";
import { alertForCancelRequestETransfer } from "./alerts";
import { ETransferContext } from "../ETransferProvider";
import { REQUEST_MONEY_PATH } from "../eTransferConstants";
import RequestETransferComponent from "./RequestETransferForm";

import {
  getRequestEtransferReviewData,
  transformSubmitData
} from "./reviewRequestEtransfer";
import {
  setRequestETransferFormData,
  isRequestETransferEligible
} from "./utils";
import "styles/forms/global.scss";

const RequestETransfer = () => {
  const id = "request-etransfer";
  const [requestETransferSubmit, setRequestETransferSubmit] = useState({});
  const [showForm, setShowForm] = useState(true);
  const [isProfileEnabled, setIsProfileEnabled] = useState(false);
  const location = useLocation();
  const { hash } = location;
  const history = useHistory();
  const moveMoneyAnalytics = useMoveMoneyAnalytics(
    moneyMovementType.E_TRANSFER_REQUEST
  );

  const { request } = useContext(ETransferContext);
  const { onCleanForm } = request;

  const { accountHolderFullName } = useAccountHolderName();
  const [formData, setFormData] = useState({
    withdrawalAccounts: [],
    depositAccounts: [],
    interacLimits: {},
    loading: true,
    legalName: accountHolderFullName
  });

  const modal = useContext(ModalContext);
  const config = {
    url: "/api/atb-rebank-api-etransfers/outgoingmoneyrequest/create/",
    isRSA: true,
    renderMessage: requestETransferErrors.MSG_RBET_013C
  };

  const alertMessage = {
    title: requestETransferErrors.MSG_RBET_014_TITLE,
    errorMessage: requestETransferErrors.MSG_RBET_014,
    buttons: [{ buttonName: "OK", close: true }]
  };

  const clearForm = () => {
    history.push(`${REQUEST_MONEY_PATH}#create`);
    setRequestETransferSubmit({});
    setRequestETransferFormData(
      setFormData,
      setShowForm,
      history,
      modal,
      accountHolderFullName
    );
    onCleanForm();
  };

  const handleSendAnother = () => {
    moveMoneyAnalytics.started();
    clearForm();
  };

  const handleCancelConfirm = () => {
    clearForm();
  };

  const handleCancel = () => {
    alertForCancelRequestETransfer(
      modal,
      requestETransferSubmit,
      handleCancelConfirm
    );
  };

  const handleEdit = editForm => {
    editForm();
  };

  useEffect(() => {
    moveMoneyAnalytics.started();
  }, []);

  useEffect(() => {
    if (hash === "#send") {
      if (window.QSI && window.QSI.API) {
        window.QSI.API.unload();
        window.QSI.API.load();
      }
    }
  }, [hash]);

  useEffect(() => {
    // to prevent re-fetching profile data, false by default
    if (!isProfileEnabled) {
      isRequestETransferEligible(modal, setIsProfileEnabled, history);
    }
    if (isProfileEnabled) {
      setRequestETransferFormData(
        setFormData,
        setShowForm,
        history,
        modal,
        accountHolderFullName
      );
    }
  }, [isProfileEnabled]);

  // to handle direct url access to review page case, redirect user to #create page
  useEffect(() => {
    if (
      location.pathname === REQUEST_MONEY_PATH &&
      hash !== "#create" &&
      Object.keys(requestETransferSubmit).length <= 0
    ) {
      history.replace("#create");
    }
  }, [hash, location.pathname]);

  const renderCreate = (prevTab, nextTab) => (
    <Fragment>
      <RequestETransferComponent
        id={`${id}-create`}
        eTransferData={formData}
        setRequestETransferSubmit={setRequestETransferSubmit}
        nextTab={nextTab}
        persistedData={requestETransferSubmit}
        setFormData={setFormData}
        onReviewAnalytics={formattedData =>
          moveMoneyAnalytics.review({ ...formattedData, ...formData })
        }
      />
    </Fragment>
  );

  const renderReview = (prevTab, nextTab, editForm) => (
    <Fragment>
      <PromptProvider>
        <ReviewAndComplete
          id={`${id}-review`}
          type="review"
          prevTab={() => handleCancel()}
          editButton={() => {
            handleEdit(editForm);
          }}
          nextTab={nextTab}
          // TODO - testing logic like this would be easier by feeding `props` into Page Containers
          labelData={getRequestEtransferReviewData(requestETransferSubmit)}
          config={config}
          dataToPost={transformSubmitData(requestETransferSubmit)}
          failureAlert={() => {
            return alertMessage;
          }}
          buttonNames={{
            sendAnother: "Send another request"
          }}
          onConfirmAnalytics={() =>
            moveMoneyAnalytics.confirm({
              ...requestETransferSubmit,
              ...formData
            })
          }
          onSuccessAnalytics={() =>
            moveMoneyAnalytics.success({
              ...requestETransferSubmit,
              ...formData
            })
          }
          onFailureAnalytics={() =>
            moveMoneyAnalytics.failed({
              ...requestETransferSubmit,
              ...formData
            })
          }
        />
      </PromptProvider>
    </Fragment>
  );

  const renderComplete = () => (
    <Fragment>
      <PromptProvider>
        <div
          className="move-money-complete-label clearfix"
          id={qualtricsIDs.eTransferRequest}
        >
          <img
            className="checkmark-icon"
            alt="Check Mark"
            src={checkMarkIcon}
          />
          <span className="label">{requestETransferErrors.MSG_RBET_013C}</span>
        </div>
        <ReviewAndComplete
          id={`${id}-complete`}
          type="complete"
          labelData={getRequestEtransferReviewData(requestETransferSubmit)}
          prevTab={() => handleSendAnother()}
          config={config}
          failureAlert={() => {
            return alertMessage;
          }}
          className="send-another-transfer"
          buttonNames={{
            sendAnother: "Send another request"
          }}
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

  return <>{showForm && <Stepper id={id} tabs={tabs} onEdit={() => {}} />}</>;
};

export default RequestETransfer;
