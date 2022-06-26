import React, { createContext } from "react";
import PropTypes from "prop-types";
import useAddRecipient from "./useAddRecipient";
import useEditSecurityQuestionAnswer from "./useEditSecurityQuestionAnswer";

export const AddRecipientContext = createContext();

const AddRecipientProvider = props => {
  AddRecipientProvider.propTypes = {
    children: PropTypes.node.isRequired,
    handleAddRecipient: PropTypes.func,
    handleEditRecipient: PropTypes.func,
    showAddRecipient: PropTypes.func,
    showEditSecurityQuestionAnswer: PropTypes.func,
    recipient: PropTypes.shape({}),
    recipientList: PropTypes.arrayOf(
      PropTypes.shape({
        aliasName: PropTypes.string.isRequired,
        notificationPreference: PropTypes.array.isRequired
      })
    )
  };

  AddRecipientProvider.defaultProps = {
    handleAddRecipient: () => null,
    showAddRecipient: () => null,
    showEditSecurityQuestionAnswer: () => null,
    handleEditRecipient: () => null,
    recipient: {}
  };
  const {
    handleAddRecipient,
    handleEditRecipient,
    showAddRecipient,
    showEditSecurityQuestionAnswer,
    recipient,
    children,
    recipientList
  } = props;

  const addRecipient = useAddRecipient({
    handleAddRecipient,
    showAddRecipient
  });

  const editSecurityQuestionAnswer = useEditSecurityQuestionAnswer({
    showEditSecurityQuestionAnswer,
    recipient,
    handleEditRecipient
  });

  return (
    <AddRecipientContext.Provider
      value={{
        addRecipient: {
          state: addRecipient.recipientState,
          onFormFinish: addRecipient.onFormFinish,
          onCancel: addRecipient.onCancel,
          updateHelperText: addRecipient.updateHelperText,
          recipientList
        },
        editSecurityQuestionAnswer: {
          state: editSecurityQuestionAnswer.recipientState,
          onFinish: editSecurityQuestionAnswer.onFinish,
          onCancel: editSecurityQuestionAnswer.onCancel,
          updateHelperText: editSecurityQuestionAnswer.updateHelperText,
          editSecurityQuestionAnswerForm:
            editSecurityQuestionAnswer.editSecurityQuestionAnswerForm
        }
      }}
    >
      {children}
    </AddRecipientContext.Provider>
  );
};
export default AddRecipientProvider;
