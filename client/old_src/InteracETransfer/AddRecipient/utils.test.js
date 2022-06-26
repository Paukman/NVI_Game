import { manageContactMessage, eTransferErrors } from "utils/MessageCatalog";

import {
  validateAnswer,
  validateQuestion,
  prepareSubmitData,
  prepareRecipient,
  handleError,
  isAnswerValid,
  isQuestionValid,
  getFieldToUpdateAndMessage,
  MAX_COUNT_MESSAGE
} from "./utils";

describe("Testing validation", () => {
  it("should throw when answer is invalid", async () => {
    const error = manageContactMessage.MSG_RBET_005;
    try {
      await validateAnswer(null, null);
    } catch (e) {
      expect(e).toEqual(error);
    }
    try {
      await validateAnswer(null, undefined);
    } catch (e) {
      expect(e).toEqual(error);
    }
    try {
      await validateAnswer(null, "");
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  it("should throw when question is invalid", async () => {
    const error = manageContactMessage.MSG_RBET_028;
    try {
      await validateQuestion(null, null);
    } catch (e) {
      expect(e).toEqual(error);
    }
    try {
      await validateQuestion(null, undefined);
    } catch (e) {
      expect(e).toEqual(error);
    }
    try {
      await validateQuestion(null, "");
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  it(">> should test prepareSubmitData", () => {
    const recipientState = {
      recipientName: "Name",
      recipientEmail: "Email",
      saveRecipient: true,
      autodepositRegistered: false
    };

    let res = prepareSubmitData({
      recipientState,
      question: null,
      answer: null,
      saveRecipient: null
    });
    expect(res).toMatchObject({
      notificationHandle: "Email",
      oneTimeRecipient: true,
      registrationName: "Name",
      transferAuthentication: {
        answer: null,
        authenticationType: 0,
        question: null
      }
    });

    res = prepareSubmitData({
      recipientState,
      question: "",
      answer: undefined,
      saveRecipient: false
    });
    expect(res).toMatchObject({
      notificationHandle: "Email",
      oneTimeRecipient: true,
      registrationName: "Name",
      transferAuthentication: {
        answer: null,
        authenticationType: 0,
        question: ""
      }
    });

    const diffState = { ...recipientState, autodepositRegistered: true };
    res = prepareSubmitData({
      recipientState: diffState,
      question: "",
      answer: undefined,
      saveRecipient: true
    });
    expect(res).toMatchObject({
      notificationHandle: "Email",
      oneTimeRecipient: false,
      registrationName: "Name"
    });

    res = prepareSubmitData({
      recipientState,
      question: "Question",
      answer: "Answer",
      saveRecipient: null
    });
    expect(res).toMatchObject({
      notificationHandle: "Email",
      oneTimeRecipient: true,
      registrationName: "Name",
      transferAuthentication: {
        answer: "Answer",
        authenticationType: 0,
        question: "Question"
      }
    });
  });
  it(">> should prepare new recipient properly", () => {
    const recipient = {
      name: "Name",
      email: "Email",
      recipientId: "RecipientID",
      registered: true,
      question: "Question"
    };

    let res = prepareRecipient({ recipient });
    expect(res).toMatchObject({
      aliasName: "Name",
      defaultTransferAuthentication: { authenticationType: "None" },
      notificationPreference: [
        {
          isActive: true,
          notificationHandle: "Email",
          notificationHandleType: "Email"
        }
      ],
      recipientId: "RecipientID"
    });

    const diffRecipient = { ...recipient, registered: false };
    res = prepareRecipient({ recipient: diffRecipient });
    expect(res).toMatchObject({
      aliasName: "Name",
      defaultTransferAuthentication: {
        authenticationType: "Contact Level Security",
        hashType: "SHA2",
        question: "Question"
      },
      notificationPreference: [
        {
          isActive: true,
          notificationHandle: "Email",
          notificationHandleType: "Email"
        }
      ],
      recipientId: "RecipientID"
    });
  });

  it(">> should return proper message for error", () => {
    let res = handleError("");
    expect(res).toEqual(eTransferErrors.MSG_REBAS_000_CONTENT);
    res = handleError(null);
    expect(res).toEqual(eTransferErrors.MSG_REBAS_000_CONTENT);
    res = handleError(undefined);
    expect(res).toEqual(eTransferErrors.MSG_REBAS_000_CONTENT);
    res = handleError({
      response: { data: { message: "Recipient name is not unique." } }
    });
    expect(res).toEqual(manageContactMessage.MSG_RBET_008);
  });

  it(">> should test isAnswerValid", () => {
    let res = isAnswerValid("www");
    expect(res).toEqual(false);
    res = isAnswerValid("www.");
    expect(res).toEqual(false);
    res = isAnswerValid("http");
    expect(res).toEqual(false);
    res = isAnswerValid("https.");
    expect(res).toEqual(false);
    res = isAnswerValid("http.//");
    expect(res).toEqual(false);
    res = isAnswerValid("javascript");
    expect(res).toEqual(false);
    res = isAnswerValid("function");
    expect(res).toEqual(false);
    res = isAnswerValid("return");
    expect(res).toEqual(false);
    res = isAnswerValid(".rrttt");
    expect(res).toEqual(false);
    res = isAnswerValid("Answer@#");
    expect(res).toEqual(false);
    res = isAnswerValid("Correct answer");
    expect(res).toEqual(true);
  });

  it(">> should test isQuestionValid", () => {
    let res = isQuestionValid("www");
    expect(res).toEqual(false);
    res = isQuestionValid("www.");
    expect(res).toEqual(false);
    res = isQuestionValid("http");
    expect(res).toEqual(false);
    res = isQuestionValid("https.");
    expect(res).toEqual(false);
    res = isQuestionValid("http.//");
    expect(res).toEqual(false);
    res = isQuestionValid("javascript");
    expect(res).toEqual(false);
    res = isQuestionValid("function");
    expect(res).toEqual(false);
    res = isQuestionValid("return");
    expect(res).toEqual(false);
    res = isQuestionValid(".rrttt");
    expect(res).toEqual(true);
    res = isQuestionValid("Question@#");
    expect(res).toEqual(true);
    res = isQuestionValid("Correct question");
    expect(res).toEqual(true);
  });

  it(">>should return proper value for getFieldToUpdateAndMessage", () => {
    let res = getFieldToUpdateAndMessage({ recipientName: "Julije Cezar" });
    expect(res).toMatchObject({
      field: "recipientNameHelpMessage",
      message: null
    });
    res = getFieldToUpdateAndMessage({
      recipientName:
        "This is 80 chars xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    });
    expect(res).toMatchObject({
      field: "recipientNameHelpMessage",
      message: MAX_COUNT_MESSAGE
    });

    res = getFieldToUpdateAndMessage({
      recipientEmail: "Julije.Cezar@rome.com"
    });
    expect(res).toMatchObject({
      field: "recipientEmailHelpMessage",
      message: null
    });
    res = getFieldToUpdateAndMessage({
      recipientEmail:
        "This is 64 chars xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    });
    expect(res).toMatchObject({
      field: "recipientEmailHelpMessage",
      message: MAX_COUNT_MESSAGE
    });

    res = getFieldToUpdateAndMessage({
      securityQuestion: "Answer to the Ultimate Question of Life"
    });
    expect(res).toMatchObject({ field: "questionHelpMessage", message: null });

    res = getFieldToUpdateAndMessage({
      securityQuestion: "The Answer to the Ultimate Question of Life"
    });
    expect(res).toMatchObject({
      field: "questionHelpMessage",
      message: MAX_COUNT_MESSAGE
    });

    res = getFieldToUpdateAndMessage({
      securityAnswer: "42"
    });
    expect(res).toMatchObject({ field: "answerHelpMessage", message: null });
    res = getFieldToUpdateAndMessage({
      securityAnswer:
        "4242424242424242424242424242424242424242424242424242424242424242"
    });
    expect(res).toMatchObject({
      field: "answerHelpMessage",
      message: MAX_COUNT_MESSAGE
    });

    res = getFieldToUpdateAndMessage({
      securityAnswer: "123456789012345678901234"
    });
    expect(res).toMatchObject({
      field: "answerHelpMessage",
      message: null
    });

    res = getFieldToUpdateAndMessage({
      garbage: "42"
    });
    expect(res).toEqual(null);
    res = getFieldToUpdateAndMessage(null);
    expect(res).toEqual(null);
    res = getFieldToUpdateAndMessage(undefined);
    expect(res).toEqual(null);
    res = getFieldToUpdateAndMessage("");
    expect(res).toEqual(null);
  });
});
