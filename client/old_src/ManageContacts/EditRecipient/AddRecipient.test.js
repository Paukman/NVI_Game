import React from "react";
import { fireEvent, act } from "@testing-library/react";
import { renderWithRouter } from "utils/TestUtils";
import { menageContacts, modeName } from "globalConstants";
import { manageContactMessage } from "utils/MessageCatalog";
import EditRecipient from "./EditRecipient";
import { ManageContactsContext } from "../ManageContactsProvider";

import { recipientToHandle } from "../ContactsReviewTestData";

const setPageName = jest.fn();
const setRecipientToHandle = jest.fn();
const onAddSubmit = jest.fn();
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
    mode: modeName.CREATE_MODE,
    updatePage: () => {}
  },
  recipient: {
    recipientToHandle: {
      aliasName: "Roger",
      notificationPreference: [{ notificationHandle: "existing@email.com" }]
    },
    setRecipientToHandle,
    getTransferType: () => {},
    showAutodeposit: false,
    setShowAutodeposit: () => {},
    onSubmit: () => {},
    onAddSubmit
  },
  contactsInfo: {
    contacts: {
      pageToReturnTo: "",
      pageName: ""
    }
  }
};

const autodepositProviderValue = {
  page: {
    pageName: menageContacts.EDIT_RECIPIENT,
    setPageName,
    openSnackbar: false,
    setOpenSnackbar: () => {},
    snackbarMessage: null,
    isAlertShowing: false,
    setIsAlertShowing: () => {},
    alertError: null,
    mode: modeName.CREATE_MODE
  },
  recipient: {
    recipientToHandle,
    setRecipientToHandle,
    getTransferType: () => {},
    showAutodeposit: true,
    setShowAutodeposit: () => {},
    onSubmit: () => {},
    onAddSubmit
  },
  contactsInfo: {
    contacts: {
      pageToReturnTo: "",
      pageName: ""
    }
  }
};

describe("Add Recipient", () => {
  it(">> should render the form - email is not registered for Autodeposit", async () => {
    const {
      findByText,
      getByLabelText,
      findByLabelText,
      getAllByText
    } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditRecipient />
      </ManageContactsContext.Provider>
    );

    const nameField = getByLabelText("Recipient name");
    expect(nameField.value).toEqual("");
    await act(async () => {
      fireEvent.blur(nameField, { target: { value: "New Recipient" } });
    });
    const emailField = getByLabelText("Recipient email");
    expect(emailField.value).toEqual("");
    await act(async () => {
      fireEvent.blur(emailField, { target: { value: "recipient@email.com" } });
    });

    const nextBtn = await findByText("Next");
    await act(async () => {
      fireEvent.click(nextBtn);
    });

    const questionField = await findByLabelText("Security question");
    expect(questionField.value).toEqual("");
    await act(async () => {
      fireEvent.blur(questionField, { target: { value: "Question" } });
    });

    const answerField = getByLabelText("Security answer");
    expect(answerField.value).toEqual("");
    await act(async () => {
      fireEvent.blur(answerField, { target: { value: "Answer" } });
    });

    const addRecipientBtn = getAllByText("Add recipient")[1];
    await act(async () => {
      fireEvent.click(addRecipientBtn);
    });
    expect(onAddSubmit).toHaveBeenCalled();
  });

  it(">> should render the form - email is registered for Autodeposit", async () => {
    const { findByText, getByLabelText, getAllByText } = renderWithRouter(
      <ManageContactsContext.Provider value={autodepositProviderValue}>
        <EditRecipient />
      </ManageContactsContext.Provider>
    );

    const nameField = getByLabelText("Recipient name");
    expect(nameField.value).toEqual("");
    await act(async () => {
      fireEvent.blur(nameField, { target: { value: "New Recipient" } });
    });

    const emailField = getByLabelText("Recipient email");
    expect(emailField.value).toEqual("");
    await act(async () => {
      fireEvent.blur(emailField, { target: { value: "recipient@email.com" } });
    });

    const nextBtn = await findByText("Next");
    await act(async () => {
      fireEvent.click(nextBtn);
    });

    const autodepositLabel = await findByText("Autodeposit");

    expect(autodepositLabel).toBeTruthy();
    expect(getAllByText("Add recipient")[1]).toBeTruthy();
  });

  it(">> should cancel Add recipient", async () => {
    const { findByAltText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditRecipient />
      </ManageContactsContext.Provider>
    );

    const cancelBtn = await findByAltText("Close recipient edit");
    fireEvent.click(cancelBtn);
    expect(setPageName).toHaveBeenCalled();
  });

  it(">> should throw error message for all empty fields", async () => {
    const {
      getByText,
      findByText,
      getByLabelText,
      findAllByText
    } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditRecipient />
      </ManageContactsContext.Provider>
    );

    const nextBtn = await findByText("Next");
    await act(async () => {
      fireEvent.click(nextBtn);
    });

    expect(getByText(manageContactMessage.MSG_RBET_033)).toBeVisible();
    expect(getByText(manageContactMessage.MSG_RBET_010)).toBeVisible();

    const nameField = getByLabelText("Recipient name");
    await act(async () => {
      fireEvent.blur(nameField, { target: { value: "Recipient Name" } });
    });

    const emailField = getByLabelText("Recipient email");
    await act(async () => {
      fireEvent.blur(emailField, { target: { value: "recipient@email.com" } });
    });

    await act(async () => {
      fireEvent.click(nextBtn);
    });

    const addRecipientBtn = (await findAllByText("Add recipient"))[1];

    await act(async () => {
      fireEvent.click(addRecipientBtn);
    });

    expect(getByText("Enter a security question.")).toBeTruthy();
    expect(getByText(manageContactMessage.MSG_RBET_005)).toBeTruthy();
  });

  it(">> should throw an error message for an invalid name", async () => {
    const { getByText, findByText, getByLabelText } = renderWithRouter(
      <ManageContactsContext.Provider value={providerValue}>
        <EditRecipient />
      </ManageContactsContext.Provider>
    );

    const nameField = getByLabelText("Recipient name");
    await act(async () => {
      fireEvent.blur(nameField, { target: { value: "Invalid # N@me" } });
    });

    const nextBtn = await findByText("Next");
    await act(async () => {
      fireEvent.click(nextBtn);
    });

    expect(getByText(manageContactMessage.MSG_RBET_026)).toBeVisible();
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
            onSubmit: () => {},
            onAddSubmit: () => {}
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
