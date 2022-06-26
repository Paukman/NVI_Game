import React from "react";
import { fireEvent, act } from "@testing-library/react";
import { renderWithRouter } from "utils/TestUtils";
import { billPaymentErrors } from "utils/MessageCatalog";
import { menageContacts, modeName } from "globalConstants";
import EditPayee from "./EditPayee";
import { ManageContactsContext } from "../ManageContactsProvider";
import { payeeToHandle } from "../ContactsReviewTestData";

const setPageName = jest.fn();
const providerValue = {
  page: {
    pageName: menageContacts.EDIT_RECIPIENT,
    mode: modeName.EDIT_MODE,
    setPageName,
    openSnackbar: false,
    setOpenSnackbar: () => {},
    snackbarMessage: null,
    isAlertShowing: false,
    setIsAlertShowing: () => {},
    alertError: null,
    serverErrors: { account: { type: null } },
    clearServerError: () => {}
  },
  payee: {
    payeeToHandle,
    setPayeeToHandle: () => {},
    onSubmit: () => {},
    getApprovedCreditors: () => [{ name: "WESTBURNE WEST", id: "1234" }]
  }
};

const providerValueCreate = {
  page: {
    pageName: "",
    mode: modeName.CREATE_MODE,
    setPageName: () => {},
    openSnackbar: false,
    setOpenSnackbar: () => {},
    snackbarMessage: null,
    isAlertShowing: false,
    setIsAlertShowing: () => {},
    alertError: {
      title: "System Error",
      errorMessage: "We couldn’t save this payee. Please try again.",
      id: "system-error",
      buttons: [{}]
    },
    serverErrors: { account: { type: null } },
    clearServerError: () => {}
  },
  payee: {
    payeeToHandle,
    getApprovedCreditors: callback => {
      callback([
        { name: "WESTBURNE WEST", id: "1234" },
        { name: "Alien services", id: "2321" },
        { name: "$PEC|AL /. Chars", id: "4343" }
      ]);
    },
    setPayeeToHandle: () => {},
    onSubmit: () => {}
  }
};

