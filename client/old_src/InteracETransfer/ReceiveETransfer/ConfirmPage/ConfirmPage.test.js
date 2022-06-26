import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { MemoryRouter } from "react-router-dom";
import { render, act } from "@testing-library/react";
import { windowMatchMediaMock } from "utils/TestUtils";
import { Form } from "antd";
import ConfirmPage from "./ConfirmPage";

const RenderWithHook = ({
  senderName = "John",
  amount = "10",
  beneficiaryMessage = "some message",
  onHandleViewAccountDetails = () => null
}) => {
  RenderWithHook.propTypes = {
    senderName: PropTypes.string,
    amount: PropTypes.string,
    beneficiaryMessage: PropTypes.string,
    onHandleViewAccountDetails: PropTypes.func
  };
  RenderWithHook.defaultProps = {
    senderName: "",
    amount: "",
    beneficiaryMessage: "",
    onHandleViewAccountDetails: () => null
  };
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      senderName,
      amount,
      beneficiaryMessage
    });
  }, []);
  return (
    <MemoryRouter>
      <ConfirmPage
        form={form}
        handleViewAccountDetails={onHandleViewAccountDetails}
      />
    </MemoryRouter>
  );
};

describe("testing ConfirmPage", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it("can load the form values", async () => {
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
    const message = await findByText("some message");
    expect(message.value).toEqual("some message");
  });

  it("can call handleViewAccountDetails", async () => {
    const handleViewAccountDetails = jest.fn();
    let component;
    await act(async () => {
      component = render(
        <RenderWithHook onHandleViewAccountDetails={handleViewAccountDetails} />
      );
    });
    const { findByText } = component;

    const confirmTitle = await findByText("Money accepted");
    await act(async () => {
      expect(confirmTitle).toBeTruthy();
    });
    const viewAccountBtn = await findByText("View account");
    await act(async () => {
      expect(viewAccountBtn).toBeTruthy();
    });

    await act(async () => {
      fireEvent.click(viewAccountBtn);
    });
    await act(async () => {
      expect(handleViewAccountDetails).toHaveBeenCalled();
    });
  });
});
