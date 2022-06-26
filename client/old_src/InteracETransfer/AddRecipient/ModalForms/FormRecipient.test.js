/* eslint-disable react/prop-types */
import React from "react";
import { Form } from "antd";
import { render, act, fireEvent, screen } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import { manageContactMessage } from "utils/MessageCatalog";
import AddRecipient from "../AddRecipient";
import FormRecipient from "./FormRecipient";
import { AddRecipientContext } from "../AddRecipientProvider";

const RenderWithMockData = ({
  onCancel = () => null,
  onFormFinish = () => null,
  recipientName = null,
  recipientEmail = null
}) => {
  const [addRecipientForm] = Form.useForm();

  if (recipientName && recipientEmail) {
    addRecipientForm.setFieldsValue({
      recipientName,
      recipientEmail
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
                  <FormRecipient form={addRecipientForm} />
                </div>
              )
            },
            onCancel,
            onFormFinish,
            recipientList: [
              {
                aliasName: "existing name",
                notificationPreference: [
                  { notificationHandle: "existing@email.com" }
                ]
              }
            ]
          }
        }}
      >
        <AddRecipient />
      </AddRecipientContext.Provider>
    </RenderWithProviders>
  );
};

describe("Test AddRecipient", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> should render proper data", async () => {
    await act(async () => {
      render(
        <RenderWithMockData
          recipientName="Johann Bach"
          recipientEmail="johann.bach@fakeEmail.com"
        />
      );
    });

    const { findByLabelText } = screen;
    const recipientName = await findByLabelText("Recipient name");
    const recipientEmail = await findByLabelText("Recipient email");
    await act(async () => {
      expect(recipientName.value).toEqual("Johann Bach");
      expect(recipientEmail.value).toEqual("johann.bach@fakeEmail.com");
    });
  });

  it(">> should call onCancel", async () => {
    const onCancel = jest.fn();
    const onFormFinish = jest.fn();
    await act(async () => {
      render(
        <RenderWithMockData
          recipientName="Johann Bach"
          recipientEmail="johann.bach@fakeEmail.com"
          onCancel={onCancel}
          onFormFinish={onFormFinish}
        />
      );
    });
    const { getByRole } = screen;
    const close = getByRole("button", { name: "Close" });
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
          recipientName="Johann Bach"
          recipientEmail="johann.bach@fakeEmail.com"
          onFormFinish={onFormFinish}
          onCancel={onCancel}
        />
      );
    });
    const { getByText } = screen;
    const submitButton = getByText("Next");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(onFormFinish).toBeCalled();
    expect(onCancel).not.toBeCalled();
  });

  it(">> should validate empty name and email", async () => {
    await act(async () => {
      render(<RenderWithMockData />);
    });
    const { getByText, findByText } = screen;
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });

    const emptyNameError = await findByText(manageContactMessage.MSG_RBET_033);
    expect(emptyNameError).toBeVisible();

    const errorMessageEmail = await findByText(
      manageContactMessage.MSG_RBET_010
    );
    expect(errorMessageEmail).toBeVisible();
  });

  it(">> should validate a name with invalid characters", async () => {
    await act(async () => {
      render(
        <RenderWithMockData
          recipientName="Inv@lid_Name#"
          recipientEmail="email@email.com"
        />
      );
    });
    const { findByLabelText, findByText, getByText } = screen;

    const recipientName = await findByLabelText("Recipient name");
    expect(recipientName.value).toEqual("Inv@lid_Name#");

    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });

    const invalidNameError = await findByText(
      manageContactMessage.MSG_RBET_026
    );
    expect(invalidNameError).toBeVisible();
  });

  it(">> should accept email when operational system adds period once the user hits space twice", async () => {
    await act(async () => {
      render(
        <RenderWithMockData
          recipientName="Valid Name"
          recipientEmail="email@email.com"
        />
      );
    });
    const { findByLabelText } = screen;

    const fakeEmail1 = "someone1@atb.com";
    const fakeEmail2 = "someone2@atb.com";

    const email = await findByLabelText("Recipient email");

    await act(async () => {
      fireEvent.blur(email, {
        target: { value: `${fakeEmail1}. ` }
      });
    });
    expect(email.value).toBe(fakeEmail1);

    await act(async () => {
      fireEvent.keyDown(email, {
        key: "Enter",
        target: { value: `${fakeEmail2}  .   ` }
      });
    });
    expect(email.value).toBe(fakeEmail2);
  });

  it(">> should validate a recipient with non unique name and email", async () => {
    await act(async () => {
      render(
        <RenderWithMockData
          recipientName="existing name"
          recipientEmail="existing@email.com"
        />
      );
    });
    const { findByLabelText, findByText, getByText } = screen;

    const recipientName = await findByLabelText("Recipient name");
    expect(recipientName.value).toEqual("existing name");
    const recipientEmail = await findByLabelText("Recipient email");
    expect(recipientEmail.value).toEqual("existing@email.com");

    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });

    const nonUniqueNameError = await findByText(
      manageContactMessage.MSG_RBET_008
    );
    const nonUniqueEmailError = await findByText(
      manageContactMessage.MSG_RBET_008B
    );
    expect(nonUniqueNameError).toBeVisible();
    expect(nonUniqueEmailError).toBeVisible();
  });
});
