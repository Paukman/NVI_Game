import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { render, act, fireEvent, screen } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import ModalProvider from "Common/ModalProvider";
import { Form } from "antd";
import { PromptContext } from "Common/PromptProvider";
import AccountSelectionForm from "./AccountSelectionForm";
import { AccountSelectionContext } from "./AccountSelectionProvider";

const RenderWithPrepopulatedData = ({
  onFormFinish = () => null,
  onDeposit = () => null,
  onDecline = () => null
}) => {
  RenderWithPrepopulatedData.propTypes = {
    onFormFinish: PropTypes.func,
    onDeposit: PropTypes.func,
    onDecline: PropTypes.func
  };

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      senderName: "John",
      amount: "10",
      beneficiaryMessage: "some message",
      toAccounts: "some one account"
    });
  }, [form]);

  return (
    <RenderWithProviders location="/">
      <ModalProvider>
        <AccountSelectionContext.Provider
          value={{
            receiveEState: {
              receiveMoneyData: {
                senderName: "John",
                eTransferId: "qwert"
              },
              eligibleAccountsFormatted: [
                { key: 1, text: "some one account" },
                { key: 2, text: "some two account" }
              ],
              amountFormatted: "123"
            },
            deposit: {},
            onDeposit,
            onDecline,
            blockLocation: () => null,
            blockClosingBrowser: () => null,
            onCommit: () => null,
            promptState: {},
            onCancel: () => null
          }}
        >
          <Form.Provider onFormFinish={onFormFinish}>
            <AccountSelectionForm handleOnDecline={onDecline} form={form} />
          </Form.Provider>
        </AccountSelectionContext.Provider>
      </ModalProvider>
    </RenderWithProviders>
  );
};

const RenderWithMockData = ({
  onDeposit = () => null,
  onDecline = () => null,
  promptState = {},
  onCommit = () => null,
  onCancel = () => null
}) => {
  RenderWithMockData.propTypes = {
    onDeposit: PropTypes.func,
    onDecline: PropTypes.func,
    promptState: PropTypes.shape({}),
    onCommit: PropTypes.func,
    onCancel: PropTypes.func
  };

  const [form] = Form.useForm();

  return (
    <RenderWithProviders location="/">
      <PromptContext.Provider
        value={{
          promptState,
          onCommit,
          blockLocation: () => null,
          blockClosingBrowser: () => null,
          nextLocation: {},
          onCancel
        }}
      >
        <ModalProvider>
          <AccountSelectionContext.Provider
            value={{
              receiveEState: {
                receiveMoneyData: {
                  senderName: "John",
                  eTransferId: "qwert"
                },
                eligibleAccountsFormatted: [
                  { key: 1, text: "some one account" },
                  { key: 2, text: "some two account" }
                ],
                amountFormatted: "123"
              },
              deposit: {},
              onDeposit,
              onDecline,
              blockLocation: () => null,
              blockClosingBrowser: () => null,
              onCommit,
              promptState,
              onCancel
            }}
          >
            <AccountSelectionForm handleOnDecline={onDecline} form={form} />
          </AccountSelectionContext.Provider>
        </ModalProvider>
      </PromptContext.Provider>
    </RenderWithProviders>
  );
};

