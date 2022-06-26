import React, { useState, useEffect, useContext } from "react";

import { manualApiFetch, manualApiSend } from "api";
import { formatName, getLastDigits } from "utils";
import useWindowDimensions from "utils/hooks/useWindowDimensions";
import {
  billPaymentErrors,
  accountAndTransactionSummaryErrors
} from "utils/MessageCatalog";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import useErrorModal from "utils/hooks/useErrorModal";

import useGetRequest from "utils/hooks/useGetRequest";

import { MessageContext } from "StyleGuide/Components";
import { ModalContext } from "Common/ModalProvider";
import { SCHEDULED_PAYMENTS } from "utils/store/storeSchema";

import ColumnList from "Common/ColumnList";

import NoScheduledTransactions from "Common/NoScheduledTransactions";
import Details from "./Details";

import { transformTransactionList } from "./utils";

const ScheduledPayments = () => {
  // TODO - move to billPayments provider
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [viewDetails, setViewDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { show: showMessage } = useContext(MessageContext);
  const { snackbarTop } = useGetSnackbarTop();
  const { show, hide, modalComponent } = useContext(ModalContext);
  const { showErrorModal } = useErrorModal();

  const paymentsUrl = "/api/atb-rebank-api-billpayments/billpayments/";

  const { response: scheduledPayments } = useGetRequest(
    paymentsUrl,
    SCHEDULED_PAYMENTS
  );

  useEffect(() => {
    const { error, data } = scheduledPayments;
    if (error) {
      showErrorModal();
    }
    if (data?.value) {
      setPayments(data.value);
    }
  }, [scheduledPayments]);

  const { width } = useWindowDimensions();

  // TODO - width should be optional, not required for each column
  const defaultHeaders = [
    {
      header: "Payee",
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

  const formatPaymentAccountNames = payment => {
    const fromAccountNumber = payment.payeeAccountNumber
      ? `- (${payment.payeeAccountNumber})`
      : "";

    return {
      fromName: `${formatName({
        nickname: payment.sourceAccountProductNickname,
        name: payment.sourceAccountProductName
      })} (${payment.sourceAccountNumber})`,
      toName: `${formatName({
        nickname: payment.payeeNickname,
        name: payment.payeeName
      })}${fromAccountNumber}`
    };
  };

  const renderSnackMessage = (name, type) => {
    if (type === "One Time Future Dated") {
      return billPaymentErrors.MSG_RBBP_033C(name);
    }

    return billPaymentErrors.MSG_RBBP_033B(name);
  };

  const getPaymentById = id =>
    payments.find(payment => payment.paymentId === id);

  const handleDetailsClick = clickedId => {
    const clickedPayment = getPaymentById(clickedId);
    // slice the payee account number so only last 4 digits show on the details page
    clickedPayment.payeeCustomerReference = getLastDigits(
      clickedPayment.payeeCustomerReference
    );

    setSelectedPayment(clickedPayment);
    setViewDetails(true);
  };

  const showDeleteModal = clickedId => {
    const clickedPayment = getPaymentById(clickedId);

    setSelectedPayment(clickedPayment);
    setShowModal(true);
  };

  const deletePayment = async clickedPaymentId => {
    setShowModal(true);

    try {
      setIsDeleting(true);
      await manualApiSend({
        url: `${paymentsUrl}${clickedPaymentId}?nextPaymentCancellationIndicator=false`,
        keys: SCHEDULED_PAYMENTS,
        verb: "DELETE"
      });

      const newPayments = await manualApiFetch(paymentsUrl, SCHEDULED_PAYMENTS);

      setPayments(newPayments?.value || []);
      setViewDetails(false);
      setSelectedPayment(null);

      showMessage({
        type: "success",
        top: snackbarTop,
        content: renderSnackMessage(
          selectedPayment.payeeNickname || selectedPayment.payeeName,
          selectedPayment.paymentType
        )
      });
    } catch (e) {
      const { toName } = formatPaymentAccountNames(selectedPayment);
      show({
        content: <>{billPaymentErrors.MSG_RBBP_034(toName)}</>,
        modalHeader: billPaymentErrors.MSG_RBBP_034_TITLE,
        actions: (
          <>
            <button
              type="button"
              className="ui button basic"
              onClick={() => hide()}
            >
              OK
            </button>
          </>
        )
      });
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  const noDataState = {
    message: accountAndTransactionSummaryErrors.MSG_REBAS_014C_Payments,
    buttonName: "Schedule new payment",
    buttonAria: "Schedule new payment",
    url: "/move-money/bill-payment/recurring#create"
  };

  const transformedData = transformTransactionList(
    payments,
    handleDetailsClick,
    showDeleteModal,
    width
  );

  const renderDeleteModal = () => {
    if (!selectedPayment) return null;

    const { toName, fromName } = formatPaymentAccountNames(selectedPayment);

    return modalComponent({
      show: showModal,
      content: billPaymentErrors.MSG_RBBP_032_NEW(
        selectedPayment.paymentType,
        fromName,
        toName,
        selectedPayment.amount.value,
        selectedPayment.currency
      ),
      actions: (
        <>
          <button
            type="button"
            className="ui button basic"
            onClick={() => setShowModal(false)}
            id="undefined-modal-test-button-0"
          >
            Back
          </button>
          <button
            type="button"
            className="ui button basic"
            onClick={() => deletePayment(selectedPayment.paymentId)}
            disabled={isDeleting}
            id="undefined-modal-test-button-1"
          >
            Confirm
          </button>
        </>
      )
    });
  };

  const renderScheduled = () => {
    if (
      transformedData.columns.length === 0 &&
      scheduledPayments.loading === false
    ) {
      return (
        <>
          <h3>Scheduled payments</h3>
          <NoScheduledTransactions data={noDataState} />
        </>
      );
    }

    return viewDetails ? (
      <Details
        data={selectedPayment}
        handleDetailsClose={() => setViewDetails(false)}
        handleDeleteModal={() => showDeleteModal(selectedPayment.paymentId)}
      />
    ) : (
      <>
        <h3>Scheduled payments</h3>
        <div className="ui equal width grid middle aligned">
          <ColumnList
            columnData={transformedData}
            defaultHeaders={defaultHeaders}
            loading={scheduledPayments.loading}
          />
        </div>
      </>
    );
  };

  return (
    <div className="move-money-history">
      {renderDeleteModal()}
      {renderScheduled()}
    </div>
  );
};

export default ScheduledPayments;
