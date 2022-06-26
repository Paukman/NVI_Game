/* eslint-disable react/prop-types */
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import React from "react";
import { Form } from "antd";
import { render, act, fireEvent, screen } from "@testing-library/react";
import { manageContactMessage } from "utils/MessageCatalog";
import AddRecipient from "../AddRecipient";
import FormSecurityQuestion from "./FormSecurityQuestion";
import { AddRecipientContext } from "../AddRecipientProvider";

const RenderWithMockData = ({
  onCancel = () => null,
  onFormFinish = () => null,
  securityQuestion = null,
  securityAnswer = null
}) => {
  const [form] = Form.useForm();

  if (securityQuestion && securityAnswer) {
    form.setFieldsValue({
      securityQuestion,
      securityAnswer
    });
  }

  return (
    <RenderWithProviders location="/">
      <AddRecipientContext.Provider
        value={{
          addRecipient: {
            state: {
              formToRender: (
                <div>
                  <FormSecurityQuestion form={form} />
                </div>
              )
            },
            onCancel,
            onFormFinish
          }
        }}
      >
        <AddRecipient />
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
      render(
        <RenderWithMockData
          securityQuestion="My question"
          securityAnswer="My answer"
        />
      );
    });

    const { findByLabelText } = screen;
    const securityQuestion = await findByLabelText("Security question");
    const securityAnswer = await findByLabelText("Security answer");
    await act(async () => {
      expect(securityQuestion.value).toEqual("My question");
      expect(securityAnswer.value).toEqual("My answer");
    });
  });

  it(">> should call onCancel", async () => {
    const onCancel = jest.fn();
    const onFormFinish = jest.fn();
    await act(async () => {
      render(
        <RenderWithMockData
          securityQuestion="My question"
          securityAnswer="My answer"
          onCancel={onCancel}
          onFormFinish={onFormFinish}
        />
      );
    });
    const { getByRole } = screen;
    const close = await getByRole("button", { name: "Close" });
    await act(async () => {
      fireEvent.click(close);
    });
    expect(onCancel).toBeCalled();
    expect(onFormFinish).not.toBeCalled();
  });

  it(">> should call onFormFinish", async () => {
    const onCancel = jest.fn();
    const onFormFinish = jest.fn();
    await act(async () => {
      render(
        <RenderWithMockData
          securityQuestion="My question"
          securityAnswer="My answer"
          onFormFinish={onFormFinish}
          onCancel={onCancel}
        />
      );
    });
    const { getByRole } = screen;
    const submitButton = await getByRole("button", { name: "Add recipient" });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(onFormFinish).toBeCalled();
    expect(onCancel).not.toBeCalled();
  });

  it(">> should validate question and answer", async () => {
    await act(async () => {
      render(<RenderWithMockData />);
    });
    const { getByRole, findByText } = screen;
    const submitButton = await getByRole("button", { name: "Add recipient" });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const errorMessageQuestion = await findByText("Enter a security question.");
    await act(async () => {
      expect(errorMessageQuestion).toBeTruthy();
    });

    const errorMessageAnswer = await findByText(
      manageContactMessage.MSG_RBET_005
    );
    await act(async () => {
      expect(errorMessageAnswer).toBeTruthy();
    });
  });

  it(">> should validate same answer and question", async () => {
    await act(async () => {
      render(
        <RenderWithMockData securityQuestion="ABCD" securityAnswer="ABCD" />
      );
    });
    const { getByRole, findByText } = screen;
    const submitButton = await getByRole("button", { name: "Add recipient" });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const errorMessageAnswer = await findByText(
      "Security question and answer can’t match."
    );
    await act(async () => {
      expect(errorMessageAnswer).toBeTruthy();
    });
  });
});
