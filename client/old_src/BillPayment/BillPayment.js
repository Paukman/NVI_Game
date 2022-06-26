import React, { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import TabMenuSelector from "Common/TabMenuSelector";
import useQualtrics from "utils/hooks/useQualtrics";
import useErrorModal from "utils/hooks/useErrorModal";
import payBillRecurringIcon from "assets/icons/PayBillRecurring/pay-bill-recurring-tab.svg";
import payBillOneTimeIcon from "assets/icons/PayBillOneTime/pay-bill-one-time.svg";
import scheduledPayments from "assets/icons/Scheduled/etransfer-history.svg";
import AddPayeeProvider from "BillPayment/AddPayee";
import AddPayee from "BillPayment/AddPayee/AddPayee";
import { ModalContext } from "Common/ModalProvider";
import { billPaymentErrors } from "utils/MessageCatalog";
import OneTimeBillPayment from "./OneTimeBillPayment/OneTimeBillPayment";
import RecurringBillPayment from "./RecurringPayment/RecurringBillPayment";
import ScheduledPayments from "./ScheduledPayments";
import { BillPaymentContext } from "./BillPaymentProvider";

const BillPayment = () => {
  const [activeTab, setActiveTab] = useState("one-time");
  const location = useLocation();
  const history = useHistory();
  const { handleAddPayee, oneTimeBillPay } = useContext(BillPaymentContext);
  const { state, onPayAnotherBill } = oneTimeBillPay;
  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const { showErrorModal } = useErrorModal();

  const path = location.pathname.split("/");
  const subPagePath = path[3]; // one-time or recurring
  const { error: dataFetchingFailed } = oneTimeBillPay.state;

  const showCrossCurrencyDialog = () => {
    showModal({
      content: billPaymentErrors.MSG_RBBP_015C(),
      actions: (
        <>
          <button type="button" className="ui button basic" onClick={hideModal}>
            Back
          </button>
          <button
            type="button"
            className="ui button basic"
            onClick={async () => {
              onPayAnotherBill();
              history.push(`recurring#create`);
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
    if (index === 1) {
      if (state.isDisplayedToAmount) {
        showCrossCurrencyDialog();
      } else {
        setActiveTab("recurring");
        history.push(`recurring#create`);
      }
    } else if (index === 2) {
      setActiveTab("scheduled-payments");
      history.push("scheduled-payments");
    } else {
      setActiveTab("one-time");
      history.push(`one-time#create`);
    }
  };

  const actionTitleArray = [
    {
      name: "One-time payment",
      class: activeTab === "one-time" ? "active" : "inactive",
      icon: payBillOneTimeIcon
    },
    {
      name: "Recurring payment",
      class: activeTab === "recurring" ? "active" : "inactive",
      icon: payBillRecurringIcon
    },
    {
      name: "Scheduled payments",
      class: activeTab === "scheduled-payments" ? "active" : "inactive",
      icon: scheduledPayments
    }
  ];

  useQualtrics();
  // to handle direct url access
  useEffect(() => {
    if (subPagePath === "one-time") {
      setActiveTab("one-time");
    } else if (subPagePath === "recurring") {
      setActiveTab("recurring");
    } else if (subPagePath === "scheduled-payments") {
      setActiveTab("scheduled-payments");
    }
  }, [actionTitleArray, subPagePath]);

  useEffect(() => {
    if (dataFetchingFailed) {
      showErrorModal();
    }
  }, [dataFetchingFailed]);

  const id = "bill-payment";
  return (
    <div className="sidebar-container" id={`${id}-sidebar-container`}>
      <div className="sidebar-tabs">
        <TabMenuSelector
          id={id}
          title="Move money"
          subTitle="Pay a bill"
          items={actionTitleArray}
          onClick={handleClick}
        />
      </div>
      <div className="sidebar-content">
        {activeTab === "one-time" && <OneTimeBillPayment />}
        {activeTab === "recurring" && <RecurringBillPayment />}
        {activeTab === "scheduled-payments" && <ScheduledPayments />}
      </div>
      {location.hash === "#addPayee" && (
        <AddPayeeProvider
          handleAddPayee={handleAddPayee}
          initialPayee={location.initialPayee}
        >
          <AddPayee />
        </AddPayeeProvider>
      )}
    </div>
  );
};

export default BillPayment;
