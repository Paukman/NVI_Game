/* eslint-disable react/prop-types */
import React from "react";
import { Skeleton } from "StyleGuide/Components";
import SMSChallenge from "./SMSChallenge";
import QuestionChallengeForm from "./QuestionChallengeForm";
import useChallengeType from "./useChallengeType";
import ChallengeSystemError from "./ChallengeSystemError";

const ChallengeForm = ({
  rsaHeaders,
  onSuccess = () => {},
  onFailure = () => {},
  onCancel = () => {},
  onChallengeTypeChange = () => {},
  inApp = false
}) => {
  const {
    challengeType: { type, error, loading },
    fetchChallengeType,
    forceChallengeQuestion
  } = useChallengeType(rsaHeaders, onChallengeTypeChange);

  return (
    <div className={`margin-top-${inApp ? "6" : "32"}`}>
      <Skeleton loading={loading} sizeMedium className="form-skeleton">
        <ChallengeSystemError
          handleClick={fetchChallengeType}
          loading={loading}
          inApp={inApp}
        >
          {error}
        </ChallengeSystemError>
        {!error &&
          (type === "ChallengeQuestion" ? (
            <QuestionChallengeForm
              rsaHeaders={rsaHeaders}
              onSuccess={onSuccess}
              onFailure={onFailure}
              onCancel={onCancel}
              inApp={inApp}
            />
          ) : (
            <SMSChallenge
              rsaHeaders={rsaHeaders}
              onSuccess={onSuccess}
              onFailure={onFailure}
              onCancel={onCancel}
              forceChallengeQuestion={forceChallengeQuestion}
              inApp={inApp}
            />
          ))}
      </Skeleton>
    </div>
  );
};

export default ChallengeForm;
