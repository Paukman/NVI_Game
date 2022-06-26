import React from "react";
import { render, act, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mfaBaseUrl } from "api";
import { mockApiData, windowMatchMediaMock } from "utils/TestUtils";
import DataStore from "utils/store";
import ModalProvider from "Common/ModalProvider";
import { MessageProvider } from "StyleGuide/Components";
import AddPayee from "./AddPayee";
import AddPayeeProvider from "./AddPayeeProvider";
import { approvedCreditorsUrl, addPayeeUrl } from "./useAddPayee";

jest.useFakeTimers();

const renderComponent = () =>
  act(async () =>
    render(
      <MemoryRouter initialEntries={["/"]}>
        <MessageProvider>
          <ModalProvider>
            <AddPayeeProvider handleAddPayee={jest.fn()}>
              <AddPayee />
            </AddPayeeProvider>
          </ModalProvider>
        </MessageProvider>
      </MemoryRouter>
    )
  );

describe(">> AddPayee tests", () => {
  beforeEach(() => {
    windowMatchMediaMock();
    DataStore.flush();
  });
  it(">> should render children ", async () => {
    const creditors = [
      {
        name: "HOGG FUEL",
        id: 123
      }
    ];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      },
      {
        url: addPayeeUrl,
        results: creditors
      }
    ]);
    await renderComponent();
    const {
      queryByText,
      getAllByText,
      getByText,
      getByLabelText,
      findByText
    } = screen;

    const payeeNameInput = getByLabelText("Payee name");

    expect(payeeNameInput.value).toBe("");
    const accountField = getByLabelText("Account number");
    expect(accountField.value).toEqual("");

    await act(async () => {
      fireEvent.change(payeeNameInput, { target: { value: "HOGG" } });
    });
    await act(async () => {
      fireEvent.keyDown(payeeNameInput, {
        key: "ArrowDown",
        code: "ArrowDown"
      });
    });

    await act(async () => {
      jest.runAllTimers();
    });
    await act(async () => {
      fireEvent.keyDown(payeeNameInput, { key: "Enter", code: "Enter" });
    });
    let shortName = "";
    await act(async () => {
      shortName = await findByText(
        /Our system has provided a short name for this payee: HOGG FUEL. /
      );
    });
    expect(shortName).toBeTruthy();
    const addPayeeButton = getAllByText("Add payee");
    await act(async () => {
      fireEvent.click(addPayeeButton[1]);
    });
    expect(getByText("Enter the payee account number.")).toBeTruthy();
    await act(async () => {
      fireEvent.change(accountField, { target: { value: "Account number" } });
    });
    const accountError = queryByText("Enter the payee account number.");
    expect(accountError).toBe(null);

    const nicknameField = getByLabelText("Nickname (optional)");
    await act(async () => {
      fireEvent.change(nicknameField, { target: { value: "###!" } });
    });
    expect(getByText("Enter a valid nickname.")).toBeTruthy();
    await act(async () => {
      fireEvent.change(nicknameField, { target: { value: "DD" } });
    });
    const nicknameError = queryByText("Enter a valid nickname.");
    expect(nicknameError).toBe(null);
  });

  it(">> should accept correct name when focusing out ", async () => {
    const creditors = [
      {
        name: "COMPANY",
        id: 123
      }
    ];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      },
      {
        url: addPayeeUrl,
        results: creditors
      }
    ]);
    await renderComponent();
    const { queryByText, getAllByText, getByLabelText } = screen;

    const payeeNameInput = getByLabelText("Payee name");
    expect(payeeNameInput.value).toBe("");

    await act(async () => {
      fireEvent.change(payeeNameInput, { target: { value: "COMPANY" } });
    });

    await act(async () => {
      jest.runAllTimers();
    });

    const addPayeeButton = getAllByText("Add payee");
    await act(async () => {
      fireEvent.click(addPayeeButton[1]);
    });

    const payeeError = queryByText("Select a payee.");
    expect(payeeError).toBe(null);
  });

  it(">> should add a payee when RSA is triggered", async () => {
    const creditors = [
      {
        name: "HELLO THERE KENOBI",
        id: 123
      }
    ];
    mockApiData([
      {
        url: approvedCreditorsUrl,
        results: creditors
      },
      {
        url: addPayeeUrl,
        method: "POST",
        status: 230,
        results: {
          deviceTokenCookie: "",
          sessionId: "123",
          transactionId: ""
        }
      },
      {
        url: `${mfaBaseUrl}/challenges/user`,
        results: {
          currentChallengeType: "ChallengeQuestion"
        }
      },
      {
        url: `${mfaBaseUrl}/challenges/questions`,
        results: {
          challengeQuestions: [
            {
              challengeQuestionId: 123,
              challengeQuestion: "favorite car?"
            }
          ]
        }
      },
      {
        url: `${mfaBaseUrl}/challenges/answers`,
        method: "POST",
        results: {
          challengeAnswer: "PASS"
        }
      }
    ]);
    await renderComponent();
    const { findByText, getAllByText, getByText, getByLabelText } = screen;

    const payeeNameInput = getByLabelText("Payee name");
    await act(async () => {
      fireEvent.change(payeeNameInput, { target: { value: "HELLO" } });
    });
    await act(async () => {
      fireEvent.keyDown(payeeNameInput, {
        key: "ArrowDown",
        code: "ArrowDown"
      });
    });
    await act(async () => {
      jest.runAllTimers();
    });
    await act(async () => {
      fireEvent.keyDown(payeeNameInput, { key: "Enter", code: "Enter" });
    });
    await findByText("HELLO THERE KENOBI");

    const accountField = getByLabelText("Account number");
    await act(async () => {
      fireEvent.change(accountField, { target: { value: "12345678" } });
    });

    const addPayeeButton = getAllByText("Add payee")[1];
    await act(async () => {
      fireEvent.click(addPayeeButton);
    });

    const rsaModal = await findByText("Enhanced security");
    expect(rsaModal).toBeVisible();
    const securityAnswer = getByLabelText("Security answer");
    await act(async () => {
      fireEvent.change(securityAnswer, {
        target: { value: "car" }
      });
    });
    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    const successMsg = await findByText(
      "You’ve successfully added payee HELLO THERE KENOBI."
    );
    expect(successMsg).toBeVisible();
  });
});
