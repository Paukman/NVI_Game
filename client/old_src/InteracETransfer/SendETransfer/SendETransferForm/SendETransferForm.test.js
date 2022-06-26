import React from "react";
import { act, fireEvent, screen } from "@testing-library/react";
import { mockApiData, formatIconSrc, renderWithClient } from "utils/TestUtils";
import ReactRouter from "react-router";
import * as ReactHookForm from "react-hook-form";
import { etransfersBaseUrl } from "api";
import { eTransferLimitsPassing } from "InteracETransfer/InteracETransfer.testdata";
import { eTransferDataMock } from "InteracETransfer/validatorsTestData";
import SendETransferForm from "./index";
import { ETransferContext } from "../../ETransferProvider";

const emailEligibleData = [
  {
    transferType: 0,
    senderAccountIdentifierRequired: 0
  }
];

const persistedData = {
  from: {
    id: "33ZFwIxk3ZebPZZx1bDHj13qc_cl-x7xEjlFolGtxSA",
    name: "bulma"
  },
  to: { id: "CAhGbyStTDEs", name: "goku" },
  securityQuestion: "randomquestion",
  amount: "12",
  message: "randommessage"
};

const props = {
  id: "transfer",
  eTransferData: eTransferDataMock,
  setETransferSubmit: () => {},
  nextTab: () => {},
  validateDepositor: () => {},
  setShowForm: () => {},
  showForm: true,
  persistedData,
  isDataUpdated: true,
  setIsDataUpdated: () => {},
  setFormData: () => {}
};

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

const RenderWithMockData = () => {
  return (
    <ETransferContext.Provider
      value={{
        request: {},
        send: {
          sendState: {},
          onChange: () => {},
          validateEmailAddress: () => {}
        }
      }}
    >
      <SendETransferForm {...props} />
    </ETransferContext.Provider>
  );
};

