/* eslint-disable no-unused-vars */
import React, { useEffect, useContext } from "react";
import Stepper from "Common/Stepper";
import { useHistory, useLocation } from "react-router-dom";
import TransferOneTimeForm from "./TransferOneTimeForm";
import TransferOneTimeReview from "./TransferOneTimeReview";
import TransferOneTimeComplete from "./TransferOneTimeComplete";
import { TransferContext } from "../TransferProvider";

const Transfer = () => {
  const { oneTimeTransfer } = useContext(TransferContext);
  const location = useLocation();
  const { hash } = location;
  const history = useHistory();

  useEffect(() => {
    if (hash === "") {
      history.push("#create");
    }
  }, [hash, history]);

  const renderSingleTransferOneTime = (prevTab, nextTab) => {
    return <TransferOneTimeForm nextTab={nextTab} />;
  };

  const renderReview = (prevTab, nextTab) => {
    return <TransferOneTimeReview prevTab={prevTab} nextTab={nextTab} />;
  };

  const renderComplete = () => {
    return <TransferOneTimeComplete />;
  };

  const tabs = [
    {
      title: "Create",
      render: renderSingleTransferOneTime
    },
    { title: "Review", render: renderReview },
    { title: "Complete", render: renderComplete }
  ];

  return (
    <div className="stepper-padding-status">
      <Stepper
        onEdit={() => {}}
        tabs={tabs}
        id="one-time-transfer"
        className="transfer"
      />
    </div>
  );
};

export default Transfer;
