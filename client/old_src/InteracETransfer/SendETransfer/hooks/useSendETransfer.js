import { useState } from "react";
import api, { etransfersBaseUrl } from "api";
import useErrorModal from "utils/hooks/useErrorModal";

const useSendETransfer = (useErrorModalHook = useErrorModal) => {
  const [sendState, setState] = useState({
    to: "",
    showAddRecipient: false,
    showEditSecurityQuestionAnswer: false
  });
  const { showErrorModal } = useErrorModalHook();

  const validateEmailAddress = async (value, selectedAccount) => {
    const email = selectedAccount.notificationPreference.find(
      pref => pref.notificationHandleType === "Email"
    ).notificationHandle;

    try {
      const { data: result } = await api.post(`${etransfersBaseUrl}/options`, {
        email
      });

      return result[0];
    } catch (e) {
      return showErrorModal();
    }
  };

  const onChange = ({ name, value }) => {
    setState(state => ({
      ...state,
      [name]: value
    }));
  };

  const onCleanForm = () => {
    setState(state => ({
      ...state,
      to: "",
      showAddRecipient: false
    }));
  };

  const showAddRecipient = value => {
    setState(state => ({
      ...state,
      showAddRecipient: value
    }));
  };

  const showEditSecurityQuestionAnswer = value => {
    setState(state => ({
      ...state,
      showEditSecurityQuestionAnswer: value
    }));
  };

  const handleAddRecipient = ({ name, value }) => {
    onChange({ name, value });
  };

  return {
    sendState,
    onChange,
    onCleanForm,
    showAddRecipient,
    handleAddRecipient,
    validateEmailAddress,
    showEditSecurityQuestionAnswer
  };
};

export default useSendETransfer;
