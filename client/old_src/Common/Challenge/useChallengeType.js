import { useCallback, useState, useEffect } from "react";
import api, { mfaBaseUrl } from "api";
import useIsMounted from "utils/hooks/useIsMounted";
import { mfaSecurityMessages } from "utils/MessageCatalog";

export const challengesURL = `${mfaBaseUrl}/challenges/user`;

const useChallengeType = (rsaHeaders, onChallengeTypeChange = () => {}) => {
  const [challengeType, setChallengeType] = useState({
    type: null,
    error: null,
    loading: true
  });
  const isMounted = useIsMounted();

  const fetchChallengeType = useCallback(async () => {
    setChallengeType(state => ({ ...state, loading: true }));
    try {
      const results = await api.get(challengesURL, { headers: rsaHeaders });
      // Force type useful when manual testings
      // results.data.currentChallengeType = "ChallengeQuestion";
      // results.data.currentChallengeType = "SMSAuthentication";
      if (isMounted()) {
        // We always use ChallengeQuestions if user is exempt from BandChallenges
        const type = results?.data?.exemptFromOutOfBandChallenges
          ? "ChallengeQuestion"
          : results?.data?.currentChallengeType || null;

        setChallengeType(state => ({
          ...state,
          type,
          loading: false,
          error: null
        }));
        onChallengeTypeChange(type);
      }
    } catch (e) {
      setChallengeType(state => ({
        ...state,
        error: mfaSecurityMessages.MSG_RB_AUTH_042,
        loading: false
      }));
    }
  }, [isMounted, rsaHeaders]);

  useEffect(() => {
    fetchChallengeType();
  }, [fetchChallengeType]);

  const forceChallengeQuestion = useCallback(() => {
    setChallengeType({
      type: "ChallengeQuestion",
      error: null,
      loading: false
    });
  }, []);

  return {
    challengeType,
    fetchChallengeType,
    forceChallengeQuestion
  };
};

export default useChallengeType;
