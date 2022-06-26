import { useState, useContext } from "react";
import { etransfersBaseUrl } from "api";
import useIsMounted from "utils/hooks/useIsMounted";
import { MessageContext } from "StyleGuide/Components";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import { eTransferErrors } from "utils/MessageCatalog";
import useApiWithRSA from "Common/Challenge/useApiWithRSA";

const useUpdateRecipient = () => {
  const isMounted = useIsMounted();
  const { snackbarTop } = useGetSnackbarTop();
  const { show: showMessage } = useContext(MessageContext);

  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState();
  const { put: putRSA } = useApiWithRSA();

  const getTransferAuthentication = (data, question, answer) => {
    const type = data.defaultTransferAuthentication.authenticationType;
    switch (type) {
      case "Contact Level Security": {
        return {
          authenticationType: 0,
          question,
          answer
        };
      }
      case "None": {
        return {
          authenticationType: 2
        };
      }
      default:
        // TODO determine policy for global catch
        throw new Error();
    }
  };

  const updateRecipient = async (
    data,
    setShowEditModal,
    question,
    answer,
    resetRecipientError
  ) => {
    const formData = {
      registrationName: data.aliasName,
      notificationHandle: data.notificationPreference[0].notificationHandle,
      transferAuthentication: getTransferAuthentication(data, question, answer),
      oneTimeRecipient: data?.oneTimeRecipient || false
    };
    try {
      setIsPosting(true);
      await putRSA(
        `${etransfersBaseUrl}/recipients/${data.recipientId}`,
        formData
      );
      setShowEditModal(false);
      if (isMounted) {
        if (resetRecipientError) resetRecipientError();
        showMessage({
          type: "success",
          top: snackbarTop,
          content: eTransferErrors.MSG_RBET_036D(formData.registrationName)
        });
      }
    } catch (e) {
      setError(e);
    } finally {
      if (isMounted) {
        setIsPosting(false);
      }
    }
  };

  return {
    updateRecipient,
    isPosting,
    error,
    showMessage
  };
};

export default useUpdateRecipient;
