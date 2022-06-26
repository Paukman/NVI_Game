import React, { useState } from "react";
import PropTypes from "prop-types";
import { Skeleton } from "StyleGuide/Components";
import ChooseMethodForm from "./ChooseMethodForm";
import EnterCodeForm from "./EnterCodeForm";
import usePhone from "./usePhone";
import "./styles.less";

const SMSChallenge = ({
  rsaHeaders,
  onSuccess = () => {},
  onFailure = () => {},
  onCancel = () => {},
  forceChallengeQuestion,
  inApp = false
}) => {
  SMSChallenge.propTypes = {
    rsaHeaders: PropTypes.shape({}).isRequired,
    onFailure: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    inApp: PropTypes.bool,
    forceChallengeQuestion: PropTypes.func.isRequired
  };

  const [step, setStep] = useState("METHOD");
  const [selectedMethod, setSelectedMethod] = useState();
  const { loadingPhone, phone, phoneError, fetchPhones } = usePhone({
    rsaHeaders,
    forceChallengeQuestion
  });

  return (
    <Skeleton loading={loadingPhone} sizeMedium className="form-skeleton">
      {step === "METHOD" && (
        <ChooseMethodForm
          rsaHeaders={rsaHeaders}
          onCancel={onCancel}
          phone={phone}
          onSuccess={() => {
            setStep("CODE");
          }}
          setSelectedMethod={setSelectedMethod}
          inApp={inApp}
          phoneError={phoneError}
          fetchPhones={fetchPhones}
        />
      )}
      {step === "CODE" && (
        <EnterCodeForm
          rsaHeaders={rsaHeaders}
          onCancel={onCancel}
          phone={phone}
          method={selectedMethod}
          onSuccess={onSuccess}
          onFailure={onFailure}
          changeMethod={() => {
            setStep("METHOD");
          }}
          inApp={inApp}
        />
      )}
    </Skeleton>
  );
};

export default SMSChallenge;
