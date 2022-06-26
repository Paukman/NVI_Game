/* eslint-disable no-unused-vars */
import React, { useEffect, useContext } from "react";
import Stepper from "Common/Stepper";

import { useHistory, useLocation } from "react-router-dom";
import BillPaymentOneTimeForm from "./BillPaymentOneTimeForm";
import BillPaymentOneTimeReview from "./BillPaymentOneTimeReview";
import BillPaymentOneTimeComplete from "./BillPaymentOneTimeComplete";

const BillPayment = () => {
  const location = useLocation();
  const { hash } = location;
  const history = useHistory();

  useEffect(() => {
    if (hash === "") {
      history.push("#create");
    }
  }, [hash, history]);

  const renderSinglePaymentOneTime = (prevTab, nextTab) => {
    return <BillPaymentOneTimeForm type="create" nextTab={nextTab} />;
  };

  const renderReview = (prevTab, nextTab) => {
    return <BillPaymentOneTimeReview prevTab={prevTab} nextTab={nextTab} />;
  };

  const renderComplete = () => {
    return <BillPaymentOneTimeComplete />;
  };

  const tabs = [
    {
      title: "Create",
      render: renderSinglePaymentOneTime
    },
    { title: "Review", render: renderReview },
    { title: "Complete", render: renderComplete }
  ];

  return (
    <div className="stepper-padding-status">
      <Stepper
        onEdit={() => {}}
        tabs={tabs}
        id="one-time-bill-payment"
        className="bill-payment"
      />
    </div>
  );
};

export default BillPayment;
