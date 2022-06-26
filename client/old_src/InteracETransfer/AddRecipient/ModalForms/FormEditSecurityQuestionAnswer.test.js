/* eslint-disable react/prop-types */
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import React from "react";
import { render, act, fireEvent, screen } from "@testing-library/react";
import EditSecurityQuestionAnswerModal from "../EditSecurityQuestionAnswerModal";
import { AddRecipientContext } from "../AddRecipientProvider";

const RenderWithMockData = ({
  onCancel = () => null,
  onFinish = () => null
}) => {
  return (
    <RenderWithProviders location="/">
      <AddRecipientContext.Provider
        value={{
          addRecipient: {},
          editSecurityQuestionAnswer: {
            onFinish,
            onCancel,
            updateHelperText: () => {},
            state: {
              answerHelpMessage: "answerHelpMessage",
              questionHelpMessage: "questionHelpMessage",
              loadingEditSecurityQuestion: false
            }
          }
        }}
      >
        <EditSecurityQuestionAnswerModal />
      </AddRecipientContext.Provider>
    </RenderWithProviders>
  );
};

describe("Test SequrityQuestionForm", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> should render proper data", async () => {
    await act(async () => {
      render(<RenderWithMockData />);
    });

    const { findByLabelText } = screen;
    const securityQuestion = await findByLabelText("Security question");
    const securityAnswer = await findByLabelText("Security answer");

    await act(async () => {
      fireEvent.mouseDown(securityQuestion);
      fireEvent.change(securityQuestion, {
        target: { value: "My question" }
      });
    });
    await act(async () => {
      fireEvent.mouseDown(securityAnswer);
      fireEvent.change(securityAnswer, {
        target: { value: "My answer" }
      });
    });
    await act(async () => {
      expect(securityQuestion.value).toEqual("My question");
    });
    await act(async () => {
      expect(securityAnswer.value).toEqual("My answer");
    });
  });

  it(">> should call onCancel", async () => {
    const onCancel = jest.fn();
    const onFinish = jest.fn();
    await act(async () => {
      render(<RenderWithMockData onCancel={onCancel} onFinish={onFinish} />);
    });
    const { getByRole } = screen;
    const close = await getByRole("button", { name: "Close" });
    await act(async () => {
      fireEvent.click(close);
    });
    expect(onCancel).toBeCalled();
    expect(onFinish).not.toBeCalled();
  });

  it(">> should call onFinish", async () => {
    const onCancel = jest.fn();
    const onFinish = jest.fn();
    await act(async () => {
      render(<RenderWithMockData onFinish={onFinish} onCancel={onCancel} />);
    });
    const { getByRole, findByLabelText } = screen;
    const securityQuestion = await findByLabelText("Security question");
    const securityAnswer = await findByLabelText("Security answer");

    await act(async () => {
      fireEvent.mouseDown(securityQuestion);
      fireEvent.change(securityQuestion, {
        target: { value: "My question" }
      });
    });
    await act(async () => {
      fireEvent.mouseDown(securityAnswer);
      fireEvent.change(securityAnswer, {
        target: { value: "My answer" }
      });
    });
    const submitButton = await getByRole("button", { name: "Save" });
    await act(async () => {
      await fireEvent.click(submitButton);
    });
    expect(onFinish).toBeCalled();
    expect(onCancel).not.toBeCalled();
  });

  it(">> should not proceed on validation errors", async () => {
    const onFinish = jest.fn();
    await act(async () => {
      render(<RenderWithMockData onFinish={onFinish} />);
    });
    const { getByRole } = screen;
    const submitButton = await getByRole("button", { name: "Save" });
    await act(async () => {
      await fireEvent.click(submitButton);
    });

    expect(onFinish).not.toBeCalled();
  });
});