describe("EditPayee", () => {
  it(">> Edit mode should render fields and inputs with basic data in form", () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );

    const nameTitle = getByText(payeeToHandle.payeeName);
    expect(nameTitle.innerHTML).toEqual(payeeToHandle.payeeName);
    const accountField = getByLabelText("Account number");
    expect(accountField.value).toEqual(payeeToHandle.payeeCustomerReference);
    const nicknameField = getByLabelText("Nickname (optional)");
    expect(nicknameField.value).toEqual("");
    const shortnameTitle = getByText(
      "Our system has provided a short name for this payee: WESTBURNE WEST. This short name will appear on statements, transactions and at ABMs unless you create a different nickname."
    );
    expect(shortnameTitle).toBeTruthy();
  });

  it(">> should throw error message for empty account field", async () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );

    const accountField = getByLabelText("Account number");
    await act(async () => {
      fireEvent.blur(accountField, { target: { value: "" } });
    });
    expect(getByText("Account number")).toBeTruthy();

    expect(getByText("Enter the payee account number.")).toBeTruthy();
  });

  it(">> should throw error message for invalid account field", async () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );

    const accountField = getByLabelText("Account number");
    await act(async () => {
      fireEvent.blur(accountField, { target: { value: "123abc!@#" } });
    });
    expect(getByText("Account number")).toBeTruthy();

    expect(getByText("Enter a valid account number.")).toBeTruthy();
  });

  it(">> should throw error message for bad nickname field", async () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );

    const nicknameField = getByLabelText("Nickname (optional)");
    await act(async () => {
      fireEvent.blur(nicknameField, { target: { value: "test!" } });
    });
    expect(getByText("Nickname (optional)")).toBeTruthy();
    expect(getByText("Enter a valid nickname.")).toBeTruthy();
  });

  it(">> should throw error message for bad word in nickname field", async () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );

    const nicknameField = getByLabelText("Nickname (optional)");
    await act(async () => {
      fireEvent.blur(nicknameField, { target: { value: "httprebasegitlab" } });
    });
    expect(getByText("Nickname (optional)")).toBeTruthy();
    expect(getByText("Enter a valid nickname.")).toBeTruthy();
  });

  it(">> should render alert modal", () => {
    const { getByText } = renderWithRouter(
      <ManageContactsContext.Provider
        value={{
          page: {
            pageName: menageContacts.EDIT_RECIPIENT,
            setPageName: () => {},
            openSnackbar: false,
            setOpenSnackbar: () => {},
            snackbarMessage: null,
            isAlertShowing: true,
            setIsAlertShowing: () => {},
            alertError: {
              title: "System Error",
              errorMessage: "We couldn’t save this payee. Please try again.",
              id: "system-error",
              buttons: [{}]
            },
            serverErrors: { account: { type: null } },
            clearServerError: () => {}
          },
          payee: {
            payeeToHandle,
            getApprovedCreditors: () => {},
            setPayeeToHandle: () => {},
            onSubmit: () => {}
          }
        }}
      >
        <EditPayee />
      </ManageContactsContext.Provider>
    );

    expect(getByText("System Error")).toBeTruthy();
    expect(
      getByText("We couldn’t save this payee. Please try again.")
    ).toBeTruthy();
  });

  // Create mode tests
  it(">> Create mode should render fields and inputs with no data in form", () => {
    const { getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValueCreate}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );
    const payeeField = getByLabelText("Payee name");
    expect(payeeField.value).toBe(""); // unselected - should be blank
    const accountField = getByLabelText("Account number");
    expect(accountField.value).toEqual("");
    const nicknameField = getByLabelText("Nickname (optional)");
    expect(nicknameField.value).toEqual("");
  });

  it(">> should throw error message for empty payee name field", async () => {
    const { getByText, getAllByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValueCreate}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );

    await act(async () => {
      fireEvent.click(getAllByText("Add payee")[1]);
    });
    expect(getByText("Select a payee.", { exact: true })).toBeDefined();
    expect(getByLabelText("Account number").disabled).toBeTruthy();
    expect(getByLabelText("Nickname (optional)").disabled).toBeTruthy();
  });

  it(">> Create mode should render proper icons for all modes ", async () => {
    const { getByAltText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValueCreate}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );
    const payeeIcon = getByAltText("Payee name", { exact: true });
    expect(payeeIcon).toBeDefined();
    expect(payeeIcon.src).toMatch(/pay-bill.svg/i);

    const accountIcon = getByAltText("Account number", { exact: true });
    expect(accountIcon).toBeDefined();
    expect(accountIcon.src).toMatch(/account-number-disabled.svg/i);

    const nicknameIcon = getByAltText("Nickname", { exact: true });
    expect(nicknameIcon).toBeDefined();
    expect(nicknameIcon.src).toMatch(/pencil-disabled.svg/i);
  });

  it(">> Create mode should throw error message for nothing found in search", async () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValueCreate}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );

    const accountField = getByLabelText("Account number");
    await act(async () => {
      fireEvent.blur(accountField, { target: { value: "hello" } });
    });
    expect(getByText("Account number")).toBeTruthy();

    expect(getByText("No results found.")).toBeTruthy();
  });

  it(">> Create mode should throw error for incomplete payee name in field", async () => {
    const { findByText, getByLabelText, getByRole } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValueCreate}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );

    const nameField = getByLabelText("Payee name");
    fireEvent.change(nameField, { target: { value: "WESTBURNE" } });

    const addPayeeButton = getByRole("button", { name: "Add payee" });
    fireEvent.click(addPayeeButton);

    expect(await findByText(billPaymentErrors.MSG_RBBP_006)).toBeVisible();
  });

  it(">> Create mode should find in search and provide default nickname", async () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValueCreate}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );

    expect(getByText("Account number")).toBeTruthy();
    const nameField = getByLabelText("Payee name");
    await act(async () => {
      fireEvent.change(nameField, { target: { value: "WEST" } });
    });
    await act(async () => {
      fireEvent.keyDown(nameField, { key: "ArrowDown", code: "ArrowDown" });
    });
    await act(async () => {
      fireEvent.keyDown(nameField, { key: "Enter", code: "Enter" });
    });
    expect(getByText("WESTBURNE WEST")).toBeTruthy();
    const temp = getByText(
      "Our system has provided a short name for this payee: WESTBURNE WEST. This short name will appear on statements, transactions and at ABMs unless you create a different nickname."
    );
    expect(getByLabelText("Account number").disabled).toBeFalsy();
    expect(getByLabelText("Nickname (optional)").disabled).toBeFalsy();

    expect(temp).toBeTruthy();
  });
  it(">> should allow special regex characters in payee name in create mode", async () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValueCreate}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );
    expect(getByText("Account number")).toBeTruthy();
    const nameField = getByLabelText("Payee name");
    await act(async () => {
      fireEvent.change(nameField, {
        target: { value: "$PEC|AL /." }
      });
    });
    await act(async () => {
      fireEvent.keyDown(nameField, { key: "ArrowDown", code: "ArrowDown" });
    });
    await act(async () => {
      fireEvent.keyDown(nameField, { key: "Enter", code: "Enter" });
    });
    expect(getByText("$PEC|AL /. Chars")).toBeTruthy();
    const temp = getByText(
      "Our system has provided a short name for this payee: $PEC|AL /. Chars. This short name will appear on statements, transactions and at ABMs unless you create a different nickname."
    );
    expect(getByLabelText("Account number").disabled).toBeFalsy();
    expect(getByLabelText("Nickname (optional)").disabled).toBeFalsy();

    expect(temp).toBeTruthy();
  });

  it(">> Create mode should catch bad word in nickname", async () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValueCreate}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );
    expect(getByText("Account number")).toBeTruthy();
    const nameField = getByLabelText("Payee name");
    await act(async () => {
      fireEvent.change(nameField, { target: { value: "WEST" } });
    });
    await act(async () => {
      fireEvent.keyDown(nameField, { key: "ArrowDown", code: "ArrowDown" });
    });
    await act(async () => {
      fireEvent.keyDown(nameField, { key: "Enter", code: "Enter" });
    });
    // const nicknameField = getByLabelText("Nickname (optional)");
    const nicknameField = getByLabelText("Nickname (optional)");
    await act(async () => {
      fireEvent.blur(nicknameField, { target: { value: "test!" } });
    });
    expect(getByText("Nickname (optional)")).toBeTruthy();
    expect(getByText("Enter a valid nickname.")).toBeTruthy();
  });

  it(">> Create mode should allow valid nickname", async () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValueCreate}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );
    expect(getByText("Account number")).toBeTruthy();
    const nameField = getByLabelText("Payee name");
    await act(async () => {
      fireEvent.change(nameField, { target: { value: "WEST" } });
    });
    await act(async () => {
      fireEvent.keyDown(nameField, { key: "ArrowDown", code: "ArrowDown" });
    });
    await act(async () => {
      fireEvent.keyDown(nameField, { key: "Enter", code: "Enter" });
    });
    const nicknameField = getByLabelText("Nickname (optional)");
    await act(async () => {
      fireEvent.blur(nicknameField, { target: { value: "thisisatest" } });
    });

    const name1Field = getByLabelText("Nickname (optional)");
    expect(name1Field.value).toEqual("thisisatest");
  });

  it(">> Create mode should catch bad account number", async () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValueCreate}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );
    expect(getByText("Account number")).toBeTruthy();
    const nameField = getByLabelText("Payee name");
    await act(async () => {
      fireEvent.change(nameField, { target: { value: "WEST" } });
    });
    await act(async () => {
      fireEvent.keyDown(nameField, { key: "ArrowDown", code: "ArrowDown" });
    });
    await act(async () => {
      fireEvent.keyDown(nameField, { key: "Enter", code: "Enter" });
    });
    // const nicknameField = getByLabelText("Nickname (optional)");
    const accountNumberField = getByLabelText("Account number");
    await act(async () => {
      fireEvent.blur(accountNumberField, { target: { value: "test!" } });
    });
    expect(getByText("Account number")).toBeTruthy();
    expect(getByText("Enter a valid account number.")).toBeTruthy();
  });

  it(">> should cancel edit payee", async () => {
    const { findByAltText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );

    const numField = getByLabelText("Account number");
    expect(numField.value).toEqual("3636510056");
    const cancelBtn = await findByAltText("Close payee edit");
    fireEvent.click(cancelBtn);
    expect(setPageName).toHaveBeenCalled();
  });

  it(">> should call clearServerError() when user types into account number input after invalid account number error occurred", async () => {
    const clearServerError = jest.fn();
    const providerValueWithServerError = {
      ...providerValue,
      page: {
        ...providerValue.page,
        serverErrors: { account: { type: "invalidAccount" } },
        clearServerError
      }
    };
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValueWithServerError}>
        <EditPayee />
      </ManageContactsContext.Provider>
    );

    const accountField = getByLabelText("Account number");
    await act(async () => {
      fireEvent.blur(accountField, { target: { value: "123" } });
    });
    expect(getByText("Account number")).toBeTruthy();
    expect(getByText("Enter a valid account number.")).toBeTruthy();

    await act(async () => {
      fireEvent.change(accountField, { target: { value: "1" } });
    });
    expect(clearServerError).toHaveBeenCalledWith("invalidAccount");
  });
});
