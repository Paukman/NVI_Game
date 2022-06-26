import React, { useEffect } from "react";
import { MemoryRouter } from "react-router-dom";
import { render, act } from "@testing-library/react";
import { windowMatchMediaMock } from "utils/TestUtils";

import { Form } from "antd";
import DeclinePage from "./DeclinePage";

const RenderWithHook = () => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      senderName: "John",
      amount: "10",
      beneficiaryMessage: "some message"
    });
  }, [form]);
  return (
    <MemoryRouter>
      <DeclinePage form={form} />
    </MemoryRouter>
  );
};

describe("testing DeclinePage", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it("rendersWith hook", async () => {
    let component;
    await act(async () => {
      component = render(<RenderWithHook />);
    });
    const { findByLabelText, findByText, rerender } = component;
    rerender(<RenderWithHook />);
    const from = await findByLabelText("From");
    const amount = await findByLabelText("Amount");
    await act(async () => {
      expect(from.value).toEqual("John");
      expect(amount.value).toEqual("10");
    });
    await act(async () => {
      const message = await findByText("some message");
      expect(message.value).toEqual("some message");
    });
  });
});
