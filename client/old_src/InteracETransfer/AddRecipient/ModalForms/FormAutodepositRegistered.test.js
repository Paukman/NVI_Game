/* eslint-disable react/prop-types */
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import React from "react";
import { Form } from "antd";
import { render, act, fireEvent, screen } from "@testing-library/react";
import AddRecipient from "../AddRecipient";
import FormAutodepositRegistered from "./FormAutodepositRegistered";
import { AddRecipientContext } from "../AddRecipientProvider";

const RenderWithMockData = ({
  onCancel = () => null,
  onFormFinish = () => null,
  saveRecipient = false
}) => {
  const [form] = Form.useForm();

  if (saveRecipient) {
    form.setFieldsValue({
      saveRecipient
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
                  <FormAutodepositRegistered form={form} />
                </div>
              ),
              loadingAddRecipient: false
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

describe("Test AddRecipien", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> should render proper data", async () => {
    await act(async () => {
      render(<RenderWithMockData saveRecipient />);
    });

    const { findByRole } = screen;
    const checkbox = await findByRole("checkbox", {
      name: "Save recipient to contacts"
    });

    expect(checkbox).toBeChecked();
  });

  it(">> should call onCancel", async () => {
    const onCancel = jest.fn();
    const onFormFinish = jest.fn();
    await act(async () => {
      render(
        <RenderWithMockData
          saveRecipient
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
          saveRecipient
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
});
