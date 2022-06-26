import { useState, useEffect } from "react";
import api, { mfaBaseUrl } from "api";
import { Modal } from "antd";

import useIsMounted from "utils/hooks/useIsMounted";
import { authenticationErrors } from "utils/MessageCatalog";

export const challengesQuestionsURL = `${mfaBaseUrl}/challenges/questions`;
export const challengesAnswersURL = `${mfaBaseUrl}/challenges/answers`;

const useQuestionChallenge = ({ rsaHeaders, onSuccess, onFailure }) => {
  const isMounted = useIsMounted();

  const [questionChallenge, setQuestionChallenge] = useState({
    loading: false,
    question: {},
    verifyingAnswer: false,
    error: null
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      if (isMounted()) {
        setQuestionChallenge(state => ({ ...state, loading: true }));
      }
      try {
        // Need to get the list of questions
        const questionResult = await api.get(challengesQuestionsURL, {
          headers: rsaHeaders
        });

        if (!isMounted()) {
          return;
        }
        setQuestionChallenge(state => ({
          ...state,
          question: questionResult?.data?.challengeQuestions?.[0] || {},
          loading: false
        }));
      } catch (e) {
        setQuestionChallenge(state => ({ ...state, loading: false, error: e }));
        Modal.error({
          content: authenticationErrors.MSG_RB_AUTH_047_CONTENT()
        });
      }
    };
    fetchQuestions();
  }, [isMounted, rsaHeaders]);

  const verifyAnswer = async answer => {
    const { question } = questionChallenge;
    setQuestionChallenge(state => ({ ...state, verifyingAnswer: true }));
    try {
      const results = await api.post(
        challengesAnswersURL,
        {
          challengeQuestionId: question.challengeQuestionId,
          challengeAnswer: answer
        },
        { headers: rsaHeaders }
      );
      if (!isMounted()) return false;
      switch (results?.data?.challengeAnswer) {
        case "PASS": {
          await onSuccess(results.data.transactionToken);
          return true;
        }
        case "LOCKED": {
          if (typeof onFailure === "function") {
            onFailure({ name: "securitychallengefailure", reason: "LOCKED" });
          }
          return false;
        }
        default:
          return false;
      }
    } catch (error) {
      setQuestionChallenge(state => ({ ...state, error }));
      return false;
    } finally {
      setQuestionChallenge(state => ({ ...state, verifyingAnswer: false }));
    }
  };

  return {
    verifyAnswer,
    questionChallenge
  };
};

export default useQuestionChallenge;
