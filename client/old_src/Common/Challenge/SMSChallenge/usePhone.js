import { useCallback, useEffect, useState } from "react";
import api, { mfaBaseUrl } from "api";
import useIsMounted from "utils/hooks/useIsMounted";
import { mfaSecurityMessages } from "utils/MessageCatalog";

export const phonesURL = `${mfaBaseUrl}/challenges/phones`;

const usePhone = ({ rsaHeaders, forceChallengeQuestion }) => {
  const isMounted = useIsMounted();
  const [loadingPhone, setLoadingPhone] = useState(true);
  const [phone, setPhone] = useState();
  const [phoneError, setPhoneError] = useState();

  const fetchPhones = useCallback(async () => {
    setLoadingPhone(true);
    setPhoneError();
    try {
      const { data } = await api.get(phonesURL, { headers: rsaHeaders });
      if (!isMounted()) return;

      const defaultPhone = data?.phones?.find(p => p.default);
      if (
        !defaultPhone ||
        (!defaultPhone.registeredForIvr && !defaultPhone.registeredForSms)
      ) {
        forceChallengeQuestion();
        return;
      }
      setPhone({
        ...defaultPhone,
        number: `XXX-XXX-${defaultPhone.number.slice(-4)}`
      });
    } catch (e) {
      setPhoneError(mfaSecurityMessages.MSG_RB_AUTH_042);
    } finally {
      if (isMounted()) {
        setLoadingPhone(false);
      }
    }
  }, [rsaHeaders, isMounted, forceChallengeQuestion]);

  useEffect(() => {
    fetchPhones();
  }, [fetchPhones]);

  return {
    loadingPhone,
    phone,
    phoneError,
    fetchPhones
  };
};

export default usePhone;