describe("Testing SendEtransferForm component", () => {
  it(">> should show a skeleton while loading.", async () => {
    await act(async () => {
      renderWithClient(
        <ETransferContext.Provider
          value={{
            request: {},
            send: {
              sendState: {},
              onChange: jest.fn(),
              validateEmailAddress: jest.fn()
            }
          }}
        >
          <SendETransferForm {...props} showForm={false} />
        </ETransferContext.Provider>
      );
    });
    const { getByTestId } = screen;
    const skeleton = getByTestId("send-etransfer-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it(">> it should render elements", async () => {
    const { container } = renderWithClient(<RenderWithMockData />);
    await act(async () => {});
    expect(container.querySelector("#transfer-from-label").toExist);
    expect(container.querySelector("#transfer-from-icon").toExist);
    expect(container.querySelector("#transfer-from-select").toExist);
    expect(container.querySelector("#transfer-down-arrow-icon").toExist);
    expect(container.querySelector("#transfer-to-label").toExist);
    expect(container.querySelector("#transfer-to-icon").toExist);
    expect(container.querySelector("#transfer-to-select").toExist);
    expect(container.querySelector("#transfer-amount-label").toExist);
    expect(container.querySelector("#transfer-amount-icon").toExist);
    expect(container.querySelector("#transfer-message-label").toExist);
    expect(container.querySelector("#transfer-message-icon").toExist);
  });

  it(">> it should update the Message counter", async () => {
    const props1 = {
      ...props,
      persistedData: { ...persistedData, message: "" }
    };
    const { container } = renderWithClient(
      <ETransferContext.Provider
        value={{
          request: {},
          send: {
            sendState: {},
            onChange: () => {},
            validateEmailAddress: () => {}
          }
        }}
      >
        <SendETransferForm {...props1} />
      </ETransferContext.Provider>
    );
    const messageCounter = container.querySelector("#transfer-memo-counter");
    expect(messageCounter.innerHTML).toEqual("0/400");
    const messageTextArea = container.querySelector("#transfer-memo-textarea");
    await act(async () => {
      fireEvent.change(messageTextArea, { target: { value: "hey!" } });
    });

    expect(messageCounter.innerHTML).toEqual("4/400");
  });

  it(">> it should format Amount Currency", async () => {
    const { container } = renderWithClient(<RenderWithMockData />);
    const amount = container.querySelector("#transfer-amount-input");

    await act(async () => {
      fireEvent.change(amount, { target: { value: "1234.12" } });
    });
    // TODO: when proper component is used, validate currency formatting
    // TODO: Jest does not seem to trigger the onBlur properly
    const amount2 = container.querySelector("#transfer-amount-input");
    expect(amount2.value).toEqual("1234.12");
  });

  it(">> it should not allow negative values for currency", async () => {
    const { container } = renderWithClient(<RenderWithMockData />);
    const amount = container.querySelector("#transfer-amount-input");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "-4.12" } });
    });
    const positiveAmount = container.querySelector("#transfer-amount-input");
    expect(positiveAmount.value).toEqual("");
  });

  it(">> it should render error messages when missing input", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/options`,
        method: "POST",
        data: { email: "1+1@1.com" },
        results: [{ transferType: 2 }]
      }
    ]);
    const props1 = { ...props, persistedData: {} };
    const { container } = renderWithClient(
      <ETransferContext.Provider
        value={{
          request: {},
          send: {
            sendState: {},
            onChange: () => {},
            validateEmailAddress: () => {}
          }
        }}
      >
        <SendETransferForm {...props1} />
      </ETransferContext.Provider>
    );
    const button = container.querySelector("#form-submit-button");
    await act(async () => {
      button.click();
    });
    const fromSelectError = container.querySelector("#from-error");
    expect(fromSelectError.innerHTML).toEqual("Select an account.");
    const toSelectError = container.querySelector("#to-error");
    expect(toSelectError.innerHTML).toEqual("Select a recipient.");
    const amountMissingError = container.querySelector("#amount-error");
    expect(amountMissingError.innerHTML).toEqual("Enter an amount.");
  });

  it(">> it should not display an error on submit when recipient is SHA2 compliant ", async () => {
    // TODO: move to single definition
    mockApiData([
      {
        url: `${etransfersBaseUrl}/options`,
        method: "POST",
        data: { email: "faketesting@atb.com" },
        results: [{ transferType: 2 }]
      }
    ]);
    const { container, getByText } = renderWithClient(<RenderWithMockData />);
    await act(async () => {
      fireEvent.click(getByText("Aaaron A (Ash) (faketesting@atb.com)"));
    });
    const encryptionError = container.querySelector("#to-error");
    expect(encryptionError.innerHTML).toEqual("");
  });

  it(">> it should display question / answer modal", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/options/def@atb.com`,
        results: [
          {
            transferType: 0
          }
        ]
      }
    ]);
    const {
      container,
      getByText,
      getByTestId,
      getAllByText
    } = renderWithClient(<RenderWithMockData />);
    await act(async () => {});

    // select withdrawal
    fireEvent.click(getByText("Basic Account (4779) | $44,993.65"));
    await act(async () => {});

    // select deposit
    await act(async () => {
      fireEvent.click(getByText("abc (def@atb.com)"));
    });

    const amount = container.querySelector("#transfer-amount-input");
    fireEvent.change(amount, { target: { value: "480000" } });
    await act(async () => {});

    const answerText = getAllByText(/Security answer/);
    expect(answerText).toHaveLength(1);
    const editQA = getByTestId(
      "transfer-security-questions-security-edit-link"
    );
    expect(editQA).toBeTruthy();
    await act(async () => {
      fireEvent.click(
        getByTestId("transfer-security-questions-security-edit-link")
      );
    });
    const modalAnswer = getAllByText(/Security answer/);
    expect(modalAnswer).toHaveLength(2);

    const saveQAButton = getByText("Save");
    expect(saveQAButton).toBeTruthy();
    await act(async () => {
      fireEvent.click(saveQAButton);
    });
  });

  it(">> it should display an error on submit when recipient is not SHA2 compliant ", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/options/def@atb.com`,
        results: [
          {
            transferType: 2
          }
        ]
      }
    ]);
    const { container, getByText } = renderWithClient(<RenderWithMockData />);
    await act(async () => {
      fireEvent.click(getByText("abc (def@atb.com)"));
    });
    const button = container.querySelector("#form-submit-button");
    await act(async () => {
      button.click();
    });
    const encryptionError = container.querySelector("#to-error");
    expect(encryptionError.innerHTML).toEqual(
      "You need to update your question and answer."
    );
  });

  it(">> it should apply the month limit ", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/options/faketesting@atb.com`,
        results: emailEligibleData
      }
    ]);

    const { container, getByText } = renderWithClient(<RenderWithMockData />);
    // select withdrawal
    await act(async () => {
      fireEvent.click(getByText("Basic Account (4779) | $44,993.65"));
    });
    // select deposit
    await act(async () => {
      fireEvent.click(getByText("Aaaron A (Ash) (faketesting@atb.com)"));
    });
    const amount = container.querySelector("#transfer-amount-input");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "26" } });
    });
    const button = container.querySelector("#form-submit-button");
    await act(async () => {
      button.click();
    });
    const amountLimitError = container.querySelector("#amount-error");
    expect(amountLimitError.innerHTML).toEqual(
      "You can send a maximum of $25.00 at this time."
    );
  });

  it(">> it should apply the week limit, based on the min Month limit ", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/options/faketesting@atb.com`,
        results: emailEligibleData
      }
    ]);

    const { container, getByText } = renderWithClient(<RenderWithMockData />);
    // select withdrawal
    await act(async () => {
      fireEvent.click(getByText("Basic Account (4779) | $44,993.65"));
    });
    // select deposit
    await act(async () => {
      fireEvent.click(getByText("Aaaron A (Ash) (faketesting@atb.com)"));
    });
    const amount = container.querySelector("#transfer-amount-input");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "100" } });
    });
    const button = container.querySelector("#form-submit-button");
    await act(async () => {
      button.click();
    });
    const amountLimitError = container.querySelector("#amount-error");
    expect(amountLimitError.innerHTML).toEqual(
      "You can send a maximum of $50.00 at this time."
    );
  });

  it(">> it should apply the day limit, based on min Month limit ", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/options/faketesting@atb.com`,
        results: emailEligibleData
      }
    ]);

    const { container, getByText } = renderWithClient(<RenderWithMockData />);
    // select withdrawal
    await act(async () => {
      fireEvent.click(getByText("Basic Account (4779) | $44,993.65"));
    });
    // select deposit
    await act(async () => {
      fireEvent.click(getByText("Aaaron A (Ash) (faketesting@atb.com)"));
    });
    const amount = container.querySelector("#transfer-amount-input");
    fireEvent.change(amount, { target: { value: "123" } });
    await act(async () => {
      fireEvent.change(amount, { target: { value: "123" } });
    });
    const button = container.querySelector("#form-submit-button");
    await act(async () => {
      button.click();
    });
    const amountLimitError = container.querySelector("#amount-error");
    expect(amountLimitError.innerHTML).toEqual(
      "You can send a maximum of $25.00 at this time."
    );
  });

  it(">> it should allow success within all limit checks ", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/options/1+1@1.com`,
        results: emailEligibleData
      }
    ]);
    const { container } = renderWithClient(<RenderWithMockData />);
    const amount = container.querySelector("#transfer-amount-input");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "25" } });
    });
    const button = container.querySelector("#form-submit-button");
    await act(async () => {
      button.click();
    });
    const amountLimitError = container.querySelector("#amount-error");
    expect(amountLimitError.innerHTML).toEqual(""); // no errors
  });

  it(">> it should apply the day limit and include name when recipient selected", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/options/faketesting@atb.com`,
        results: [
          {
            transferType: 2
          }
        ]
      }
    ]);
    const { container, getByText } = renderWithClient(<RenderWithMockData />);

    // select withdrawal
    await act(async () => {
      fireEvent.click(getByText("Basic Account (4779) | $44,993.65"));
    });

    // select deposit
    await act(async () => {
      fireEvent.click(getByText("Aaaron A (Ash) (faketesting@atb.com)"));
    });

    const amount = container.querySelector("#transfer-amount-input");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "123" } });
    });

    const button = container.querySelector("#form-submit-button");

    await act(async () => {
      button.click();
    });
    const amountLimitError = container.querySelector("#amount-error");
    expect(amountLimitError.innerHTML).toEqual(
      "You can send a maximum of $25.00 at this time."
    );
  });

  it(">> it should apply the overage limit and include name when recipient selected", async () => {
    // TODO: move to common definition when all tests rationalized to eliminate duplicate path testing
    mockApiData([
      {
        url: `${etransfersBaseUrl}/options/faketesting@atb.com`,
        results: [
          {
            transferType: 2
          }
        ]
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsPassing
      }
    ]);
    const { container, getByText } = renderWithClient(<RenderWithMockData />);
    await act(async () => {});

    // select withdrawal
    fireEvent.click(getByText("Basic Account (4779) | $44,993.65"));
    await act(async () => {});

    // select deposit
    fireEvent.click(getByText("Aaaron A (Ash) (faketesting@atb.com)"));
    await act(async () => {});

    const amount = container.querySelector("#transfer-amount-input");
    fireEvent.change(amount, { target: { value: "480000" } });
    await act(async () => {});

    const button = container.querySelector("#form-submit-button");
    button.click();
    await act(async () => {});

    const amountLimitError = container.querySelector("#amount-error");
    expect(amountLimitError.innerHTML).toEqual(
      "Non-sufficient funds. Enter a lower amount."
    );
  });

  it(">> it should display an error when recipient account is not registered for deposits ", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/options/def@atb.com`,
        results: [
          {
            transferType: 2
          }
        ]
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsPassing
      }
    ]);
    const props1 = {
      id: "details-creditcard-transactions-container",
      eTransferData: eTransferDataMock,
      setETransferSubmit: () => {},
      nextTab: () => {},
      showForm: true,
      setShowForm: () => {},
      validateDepositor: () => {},
      setIsDataUpdated: () => {},
      setFormData: () => {}
    };
    const { container, getByText } = renderWithClient(
      <ETransferContext.Provider
        value={{
          request: {},
          send: {
            sendState: {},
            onChange: () => {},
            validateEmailAddress: () => {}
          }
        }}
      >
        <SendETransferForm {...props1} />
      </ETransferContext.Provider>
    );
    await act(async () => {
      fireEvent.click(getByText("abc (def@atb.com)"));
    });
    const ineligibilityError = container.querySelector("#to-error");
    expect(ineligibilityError.innerHTML).toEqual(
      "You need to update your question and answer."
    );
  });

  it(">> it should render when no data", async () => {
    const props1 = {
      id: "transfer",
      eTransferData: {
        withdrawalAccounts: [],
        depositAccounts: [],
        interacLimits: {}
      },
      setETransferSubmit: () => {},
      nextTab: () => {},
      showForm: true,
      setShowForm: () => {},
      validateDepositor: () => {},
      setIsDataUpdated: () => {},
      setFormData: () => {}
    };
    const { container } = renderWithClient(
      <ETransferContext.Provider
        value={{
          request: {},
          send: {
            sendState: {},
            onChange: () => {},
            validateEmailAddress: () => {}
          }
        }}
      >
        <SendETransferForm {...props1} />
      </ETransferContext.Provider>
    );
    await act(async () => {});
    expect(container.querySelector("#transfer-from-label").toExist);
    expect(container.querySelector("#transfer-from-icon").toExist);
    expect(
      formatIconSrc(container.querySelector("#transfer-from-icon").src)
    ).toEqual("/account.svg");
    expect(container.querySelector("#transfer-from-select").toExist);
    expect(container.querySelector("#transfer-down-arrow-icon").toExist);
    expect(container.querySelector("#transfer-to-label").toExist);
    expect(container.querySelector("#transfer-to-icon").toExist);
    expect(
      formatIconSrc(container.querySelector("#transfer-to-icon").src)
    ).toEqual("/person.svg");
    expect(container.querySelector("#transfer-to-select").toExist);
    expect(container.querySelector("#transfer-amount-label").toExist);
    expect(container.querySelector("#transfer-amount-icon").toExist);
    expect(
      formatIconSrc(container.querySelector("#transfer-amount-icon").src)
    ).toEqual("/money.svg");
    expect(container.querySelector("#transfer-message-label").toExist);
    expect(container.querySelector("#transfer-message-icon").toExist);
    expect(
      formatIconSrc(container.querySelector("#transfer-message-icon").src)
    ).toEqual("/message.svg");
  });

  it(">> it should render with persisted data", async () => {
    const persistedProps = {
      id: "transfer",
      eTransferData: eTransferDataMock,
      persistedData,
      setETransferSubmit: () => {},
      nextTab: () => {},
      showForm: true,
      setShowForm: () => {},
      validateDepositor: () => {},
      setIsDataUpdated: () => {},
      setFormData: () => {}
    };
    const { container } = renderWithClient(
      <ETransferContext.Provider
        value={{
          request: {},
          send: {
            sendState: {},
            onChange: () => {},
            validateEmailAddress: () => {}
          }
        }}
      >
        <SendETransferForm {...persistedProps} />
      </ETransferContext.Provider>
    );
    await act(async () => {});

    const { amount, message } = persistedData;

    const test = container.querySelector("#transfer-from-select .text");
    expect(test.innerHTML).toEqual("bulma (4779) | $44,993.65");
    expect(container.querySelector("#transfer-amount-input").value).toEqual(
      amount
    );

    // TODO - selectors should be improved during e2e testing - should include id as part of the inputs
    expect(
      container.querySelector("#transfer-memo-textarea").innerHTML
    ).toEqual(message);
  });

  it("should call setValue from useForm hook to set the `from` value when redirected by quick action", async () => {
    jest.spyOn(ReactRouter, "useLocation").mockReturnValue({
      pathname: "move-money/send-money#create",
      hash: "#create",
      from: {
        country: "CA",
        routingId: "021908859",
        accountId: "0000034849879200"
      }
    });
    const mockSetValue = jest.fn();
    jest.spyOn(ReactHookForm, "default").mockReturnValue({
      register: () => {},
      handleSubmit: () => {},
      triggerValidation: () => {},
      setError: () => {},
      errors: () => {},
      getValues: () => {},
      setValue: mockSetValue
    });

    await act(async () => {
      renderWithClient(
        <ETransferContext.Provider
          value={{
            request: {},
            send: {
              sendState: {},
              onChange: () => {},
              validateEmailAddress: () => {}
            }
          }}
        >
          <SendETransferForm {...props} />
        </ETransferContext.Provider>
      );
    });

    expect(mockSetValue).toHaveBeenCalledWith(
      "from",
      "selected ID from quick action"
    );
  });
});
