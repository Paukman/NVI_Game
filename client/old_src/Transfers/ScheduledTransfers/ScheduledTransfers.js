import React, { useState, useEffect, useContext } from "react";

import ColumnList from "Common/ColumnList";
import { manualApiFetch, manualApiSend, transfersUrl } from "api";
import useGetRequest from "utils/hooks/useGetRequest";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import { ModalContext } from "Common/ModalProvider";
import { SCHEDULED_TRANSFERS } from "utils/store/storeSchema";
import useErrorModal from "utils/hooks/useErrorModal";
import { MessageContext } from "StyleGuide/Components";
import NoScheduledTransactions from "Common/NoScheduledTransactions";
import {
  accountAndTransactionSummaryErrors,
  transferErrors
} from "utils/MessageCatalog";
import { transformTransferData } from "./utils";
import Details from "./Details";
import { TransferContext } from "../TransferProvider";

const ScheduledTransfers = () => {
  const [scheduledArray, setScheduledArray] = useState([]);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const scheduledTransfersUrl = `${transfersUrl}/transfers/pending`;
  const { scheduledTransfer } = useContext(TransferContext);

  const { show: showMessage } = useContext(MessageContext);
  const { snackbarTop } = useGetSnackbarTop();
  const { show, hide, modalComponent } = useContext(ModalContext);
  const { showErrorModal } = useErrorModal();

  const { response: scheduledTransfers } = useGetRequest(
    scheduledTransfersUrl,
    SCHEDULED_TRANSFERS
  );

  useEffect(() => {
    const { error, data } = scheduledTransfers;

    if (error) {
      showErrorModal();
    }
    if (data?.value) {
      setScheduledArray(data.value);
    }
  }, [scheduledTransfers]);

  const renderSnackMessage = (type, status, name) => {
    if (type.includes("Recurring")) {
      return transferErrors.MSG_RBTR_009B(name);
    }

    if (type.includes("Future Dated")) {
      return transferErrors.MSG_RBTR_009C(name);
    }

    if (type.includes("One Time") && status === "pending") {
      return transferErrors.MSG_RBTR_009(name);
    }

    return null;
  };

  const getTransferById = id =>
    scheduledArray.find(transfer => transfer.transferId === id);

  const formatTransferAccountNames = transfer => ({
    fromName: `${transfer.sourceAccountProductName} (${transfer.sourceAccountNumber})`,
    toName: `${transfer.targetAccountProductName} (${transfer.targetAccountNumber})`
  });

  const handleDetailsClick = clickedId => {
    const clickedTransfer = getTransferById(clickedId);
    if (!clickedTransfer) return;

    scheduledTransfer.setIsViewingDetails(true);
    setSelectedTransfer(clickedTransfer);
  };

  const showDeleteModal = clickedId => {
    const clickedTransfer = getTransferById(clickedId);
    if (!clickedTransfer) return;

    setSelectedTransfer(clickedTransfer);
    setShowModal(true);
  };

  const handleDetailsClose = () => {
    scheduledTransfer.setIsViewingDetails(false);
  };

  const deleteTransfer = async clickedId => {
    const clickedTransfer = getTransferById(clickedId);
    if (!clickedTransfer) return;

    try {
      setIsDeleting(true);
      await manualApiSend({
        url: `${transfersUrl}/${clickedId}`,
        keys: SCHEDULED_TRANSFERS,
        verb: "DELETE"
      });

      const newTransfers = await manualApiFetch(
        scheduledTransfersUrl,
        SCHEDULED_TRANSFERS
      );
      setScheduledArray(newTransfers?.value || []);
      setSelectedTransfer(null);
      scheduledTransfer.setIsViewingDetails(false);

      showMessage({
        type: "success",
        top: snackbarTop,
        content: renderSnackMessage(
          clickedTransfer.paymentType,
          clickedTransfer.status,
          clickedTransfer.targetAccountProductName
        )
      });
    } catch (e) {
      const { toName } = formatTransferAccountNames(clickedTransfer);
      show({
        content: transferErrors.MSG_RBTR_012(toName),
        actions: (
          <button type="button" className="ui button basic" onClick={hide}>
            Try again
          </button>
        ),
        modalClassName: "scheduled modal"
      });
    } finally {
      setShowModal(false);
      setIsDeleting(false);
    }
  };

  const noDataState = {
    message: accountAndTransactionSummaryErrors.MSG_REBAS_014C,
    buttonName: "Schedule new transfer",
    buttonAria: "Schedule new transfer",
    url: "/move-money/transfer-between-accounts/recurring#create"
  };

  const defaultHeaders = [
    {
      header: "To",
      width: {
        widescreen: "three",
        desktop: "five",
        tablet: "four"
      }
    },
    {
      header: "Amount",
      width: {
        widescreen: "three",
        desktop: "two",
        tablet: "two"
      }
    },
    {
      header: "From",
      width: {
        widescreen: "five",
        desktop: "four",
        tablet: "five"
      }
    },
    {
      header: "Next scheduled",
      width: {
        widescreen: "five",
        desktop: "four",
        tablet: "five"
      }
    }
  ];

  const transformedData = transformTransferData(
    scheduledArray,
    handleDetailsClick,
    showDeleteModal
  );

  const renderDeleteModal = () => {
    if (!selectedTransfer) return null;
    const { fromName, toName } = formatTransferAccountNames(selectedTransfer);

    return modalComponent({
      show: showModal,
      content: transferErrors.MSG_RBTR_011(
        fromName,
        toName,
        selectedTransfer.amount.value
      ),
      actions: (
        <>
          <button
            type="button"
            className="ui button basic"
            onClick={() => setShowModal(false)}
          >
            Back
          </button>
          <button
            type="button"
            className="ui button basic"
            onClick={() => deleteTransfer(selectedTransfer.transferId)}
            disabled={isDeleting}
          >
            Confirm
          </button>
        </>
      ),
      modalClassName: "scheduled modal"
    });
  };

  const renderTransfers = () => {
    if (transformedData.columns.length === 0 && !scheduledTransfers.loading) {
      return (
        <>
          <h3>Scheduled transfers</h3>
          <NoScheduledTransactions data={noDataState} />
        </>
      );
    }

    return scheduledTransfer.isViewingDetails ? (
      <Details
        data={selectedTransfer}
        handleDetailsClose={handleDetailsClose}
        handleDeleteModal={() => showDeleteModal(selectedTransfer.transferId)}
      />
    ) : (
      <>
        <h3>Scheduled transfers</h3>
        <div className="ui equal width grid middle aligned">
          <ColumnList
            columnData={transformedData}
            defaultHeaders={defaultHeaders}
            loading={scheduledTransfers.loading}
          />
        </div>
      </>
    );
  };

  return (
    <div className="move-money-history">
      {renderDeleteModal()}
      {renderTransfers()}
    </div>
  );
};

export default ScheduledTransfers;
