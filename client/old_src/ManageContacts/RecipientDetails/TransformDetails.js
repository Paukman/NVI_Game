import personIcon from "assets/icons/Person/person.svg";
import questionIcon from "assets/icons/Question/question.svg";
import answerIcon from "assets/icons/Answer/answer.svg";
import emailIcon from "assets/icons/Email/email.svg";

export const transformDetails = recipient => {
  let securityQuestionVisibility = false;

  if (recipient.transferType === 0) {
    securityQuestionVisibility = true;
  }

  const recipientDetails = {
    RecipientName: {
      visible: true,
      imageIcon: personIcon,
      title: "Recipient name",
      label: recipient.recipientDetails.aliasName
    },

    RecipientEmail: {
      visible: true,
      imageIcon: emailIcon,
      title: "Recipient email",
      label:
        recipient.recipientDetails.notificationPreference[0].notificationHandle
    },
    SecurityQuestion: {
      visible: securityQuestionVisibility,
      imageIcon: questionIcon,
      title: "Security question",
      label: recipient.recipientDetails.defaultTransferAuthentication.question
    },
    SecurityAnswer: {
      visible: securityQuestionVisibility,
      imageIcon: answerIcon,
      title: "Security answer"
    }
  };
  return recipientDetails;
};
