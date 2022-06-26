import React, { useEffect, useContext } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import UrlTabMenuSelector from "Common/UrlTabSelector";
import { ModalContext } from "Common/ModalProvider";
import { transferErrors } from "utils/MessageCatalog";
import useErrorModal from "utils/hooks/useErrorModal";
import useResponsive from "utils/hooks/useResponsive";
import OneTimeTransfer from "./OneTimeTransfer/OneTimeTransfer";
import RecurringTransfer from "./RecurringTransfer/RecurringTransfer";
import ScheduledTransfers from "./ScheduledTransfers";
import { TransferContext } from "./TransferProvider/TransferProvider";

import {
  BASE_PATH,
  BASE_PATH_ONE_TIME,
  BASE_PATH_RECURRING,
  BASE_PATH_SCHEDULED_TRANSFERS,
  transferTabItems
} from "./constants";

export const TransferSubView = ({ match }) => {
  switch (match.params.sectionName) {
    case "one-time":
      return <OneTimeTransfer />;
    case "recurring":
      return <RecurringTransfer />;
    case "scheduled-transfers":
      return <ScheduledTransfers />;
    default: {
      return null;
    }
  }
};

export const Transfer = () => {
  const match = useRouteMatch(`${BASE_PATH}/:sectionName`);
  if (!match) return null;
  return <TransferSubView match={match} />;
};

const TransferPage = () => {
  const history = useHistory();
  const { oneTimeTransfer, scheduledTransfer } = useContext(TransferContext);
  const { state, onSendAnotherTransfer } = oneTimeTransfer;

  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const { showErrorModal } = useErrorModal();
  const { error } = oneTimeTransfer.state;
  const { screenIsAtMost } = useResponsive();

  const showCrossCurrencyDialog = () => {
    showModal({
      content: transferErrors.MSG_RBTR_015C(),
      actions: (
        <>
          <button type="button" className="ui button basic" onClick={hideModal}>
            Back
          </button>
          <button
            type="button"
            className="ui button basic"
            onClick={async () => {
              onSendAnotherTransfer();
              history.push(`${BASE_PATH_RECURRING}`);
              hideModal();
            }}
          >
            Continue
          </button>
        </>
      )
    });
  };

  const handleClick = index => {
    switch (index) {
      case 0:
        history.push(`${BASE_PATH_ONE_TIME}`);
        break;
      case 1:
        if (state.isDisplayedToAmount) {
          showCrossCurrencyDialog();
        } else {
          history.push(`${BASE_PATH_RECURRING}`);
        }
        break;
      case 2:
        history.push(`${BASE_PATH_SCHEDULED_TRANSFERS}/list`);
        break;
      default:
        break;
    }
  };

  const showTabbedMenu = () => {
    return !(screenIsAtMost("sm") && scheduledTransfer.isViewingDetails);
  };

  useEffect(() => {
    return history.listen(() => {
      if (window.QSI && window.QSI.API) {
        window.QSI.API.unload();
        window.QSI.API.load();
      }
    });
  }, [history]);

  useEffect(() => {
    if (error) {
      showErrorModal();
    }
  }, [error]);

  return (
    <div className="sidebar-container">
      {showTabbedMenu() && (
        <div className="sidebar-tabs transfer-tab">
          <UrlTabMenuSelector
            title="Move money by"
            subTitle="Transfer between accounts"
            items={transferTabItems}
            onClick={handleClick}
          />
        </div>
      )}
      <div className="sidebar-content sidebar-content-mobile">
        <Transfer />
      </div>
    </div>
  );
};

export default TransferPage;
