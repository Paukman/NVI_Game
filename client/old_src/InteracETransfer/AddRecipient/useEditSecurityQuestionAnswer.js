import { useState, useContext } from "react";
import { etransfersBaseUrl } from "api";
import { Form } from "antd";
import useApiWithRSA from "Common/Challenge/useApiWithRSA";
import useIsMounted from "utils/hooks/useIsMounted";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import { MessageContext } from "StyleGuide/Components";
import { AntModalContext } from "StyleGuide/Components/Modal";
import { eTransferErrors } from "utils/MessageCatalog";

import {
  prepareSubmitData,
  EDIT_RECIPIENT_SUCCESS,
  EDIT_RECIPIENT_ERR,
  prepareRecipient,
  handleError,
  getFieldToUpdateAndMessage
} from "./utils";

const useEditSecurityQuestionAnswer = ({
  showEditSecurityQuestionAnswer,
  recipient,
  handleEditRecipient
}) => {
  const [editSecurityQuestionAnswerForm] = Form.useForm();

  const [recipientState, setState] = useState({
    securityQuestion: "",
    securityAnswer: "",
    answerHelpMessage: null,
    questionHelpMessage: null,
    recipientName: recipient?.recipientName,
    recipientEmail: recipient?.recipientEmail,
    recipientId: recipient?.recipientId,
    loadingEditSecurityQuestion: false,
    error: {
      type: null
    }
  });

  const isMounted = useIsMounted();
  const { show: showMessage } = useContext(MessageContext);
  const { show: showModal } = useContext(AntModalContext);
  const { snackbarTop } = useGetSnackbarTop();
  const { put: putRSA } = useApiWithRSA();

  const cleanAll = () => {
    setState(state => ({
      ...state,
      answerHelpMessage: null,
      questionHelpMessage: null,
      recipientName: null,
      recipientEmail: null,
      recipientId: null,
      error: {
        type: null
      }
    }));
    editSecurityQuestionAnswerForm.resetFields();
  };

  const onCancel = () => {
    cleanAll();
    showEditSecurityQuestionAnswer(false); // close it in form
  };

  const onTryAgain = () => {
    cleanAll();
    showEditSecurityQuestionAnswer(true);
  };

  const editSecurityQuestion = async (question, answer) => {
    const submitData = prepareSubmitData({
      recipientState: {
        autodepositRegistered: false,
        recipientName: recipientState.recipientName,
        recipientEmail: recipientState.recipientEmail
      },
      question,
      answer,
      saveRecipient: true
    });

    try {
      setState(state => ({
        ...state,
        loadingEditSecurityQuestion: true
      }));
      await putRSA(
        `${etransfersBaseUrl}/recipients/${recipientState.recipientId}`,
        submitData
      );
      if (!isMounted()) {
        onCancel();
        return null;
      }
      showMessage({
        type: "success",
        top: snackbarTop,
        content: eTransferErrors.MSG_RBET_036D(recipientState.recipientName)
      });
      const editedRecipient = prepareRecipient({
        recipient: {
          name: recipientState.recipientName,
          email: recipientState.recipientEmail,
          recipientId: recipientState.recipientId,
          registered: false,
          oneTimeRecipient: false,
          question
        }
      });
      handleEditRecipient(editedRecipient);
      onCancel();
      setState(state => ({
        ...state,
        loadingEditSecurityQuestion: true
      }));
      return EDIT_RECIPIENT_SUCCESS;
    } catch (error) {
      if (!isMounted()) {
        onCancel();
      }
      showEditSecurityQuestionAnswer(false); // close previous modal
      showModal({
        content: handleError(error),
        title: "System error",
        okButton: { text: "OK", onClick: onCancel }
      });
      return EDIT_RECIPIENT_ERR;
    }
  };

  const onFinish = async values => {
    await editSecurityQuestion(values.securityQuestion, values.securityAnswer);
  };

  const updateHelperText = changedValue => {
    const fieldsToUpdate = getFieldToUpdateAndMessage(changedValue);
    if (fieldsToUpdate) {
      setState(state => ({
        ...state,
        [fieldsToUpdate.field]: fieldsToUpdate.message
      }));
    }
  };

  return {
    recipientState,
    onFinish,
    onCancel,
    editSecurityQuestion,
    showMessage,
    showModal,
    onTryAgain,
    updateHelperText,
    editSecurityQuestionAnswerForm
  };
};

export default useEditSecurityQuestionAnswer;
