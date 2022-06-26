import React from "react";
import { act, fireEvent } from "@testing-library/react";
import { menageContacts } from "globalConstants";
import { renderWithRouter } from "utils/TestUtils";
import AntModalProvider from "StyleGuide/Components/Modal";
import { ManageContactsContext } from "./ManageContactsProvider";
import { data } from "./ContactsReviewTestData";
import ManageContacts from "./ManageContacts";

const BASE_PATH = "/more/manage-contacts";

describe("ManageContacts", () => {
  it(">> Should show render if data is empty", async () => {
    const { findByText } = renderWithRouter(
      <AntModalProvider>
        <ManageContactsContext.Provider
          value={{
            contactsInfo: {
              contactsData: {
                recipients: [],
                payees: []
              },
              setIsLoading: () => {}
            },
            page: {
              pageName: menageContacts.RECIPIENTS,
              setPageName: () => {},
              openSnackbar: false,
              setOpenSnackbar: () => {},
              setMode: () => {}
            },
            recipient: {
              setRecipientToHandle: () => {},
              setShowAutodeposit: () => {}
            },
            payee: { setPayeeToHandle: () => {} }
          }}
        >
          <ManageContacts />
        </ManageContactsContext.Provider>
      </AntModalProvider>,
      {
        route: `${BASE_PATH}/recipients#create`
      }
    );

    const manageContactPage = await findByText(
      /No recipients have been created/
    );
    expect(manageContactPage).toBeTruthy();
  });

  it(">> Should Render Manage Contact Page", async () => {
    const { findByText } = renderWithRouter(
      <AntModalProvider>
        <ManageContactsContext.Provider
          value={{
            contactsInfo: { contactsData: data, setIsLoading: () => {} },
            page: {
              pageName: menageContacts.RECIPIENTS,
              setPageName: () => {},
              openSnackbar: false,
              setOpenSnackbar: () => {},
              snackbarMessage: "Test message",
              setMode: () => {}
            },
            recipient: {
              setRecipientToHandle: () => {},
              setShowAutodeposit: () => {}
            },
            payee: { setPayeeToHandle: () => {} }
          }}
        >
          <ManageContacts />
        </ManageContactsContext.Provider>
      </AntModalProvider>,
      {
        route: `${BASE_PATH}/payees#create`
      }
    );

    const manageContactPage = await findByText(/Manage contacts/);
    expect(manageContactPage).toBeTruthy();
  });

  it(">> Should Render Snackbar", async () => {
    const { findByText } = renderWithRouter(
      <AntModalProvider>
        <ManageContactsContext.Provider
          value={{
            contactsInfo: { contactsData: data, setIsLoading: () => {} },
            page: {
              pageName: menageContacts.RECIPIENTS,
              setPageName: () => {},
              openSnackbar: true,
              setOpenSnackbar: () => {},
              snackbarMessage: "Test message",
              setMode: () => {}
            },
            recipient: {
              setRecipientToHandle: () => {},
              setShowAutodeposit: () => {}
            },
            payee: { setPayeeToHandle: () => {} }
          }}
        >
          <ManageContacts />
        </ManageContactsContext.Provider>
      </AntModalProvider>
    );

    const manageContactPage = await findByText(/Manage contacts/);
    expect(manageContactPage).toBeTruthy();

    const snackbarMessage = await findByText(/Test message/);
    expect(snackbarMessage).toBeTruthy();
  });

  it(">> Should Render Payee Review and Recipient Review lists", async () => {
    const setPageName = jest.fn();
    const { findByText } = renderWithRouter(
      <AntModalProvider>
        <ManageContactsContext.Provider
          value={{
            contactsInfo: { contactsData: data, setIsLoading: () => {} },
            page: {
              pageName: menageContacts.RECIPIENTS,
              setPageName,
              openSnackbar: false,
              setOpenSnackbar: () => {},
              snackbarMessage: "Test message",
              setMode: () => {}
            },
            recipient: {
              setRecipientToHandle: () => {},
              setShowAutodeposit: () => {}
            },
            payee: { setPayeeToHandle: () => {} }
          }}
        >
          <ManageContacts />
        </ManageContactsContext.Provider>
      </AntModalProvider>
    );

    const payeeText = await findByText("Payees");

    await act(async () => {
      fireEvent.click(payeeText);
    });
    expect(setPageName).toHaveBeenCalledWith(menageContacts.PAYEES);

    const recipientText = await findByText("Recipients");

    await act(async () => {
      fireEvent.click(recipientText);
    });
    expect(setPageName).toHaveBeenCalledWith(menageContacts.RECIPIENTS);
  });
});
