import React from "react";
import { render, queryByText, act, fireEvent } from "@testing-library/react";
import { manageContactMessage } from "utils/MessageCatalog";
import SecurityQuestions from "./SecurityQuestions";

const formId = "request-e-transfer-container";
const securityIconIdQuestion = `#${formId}-security-question-icon`;
const securityIconIdAnswer = `#${formId}-security-answer-icon`;

describe("Security Questions", () => {
  it(">> renders when showQuestions true and showSecurity ", async done => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }));
    const selectedRecipient = {
      aliasName: "test recipient",
      defaultTransferAuthentication: {
        authenticationType: "Contact Level Security",
        question: "Question 123"
      }
    };
    const component = render(
      <SecurityQuestions
        id={formId}
        showQuestions
        showSecurity
        selectedRecipient={selectedRecipient}
        securityQuestion="some question"
        handleUpdateRecipient={() => {}}
        isPosting={false}
      />
    );

    expect(
      component.container.querySelector(".form-label").textContent
    ).toEqual("Security question");

    let icon = component.container.querySelector(securityIconIdQuestion);
    icon = component.container.querySelector(securityIconIdQuestion);
    expect(icon.src).toMatch(/question.svg/i);
    expect(icon.alt).toMatch(/Security question/i);
    icon = component.container.querySelector(securityIconIdAnswer);
    expect(icon.src).toMatch(/answer.svg/i);
    expect(icon.alt).toMatch(/Security answer/i);
    const securityQuestion = queryByText(component.container, /some question/i);
    expect(securityQuestion.textContent).toMatch(/some question/i);
    const editButton = queryByText(component.container, "Edit security info");
    expect(editButton).toBeTruthy();
    act(() => {
      fireEvent.click(editButton);
    });
    // get submit button, question and answer fields
    const saveButton = await component.findByTestId("securityQuestion-save");
    expect(saveButton).toBeTruthy();

    const inputQuestion = await component.findByTestId(
      "securityQuestionModal_question"
    );
    expect(inputQuestion).toBeTruthy();
    const inputAnswer = await component.findByTestId(
      "securityQuestionModal_answer"
    );
    expect(inputAnswer).toBeTruthy();

    // check empty question/answer validation
    await act(async () => {
      fireEvent.click(inputQuestion);
      fireEvent.change(inputQuestion, { target: { value: "" } });
      fireEvent.click(saveButton);
    });
    let errorMessageQuestion = await component.findByText(
      manageContactMessage.MSG_RBET_028
    );
    expect(errorMessageQuestion).toBeTruthy();

    let errorMessageAnswer = await component.findByText(
      manageContactMessage.MSG_RBET_005
    );
    expect(errorMessageAnswer).toBeTruthy();

    // check invalid question/answer validation
    await act(async () => {
      fireEvent.click(inputQuestion);
      fireEvent.change(inputQuestion, { target: { value: "www.abc.com" } });
      fireEvent.click(inputAnswer);
      fireEvent.change(inputAnswer, { target: { value: "12" } });
      fireEvent.click(saveButton);
    });
    errorMessageQuestion = await component.findByText(
      manageContactMessage.MSG_RBET_005B
    );
    expect(errorMessageQuestion).toBeTruthy();

    errorMessageAnswer = await component.findByText(
      manageContactMessage.MSG_RBET_005
    );
    expect(errorMessageAnswer).toBeTruthy();

    // check invalid same question/answer validation
    await act(async () => {
      fireEvent.click(inputQuestion);
      fireEvent.change(inputQuestion, { target: { value: "same" } });
      fireEvent.click(inputAnswer);
      fireEvent.change(inputAnswer, { target: { value: "same" } });
      fireEvent.click(saveButton);
    });
    errorMessageAnswer = await component.findByText(
      manageContactMessage.MSG_RBET_005C
    );
    expect(errorMessageAnswer).toBeTruthy();

    // set question and answer and save
    await act(async () => {
      fireEvent.click(inputQuestion);
      fireEvent.change(inputQuestion, { target: { value: "question" } });
      fireEvent.click(inputAnswer);
      fireEvent.change(inputAnswer, { target: { value: "answer" } });
      fireEvent.click(saveButton);
    });
    done();
  });
  it(">> renders the correct component if showQuestions is false", () => {
    const tempselectedRecipient = { legalName: "Test recipient" };
    const component = render(
      <SecurityQuestions
        id={formId}
        showQuestions={false}
        selectedRecipient={tempselectedRecipient}
        showSecurity
        securityQuestion="some question"
        handleUpdateRecipient={() => {}}
        isPosting={false}
      />
    );
    expect(
      component.container.querySelector(".security-action").innerHTML
    ).toEqual(
      "Test recipient has registered for Autodeposit of funds sent by <em>Interac</em> e-Transfer, so a security question isn't required. This transaction can't be cancelled."
    );
  });
});
