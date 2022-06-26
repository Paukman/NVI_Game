import React, { useEffect } from "react";
import Stepper from "Common/Stepper";
import { useHistory, useLocation } from "react-router-dom";
import BillPaymentRecurringForm from "./BillPaymentRecurringForm";
import BillPaymentRecurringReview from "./BillPaymentRecurringReview";
import BillPaymentRecurringComplete from "./BillPaymentRecurringComplete";

const BillPayment = () => {
  const location = useLocation();
  const { hash } = location;
  const history = useHistory();

  useEffect(() => {
    if (hash === "") {
      history.push("#create");
    }
  }, [hash, history]);

  const renderCreateRecurringBillPayment = (prevTab, nextTab) => {
    return <BillPaymentRecurringForm nextTab={nextTab} />;
  };

  const renderReview = (prevTab, nextTab) => {
    return <BillPaymentRecurringReview prevTab={prevTab} nextTab={nextTab} />;
  };

  const renderComplete = () => {
    return <BillPaymentRecurringComplete />;
  };

  const tabs = [
    {
      title: "Create",
      render: renderCreateRecurringBillPayment
    },
    { title: "Review", render: renderReview },
    { title: "Complete", render: renderComplete }
  ];

  return (
    <div className="stepper-padding-status">
      <Stepper
        onEdit={() => {}}
        tabs={tabs}
        id="bill-payment-recurring"
        className="bill-payment"
      />
    </div>
  );
};

export default BillPayment;
