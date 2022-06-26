import React from "react";
import { fireEvent, act } from "@testing-library/react";
import { renderWithRouter } from "utils/TestUtils";
import { menageContacts, modeName } from "globalConstants";
import { manageContactMessage } from "utils/MessageCatalog";
import EditRecipient from "./EditRecipient";
import { ManageContactsContext } from "../ManageContactsProvider";

import { recipientToHandle } from "../ContactsReviewTestData";

const setPageName = jest.fn();
const providerValue = {
  page: {
    pageName: menageContacts.EDIT_RECIPIENT,
    setPageName,
    openSnackbar: false,
    setOpenSnackbar: () => {},
    snackbarMessage: null,
    isAlertShowing: false,
    setIsAlertShowing: () => {},
    alertError: null,
    mode: modeName.EDIT_MODE
  },
  recipient: {
    recipientToHandle,
    setRecipientToHandle: () => {},
    getTransferType: () => {},
    showAutodeposit: false,
    setShowAutodeposit: () => {},
    onSubmit: () => {},
    onAddSubmit: () => {}
  },
  contactsInfo: {
    contacts: {
      pageToReturnTo: "",
      pageName: ""
    }
  }
};

describe("EditRecipient", () => {
  it(">> should render recipient without autodeposit data in the form", () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditRecipient />
      </ManageContactsContext.Provider>
    );

    const nameField = getByLabelText("Recipient name");
    expect(nameField.value).toEqual(recipientToHandle.aliasName);
    const emailField = getByLabelText("Recipient email");
    expect(emailField.value).toEqual(
      recipientToHandle.notificationPreference[0].notificationHandle
    );
    const questionField = getByLabelText("Security question");
    expect(questionField.value).toEqual(
      recipientToHandle.defaultTransferAuthentication.question
    );
    const answerField = getByLabelText("Security answer");
    expect(answerField.value).toEqual("");
    expect(getByText("Save")).toBeTruthy();
  });

  it(">> should render recipient with autodeposit data in the form", () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider
        value={{
          page: {
            pageName: menageContacts.EDIT_RECIPIENT,
            setPageName: () => {},
            openSnackbar: false,
            setOpenSnackbar: () => {},
            snackbarMessage: null,
            isAlertShowing: false,
            setIsAlertShowing: () => {},
            alertError: null
          },
          recipient: {
            recipientToHandle,
            setRecipientToHandle: () => {},
            getTransferType: () => {},
            showAutodeposit: true,
            setShowAutodeposit: () => {},
            onSubmit: () => {}
          },
          contactsInfo: {
            contacts: {
              pageToReturnTo: "",
              pageName: ""
            }
          }
        }}
      >
        <EditRecipient />
      </ManageContactsContext.Provider>
    );

    const nameField = getByLabelText("Recipient name");
    expect(nameField.value).toEqual(recipientToHandle.aliasName);
    const emailField = getByLabelText("Recipient email");
    expect(emailField.value).toEqual(
      recipientToHandle.notificationPreference[0].notificationHandle
    );
    expect(getByText("Autodeposit")).toBeTruthy();
    expect(getByText("Save")).toBeTruthy();
  });

  it(">> should cancel edit recipient", async () => {
    const { findByAltText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditRecipient />
      </ManageContactsContext.Provider>
    );

    const nameField = getByLabelText("Recipient name");
    expect(nameField.value).toEqual(recipientToHandle.aliasName);
    const cancelBtn = await findByAltText("Close recipient edit");
    fireEvent.click(cancelBtn);
    expect(setPageName).toHaveBeenCalled();
  });

  it(">> should throw error message when no security answer is updated", async () => {
    const { findByText, getByText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditRecipient />
      </ManageContactsContext.Provider>
    );

    expect(getByText("Save")).toBeTruthy();

    const saveBtn = await findByText("Save");

    await act(async () => {
      fireEvent.click(saveBtn);
    });

    expect(getByText(manageContactMessage.MSG_RBET_005)).toBeTruthy();
  });

  it(">> should accept email when operational system adds period once the user hits space twice", async () => {
    const { getByLabelText, queryByText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditRecipient />
      </ManageContactsContext.Provider>
    );

    const fakeEmail1 = "someone1@atb.com";
    const fakeEmail2 = "someone2@atb.com";

    const email = getByLabelText("Recipient email");

    await act(async () => {
      fireEvent.blur(email, {
        target: { value: `${fakeEmail1}. ` }
      });
    });
    expect(queryByText("Enter a valid email address.")).toBeNull();
    expect(email.value).toBe(fakeEmail1);

    await act(async () => {
      fireEvent.keyDown(email, {
        key: "Enter",
        target: { value: `${fakeEmail2}  .   ` }
      });
    });
    expect(queryByText("Enter a valid email address.")).toBeNull();
    expect(email.value).toBe(fakeEmail2);
  });

  it(">> should throw error message for all empty fields", async () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditRecipient />
      </ManageContactsContext.Provider>
    );

    const nameField = getByLabelText("Recipient name");
    await act(async () => {
      fireEvent.blur(nameField, { target: { value: "" } });
    });

    expect(getByText(manageContactMessage.MSG_RBET_033)).toBeTruthy();

    const emailField = getByLabelText("Recipient email");
    await act(async () => {
      fireEvent.blur(emailField, { target: { value: "" } });
    });
    expect(getByText("Enter a valid email address.")).toBeTruthy();

    const questionField = getByLabelText("Security question");
    await act(async () => {
      fireEvent.blur(questionField, { target: { value: "" } });
    });
    expect(getByText("Enter a security question.")).toBeTruthy();

    const answerField = getByLabelText("Security answer");
    await act(async () => {
      fireEvent.blur(answerField, { target: { value: "" } });
    });

    expect(getByText(manageContactMessage.MSG_RBET_005)).toBeTruthy();
  });

  it(">> should throw message when question and answer is same", async () => {
    const { getByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditRecipient />
      </ManageContactsContext.Provider>
    );

    const questionField = getByLabelText("Security question");
    await act(async () => {
      fireEvent.blur(questionField, { target: { value: "abcd" } });
    });

    const answerField = getByLabelText("Security answer");
    await act(async () => {
      fireEvent.blur(answerField, { target: { value: "abcd" } });
    });

    expect(getByText("Security question and answer can’t match.")).toBeTruthy();
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
              errorMessage:
                "We couldn’t save this recipient. Please try again.",
              id: "system-error",
              buttons: [{}]
            }
          },
          recipient: {
            recipientToHandle,
            setRecipientToHandle: () => {},
            getTransferType: () => {},
            showAutodeposit: true,
            setShowAutodeposit: () => {},
            onSubmit: () => {}
          },
          contactsInfo: {
            contacts: {
              pageToReturnTo: "",
              pageName: ""
            }
          }
        }}
      >
        <EditRecipient />
      </ManageContactsContext.Provider>
    );

    expect(getByText("System Error")).toBeTruthy();
    expect(
      getByText("We couldn’t save this recipient. Please try again.")
    ).toBeTruthy();
  });
});