describe(">> AccountSelectionForm", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> should render the data in the form ", async () => {
    let component;
    await act(async () => {
      component = render(<RenderWithMockData />);
    });
    const { rerender } = component;
    await act(async () => {
      rerender(<RenderWithMockData />);
    });
    const { getByLabelText, findByLabelText } = screen;
    const from = await findByLabelText("From");
    const amount = await findByLabelText("Amount");
    const accountTo = await findByLabelText("Deposit into");
    const message = await findByLabelText("Message to sender (optional)");
    await act(async () => {
      expect(accountTo.value).toEqual("");
      expect(message.value).toEqual("");
      expect(from.value).toEqual("John");
      expect(amount.value).toEqual("123");
    });
    await act(async () => {
      fireEvent.mouseDown(accountTo);
      fireEvent.change(accountTo, {
        target: { value: "some one account" }
      });
    });
    await act(async () => {
      expect(getByLabelText("Deposit into").value).toEqual("some one account");
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1));
      fireEvent.change(message, {
        target: { value: "thank you" }
      });
    });
    await act(async () => {
      expect(getByLabelText("Message to sender (optional)").value).toEqual(
        "thank you"
      );
    });
  });
  it(">> should display error if account is not selected", async () => {
    let component;
    await act(async () => {
      component = render(<RenderWithMockData />);
    });
    const { rerender } = component;
    await act(async () => {
      rerender(<RenderWithMockData />);
    });
    const { findByLabelText, getByText, findByText, getByLabelText } = screen;
    const from = await findByLabelText("From");
    const amount = await findByLabelText("Amount");
    const accountTo = await findByLabelText("Deposit into");
    const message = getByLabelText("Message to sender (optional)");
    await act(async () => {
      expect(accountTo.value).toEqual("");
      expect(message.value).toEqual("");
      expect(from.value).toEqual("John");
      expect(amount.value).toEqual("123");
    });
    const depositBtn = getByText("Deposit now");
    await act(async () => {
      fireEvent.click(depositBtn);
    });
    const errorMessage = await findByText("Select an account.");
    await act(async () => {
      expect(errorMessage).toBeTruthy();
    });
  });

  it(">> should call decline", async () => {
    const decline = jest.fn();
    let component;
    await act(async () => {
      component = render(<RenderWithPrepopulatedData onDecline={decline} />);
    });
    const { rerender } = component;
    await act(async () => {
      rerender(<RenderWithPrepopulatedData onDecline={decline} />);
    });

    const { getByText } = screen;
    const declineBtn = getByText("Decline");
    await act(async () => {
      fireEvent.click(declineBtn);
    });
    expect(decline).toHaveBeenCalled();
  });
  it(">> can call deposit", async () => {
    const deposit = jest.fn();
    const onFormFinish = jest.fn();
    let component;
    await act(async () => {
      component = render(
        <RenderWithPrepopulatedData
          onDeposit={deposit}
          onFormFinish={onFormFinish}
        />
      );
    });
    const { getByText } = screen;
    const { rerender } = component;
    rerender(
      <RenderWithPrepopulatedData
        onDeposit={deposit}
        onFormFinish={onFormFinish}
      />
    );
    await act(async () => {
      const depositBtn = getByText("Deposit now");
      fireEvent.click(depositBtn);
    });
    await act(async () => {
      expect(onFormFinish).toBeCalled();
    });
  });
  it(">> Should continue blocking user from navigating away if `Deposit Now` is unsuccessful", async () => {
    const onCommit = jest.fn();
    let component;
    await act(async () => {
      component = render(
        <RenderWithMockData
          promptState={{
            blocked: true,
            blockedCloseBrowser: true,
            showModal: false,
            confirm: false
          }}
          onCommit={onCommit}
        />
      );
    });

    const { getByText, findByText } = screen;
    const { rerender } = component;
    await act(async () => {
      rerender(
        <RenderWithMockData
          promptState={{
            blocked: true,
            blockedCloseBrowser: true,
            showModal: false,
            confirm: false
          }}
          onCommit={onCommit}
        />
      );
    });
    const depositBtn = getByText("Deposit now");
    await act(async () => {
      fireEvent.click(depositBtn);
    });
    const errorMessage = await findByText("Select an account.");
    await act(async () => {
      expect(errorMessage).toBeTruthy();
    });

    await act(async () => {
      expect(onCommit).toBeCalledTimes(0);
    });
  });

  it(">> Should continue blocking user from navigating away if `Back` button on modal is clicked", async () => {
    const onCancel = jest.fn();
    let component;
    await act(async () => {
      component = render(
        <RenderWithMockData
          promptState={{
            blocked: true,
            blockedCloseBrowser: true,
            showModal: true,
            confirm: false
          }}
          onCancel={onCancel}
        />
      );
    });

    const { getByText } = screen;
    const { rerender } = component;
    await act(async () => {
      rerender(
        <RenderWithMockData
          promptState={{
            blocked: true,
            blockedCloseBrowser: true,
            showModal: true,
            confirm: false
          }}
          onCancel={onCancel}
        />
      );
    });
    await act(async () => {
      expect(getByText("Cancel deposit?")).toBeTruthy();
    });

    const modalBackButton = getByText("Back");
    await act(async () => {
      fireEvent.click(modalBackButton);
    });

    await act(async () => {
      expect(onCancel).toBeCalledTimes(1);
    });
  });

  it(">> Should allow user to proceed with navigation if `Confirm` button on modal is clicked", async () => {
    const onCommit = jest.fn();
    let component;
    await act(async () => {
      component = render(
        <RenderWithMockData
          promptState={{
            blocked: true,
            blockedCloseBrowser: true,
            showModal: true,
            confirm: false
          }}
          onCommit={onCommit}
        />
      );
    });
    const { rerender } = component;
    await act(async () => {
      rerender(
        <RenderWithMockData
          promptState={{
            blocked: true,
            blockedCloseBrowser: true,
            showModal: true,
            confirm: false
          }}
          onCommit={onCommit}
        />
      );
    });

    const { getByText } = screen;
    await act(async () => {
      expect(getByText("Cancel deposit?")).toBeTruthy();
    });

    const modalConfirmButton = getByText("Confirm");
    await act(async () => {
      fireEvent.click(modalConfirmButton);
    });

    await act(async () => {
      expect(onCommit).toBeCalledTimes(1);
    });
  });
});
