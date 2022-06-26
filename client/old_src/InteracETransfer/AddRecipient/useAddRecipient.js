import { useState, useContext } from "react";
import api, { etransfersBaseUrl } from "api";
import { Form } from "antd";
import useApiWithRSA from "Common/Challenge/useApiWithRSA";
import useIsMounted from "utils/hooks/useIsMounted";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import { MessageContext } from "StyleGuide/Components";
import { AntModalContext } from "StyleGuide/Components/Modal";
import { manageContactMessage } from "utils/MessageCatalog";
import { getLegalName } from "utils/getLegalName";
import useContactAnalytics, {
  contactType
} from "utils/analytics/useContactAnalytics";

import {
  ADD_RECIPIENT_FORM,
  SECURITY_QUESTION_FORM,
  AUTODEPOSIT_REGISTERED_FORM,
  prepareSubmitData,
  GetFormToRender,
  AUTODEPOSIT_REGISTERED,
  AUTODEPOSIT_REGISTERED_ERR,
  AUTODEPOSIT_NOT_REGISTERED,
  ADD_RECIPIENT_SUCCESS,
  ADD_RECIPIENT_ERR,
  prepareRecipient,
  handleError,
  getFieldToUpdateAndMessage
} from "./utils";

const useAddRecipient = ({ handleAddRecipient, showAddRecipient }) => {
  const [addRecipientForm] = Form.useForm();
  const [securityQuestionForm] = Form.useForm();
  const [autodepositRegisteredForm] = Form.useForm();
  const [editSecurityQuestionAnswerForm] = Form.useForm();

  const recipientForms = {
    addRecipientForm,
    securityQuestionForm,
    autodepositRegisteredForm
  };

  const [recipientState, setState] = useState({
    formToRender: GetFormToRender(ADD_RECIPIENT_FORM, recipientForms),
    loadingCheckAutodeposit: false,
    loadingAddRecipient: false,
    recipientEmail: null,
    recipientName: null,
    saveRecipient: false,
    securityQuestion: null,
    securityAnswer: null,
    autodepositRegistered: false,
    recipientNameHelpMessage: null,
    recipientEmailHelpMessage: null,
    answerHelpMessage: null,
    questionHelpMessage: null,
    legalName: null,
    error: {
      type: null
    }
  });

  const isMounted = useIsMounted();
  const { post } = useApiWithRSA();
  const { show: showMessage } = useContext(MessageContext);
  const { show: showModal } = useContext(AntModalContext);
  const { snackbarTop } = useGetSnackbarTop();
  const contactAnalytics = useContactAnalytics();

  const cleanAll = () => {
    setState(state => ({
      ...state,
      loadingCheckAutodeposit: false,
      loadingAddRecipient: false,
      formToRender: GetFormToRender(ADD_RECIPIENT_FORM, recipientForms),
      recipientEmail: null,
      recipientName: null,
      saveRecipient: false,
      securityQuestion: null,
      securityAnswer: null,
      autodepositRegistered: false,
      recipientNameMaxCountMessage: null,
      recipientNameHelpMessage: null,
      recipientEmailHelpMessage: null,
      answerHelpMessage: null,
      questionHelpMessage: null,
      error: {
        type: null
      }
    }));
    addRecipientForm.resetFields();
    securityQuestionForm.resetFields();
    autodepositRegisteredForm.resetFields();
  };

  const onCancel = () => {
    cleanAll();
    showAddRecipient(false); // close it in form
  };

  const onTryAgain = () => {
    cleanAll();
    showAddRecipient(true);
  };

  const isAutodepositRegistered = async email => {
    setState(state => ({
      ...state,
      loadingCheckAutodeposit: true
    }));
    try {
      const { data: result } = await api.post(`${etransfersBaseUrl}/options`, {
        email
      });
      if (!isMounted()) {
        onCancel();
        return null;
      }
      const { transferType, customerName } = result[0];
      if (transferType === 2) {
        const legalName = getLegalName(recipientState, customerName);
        setState(state => ({
          ...state,
          legalName,
          loadingCheckAutodeposit: false,
          autodepositRegistered: true,
          formToRender: GetFormToRender(
            AUTODEPOSIT_REGISTERED_FORM,
            recipientForms
          )
        }));
        return AUTODEPOSIT_REGISTERED;
      }
      setState(state => ({
        ...state,
        loadingCheckAutodeposit: false,
        formToRender: GetFormToRender(SECURITY_QUESTION_FORM, recipientForms)
      }));
      return AUTODEPOSIT_NOT_REGISTERED;
    } catch (error) {
      showAddRecipient(false);
      showModal({
        content: handleError(error),
        title: "System error",
        okButton: { text: "OK", onClick: onCancel }
      });
      return AUTODEPOSIT_REGISTERED_ERR;
    }
  };

  const addRecipient = async (question, answer, saveRecipient) => {
    const submitData = prepareSubmitData({
      recipientState,
      question,
      answer,
      saveRecipient
    });

    let result;
    try {
      setState(state => ({
        ...state,
        loadingAddRecipient: true
      }));
      result = await post(`${etransfersBaseUrl}/recipients`, submitData);
      if (!isMounted()) {
        onCancel();
        return null;
      }
      contactAnalytics.contactAdded(contactType.RECIPIENT);
      const messageContent = submitData.oneTimeRecipient
        ? manageContactMessage.MSG_RBET_036C(recipientState.recipientName)
        : manageContactMessage.MSG_RBET_036E(recipientState.recipientName);
      showMessage({
        type: "success",
        top: snackbarTop,
        content: messageContent
      });
      // In the end we don't need to reload data, we just need to show new contact in the list.
      // Once form is restarted (eg. on new request ) it will display or not display new
      // recipient dpending if oneTimeRecipient was flagged.
      const newRecipient = prepareRecipient({
        recipient: {
          name: recipientState.recipientName,
          email: recipientState.recipientEmail,
          recipientId: result.data.recipientId,
          registered: recipientState.autodepositRegistered,
          oneTimeRecipient: submitData.oneTimeRecipient,
          question
        }
      });
      handleAddRecipient(newRecipient);
      onCancel();
      return ADD_RECIPIENT_SUCCESS;
    } catch (error) {
      if (!isMounted()) {
        onCancel();
      } else if (error) {
        showAddRecipient(false); // close previous modal
        showModal({
          content: handleError(error),
          title: "System error",
          okButton: { text: "Try again", onClick: onTryAgain },
          cancelButton: { text: "Cancel", onClick: onCancel }
        });
      } else {
        setState(state => ({
          ...state,
          loadingAddRecipient: false
        }));
      }

      return ADD_RECIPIENT_ERR;
    }
  };

  const onFormFinish = async (name, { forms }) => {
    switch (name) {
      case ADD_RECIPIENT_FORM: {
        setState(state => ({
          ...state,
          recipientEmail: forms[ADD_RECIPIENT_FORM].getFieldValue(
            "recipientEmail"
          ),
          recipientName: forms[ADD_RECIPIENT_FORM].getFieldValue(
            "recipientName"
          )
        }));
        // pass 'recipientName' to the next form if needed
        forms[AUTODEPOSIT_REGISTERED_FORM].setFieldsValue({
          recipientName: forms[ADD_RECIPIENT_FORM].getFieldValue(
            "recipientName"
          )
        });
        // check if email is autodeposit registered
        await isAutodepositRegistered(
          forms[ADD_RECIPIENT_FORM].getFieldValue("recipientEmail")
        );
        return null;
      }
      case AUTODEPOSIT_REGISTERED_FORM: {
        await addRecipient(
          null,
          null,
          forms[AUTODEPOSIT_REGISTERED_FORM].getFieldValue("saveRecipient")
        );
        return null;
      }
      case SECURITY_QUESTION_FORM: {
        await addRecipient(
          forms[SECURITY_QUESTION_FORM].getFieldValue("securityQuestion"),
          forms[SECURITY_QUESTION_FORM].getFieldValue("securityAnswer"),
          forms[SECURITY_QUESTION_FORM].getFieldValue("saveRecipient")
        );
        return null;
      }
      default: {
        return null;
      }
    }
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
    isAutodepositRegistered,
    onFormFinish,
    onCancel,
    addRecipient,
    recipientForms,
    showMessage,
    showModal,
    onTryAgain,
    updateHelperText,
    editSecurityQuestionAnswerForm
  };
};

export default useAddRecipient;
