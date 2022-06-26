/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import Stepper from "Common/Stepper";
import { useHistory, useLocation } from "react-router-dom";
import TransferRecurringForm from "./TransferRecurringForm";
import TransferRecurringReview from "./TransferRecurringReview";
import TransferRecurringComplete from "./TransferRecurringComplete";

const Transfer = () => {
  const location = useLocation();
  const { hash } = location;
  const history = useHistory();

  useEffect(() => {
    if (hash === "") {
      history.push("#create");
    }
  }, [hash, history]);

  const renderSingleTransferRecurring = (prevTab, nextTab) => {
    return <TransferRecurringForm nextTab={nextTab} />;
  };

  const renderReview = (prevTab, nextTab) => {
    return <TransferRecurringReview prevTab={prevTab} nextTab={nextTab} />;
  };

  const renderComplete = () => {
    return <TransferRecurringComplete />;
  };

  const tabs = [
    {
      title: "Create",
      render: renderSingleTransferRecurring
    },
    { title: "Review", render: renderReview },
    { title: "Complete", render: renderComplete }
  ];

  return (
    <div className="stepper-padding-status">
      <Stepper
        onEdit={() => {}}
        tabs={tabs}
        id="recurring-transfer"
        className="transfer"
      />
    </div>
  );
};

export default Transfer;
