import { useState, useContext } from "react";
import api, { mfaBaseUrl } from "api";
import useIsMounted from "utils/hooks/useIsMounted";
import { MessageContext } from "StyleGuide/Components";
import { mfaSecurityMessages } from "utils/MessageCatalog";

export const verifyCodeURL = `${mfaBaseUrl}/challenges/verifyCode`;
export const forceChallengeURL = `${mfaBaseUrl}/challenges/forceChallenge`;

const useCode = ({
  rsaHeaders,
  onFailure = () => {},
  onSuccess,
  inApp = false
}) => {
  const isMounted = useIsMounted();
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeError, setCodeError] = useState();
  const { show } = useContext(MessageContext);

  const verifyCode = async (values, setCodeFieldErrors) => {
    setVerifyingCode(true);
    setCodeError();
    try {
      const { data } = await api.post(
        verifyCodeURL,
        { verificationCode: values.code },
        { headers: rsaHeaders }
      );
      if (!isMounted()) return;

      if (data?.status === "Success") {
        await onSuccess(data.transactionToken);
      }
      if (data?.status === "ValidationFailed") {
        if (data.isLockedOut) {
          onFailure({ name: "securitychallengefailure", reason: "LOCKED" });
        }
        setCodeFieldErrors(mfaSecurityMessages.MSG_RB_AUTH_022);
      }
      if (data?.status === "VerificationCodeExpired") {
        setCodeFieldErrors(mfaSecurityMessages.MSG_RB_AUTH_023);
      }
    } catch (e) {
      if (e.code === "MFA002") {
        onFailure({ name: "securitychallengefailure", reason: "LOCKED" });
      } else {
        setCodeError(mfaSecurityMessages.MSG_RB_AUTH_044);
      }
    } finally {
      setVerifyingCode(false);
    }
  };

  const sendCode = async (phone, method) => {
    setSendingCode(true);
    setCodeError();
    try {
      const { data } = await api.post(
        forceChallengeURL,
        {
          type: "Login",
          deliveryType: method.value,
          phoneId: phone.id
        },
        { headers: rsaHeaders }
      );
      if (!isMounted()) return false;

      if (data?.asyncAuthenticationStatus === "VerificationCodeSent") {
        if (!inApp) {
          show({
            type: "success",
            content: mfaSecurityMessages.MSG_RB_AUTH_038(phone.name, method.msg)
          });
        }
        return true;
      }
      setCodeError(mfaSecurityMessages.MSG_RB_AUTH_043);
    } catch (e) {
      setCodeError(mfaSecurityMessages.MSG_RB_AUTH_043);
    } finally {
      setSendingCode(false);
    }
    return false;
  };

  return {
    codeError,
    sendCode,
    sendingCode,
    verifyCode,
    verifyingCode
  };
};

export default useCode;
