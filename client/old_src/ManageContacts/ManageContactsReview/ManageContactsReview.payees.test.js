import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { mockApiData, RenderWithProviders } from "utils/TestUtils";
import mockApi, { apiConfig, payeeBaseUrl } from "api";
import DataStore from "utils/store";
import { BILL_PAYMENT_PAYEES } from "utils/store/storeSchema";
import AntModalProvider from "StyleGuide/Components/Modal";
import {
  data,
  noPayees,
  noNickNamePayee
} from "ManageContacts/ContactsReviewTestData";
import { ManageContactsContext } from "ManageContacts/ManageContactsProvider";
import ManageContactsReview from "ManageContacts/ManageContactsReview/ManageContactsReview";

const url = `${payeeBaseUrl}/payees/005612`;

const defaultProps = {
  id: "manage-contacts",
  isPayee: true,
  setRecipient: jest.fn(),
  setPayeeDetails: jest.fn()
};

const renderWithMocks = (contactsData = data, props = defaultProps) =>
  render(
    <RenderWithProviders location="/" modalComponent={() => null}>
      <AntModalProvider>
        <ManageContactsContext.Provider
          value={{
            contactsInfo: { contactsData, setIsLoading: jest.fn() },
            page: {
              pageName: "",
              setPageName: jest.fn(),
              setOpenSnackbar: jest.fn(),
              setSnackbarMessage: jest.fn()
            },
            payee: { setPayeeToHandle: jest.fn() },
            recipient: {
              setRecipientToHandle: jest.fn(),
              setShowAutodeposit: jest.fn()
            }
          }}
        >
          <ManageContactsReview {...props} />
        </ManageContactsContext.Provider>
      </AntModalProvider>
    </RenderWithProviders>
  );

describe("ManageContactsReview for Payees", () => {
  afterEach(() => {
    jest.clearAllMocks();
    DataStore.flush();
  });

  it(">> Should render Payee headers", () => {
    renderWithMocks(data);
    const { getByText } = screen;

    expect(getByText("Payees")).toBeVisible();
    expect(getByText("Add payee")).toBeVisible();
  });

  it(">> Should render payee nickname when it is truthy", () => {
    renderWithMocks(data);
    const { getByText } = screen;

    expect(getByText("N")).toBeVisible();
    expect(getByText("Nick Name")).toBeVisible();
    expect(getByText("(0056)")).toBeVisible();
  });

  it(">> Should render payee name when nickname is falsy", () => {
    renderWithMocks(noNickNamePayee);
    const { getByText } = screen;

    expect(getByText("WESTBURNE WEST")).toBeVisible();
    expect(getByText("(0056)")).toBeVisible();
  });

  it(">> Should verify Icons", async () => {
    renderWithMocks(data);
    const { findByRole } = screen;

    const blueCross = await findByRole("button", { name: "Add Payee" });
    const trashCan = await findByRole("button", { name: "Delete Contact" });
    const chevron = await findByRole("img", { name: "Select Contact" });
    expect(blueCross).toBeVisible();
    expect(trashCan).toBeVisible();
    expect(chevron).toBeVisible();
  });

  it(">> Should verify Empty Payees state", async () => {
    renderWithMocks(noPayees);
    const { findByText } = screen;

    const payeeHeader = await findByText("No payees");
    expect(payeeHeader).toBeVisible();
  });

  it(">> Should verify Delete Modals appearance", async () => {
    renderWithMocks(data);
    const { findByRole, findByText } = screen;

    const payeeHeader = await findByText("Payees");
    expect(payeeHeader).toBeVisible();

    const trashCan = await findByRole("button", { name: "Delete Contact" });
    await act(async () => {
      fireEvent.click(trashCan);
    });

    const modalTitle = await findByText("Delete payee Nick Name (0056)?");
    const modalMessage = await findByText(
      "We will also delete any scheduled payments for this payee."
    );
    expect(modalTitle).toBeVisible();
    expect(modalMessage).toBeVisible();
  });

  it(">> Should verify Delete Modal's cancel click", async () => {
    renderWithMocks(data);
    const { findByRole, findByText, queryByText } = screen;

    const trashCan = await findByRole("button", { name: "Delete Contact" });
    await act(async () => {
      fireEvent.click(trashCan);
    });

    const modalHeader = await findByText("Delete payee Nick Name (0056)?");
    expect(modalHeader).toBeVisible();

    const cancelButton = await findByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(queryByText("Delete payee Nick Name (0056)?")).toBeNull();
  });

  it(">> Should verify Delete Payee", async () => {
    mockApiData([
      {
        url,
        method: "DELETE",
        results: {}
      }
    ]);

    renderWithMocks(data);
    const { findByRole, findByText, queryByText } = screen;

    const trashCan = await findByRole("button", { name: "Delete Contact" });
    await act(async () => {
      fireEvent.click(trashCan);
    });

    const confirmButton = await findByText("Delete payee");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(queryByText("Delete payee Nick Name (0056)?")).toBeNull();

    expect(mockApi.delete).toHaveBeenCalledWith(url, apiConfig);
  });

  it(">> Should empty DataStore payees when payee is deleted", async () => {
    DataStore.put(BILL_PAYMENT_PAYEES, data.payees);
    mockApiData([
      {
        url,
        method: "DELETE",
        results: {}
      }
    ]);

    renderWithMocks(data);
    const { findByRole, findByText, queryByText } = screen;

    const trashCan = await findByRole("button", { name: "Delete Contact" });
    await act(async () => {
      fireEvent.click(trashCan);
    });

    expect(DataStore.get(BILL_PAYMENT_PAYEES).value.length).toBe(1);
    const confirmButton = await findByText("Delete payee");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(queryByText("Delete payee Nick Name (0056)?")).toBeNull();

    expect(mockApi.delete).toHaveBeenCalledWith(url, apiConfig);
    expect(DataStore.get(BILL_PAYMENT_PAYEES)).toBeNull();
  });

  it(">> Should verify Pending transfer", async () => {
    mockApiData([
      {
        url,
        method: "DELETE",
        error: {
          response: {
            status: 422
          }
        }
      }
    ]);

    renderWithMocks(data);
    const { findByRole, findByText, queryByText } = screen;

    const trashCan = await findByRole("button", { name: "Delete Contact" });
    await act(async () => {
      fireEvent.click(trashCan);
    });

    const confirmButton = await findByText("Delete payee");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(queryByText("Delete payee Nick Name (0056)?")).toBeNull();

    expect(mockApi.delete).toHaveBeenCalledWith(url, apiConfig);

    const systemErrorModalTitle = await findByText("Pending Payments Detected");
    const systemErrorModalMessage = await findByText(
      "We couldn’t delete payee Nick Name because they have pending bill payments."
    );
    expect(systemErrorModalTitle).toBeVisible();
    expect(systemErrorModalMessage).toBeVisible();

    const okButton = await findByText("OK");
    await act(async () => {
      fireEvent.click(okButton);
    });

    expect(queryByText("Pending Payments Detected")).toBeNull();
  });

  it(">> Should verify Pending transfer modal show Payee Name and not Nick Name", async () => {
    mockApiData([
      {
        url,
        method: "DELETE",
        error: {
          response: {
            status: 422
          }
        }
      }
    ]);

    renderWithMocks(noNickNamePayee);
    const { findByRole, findByText, queryByText } = screen;

    const trashCan = await findByRole("button", { name: "Delete Contact" });
    await act(async () => {
      fireEvent.click(trashCan);
    });

    const modalHeader = await findByText("Delete payee WESTBURNE WEST (0056)?");
    expect(modalHeader).toBeVisible();

    const confirmButton = await findByText("Delete payee");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(queryByText("Delete payee WESTBURNE WEST (0056)?")).toBeNull();

    expect(mockApi.delete).toHaveBeenCalledWith(url, apiConfig);

    const systemErrorModalTitle = await findByText("Pending Payments Detected");
    const systemErrorModalMessage = await findByText(
      "We couldn’t delete payee WESTBURNE WEST because they have pending bill payments."
    );
    expect(systemErrorModalTitle).toBeVisible();
    expect(systemErrorModalMessage).toBeVisible();

    const okButton = await findByText("OK");
    await act(async () => {
      fireEvent.click(okButton);
    });

    expect(queryByText("Pending Payments Detected")).toBeNull();
  });

  it(">> Should verify System Error while delete payee", async () => {
    mockApiData([
      {
        url,
        method: "DELETE",
        error: {
          response: {
            status: 500
          }
        }
      }
    ]);

    renderWithMocks(data);
    const { findByRole, findByText, queryByText } = screen;

    const trashCan = await findByRole("button", { name: "Delete Contact" });
    await act(async () => {
      fireEvent.click(trashCan);
    });

    const confirmButton = await findByText("Delete payee");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(mockApi.delete).toHaveBeenCalledWith(url, apiConfig);

    const systemErrorModalTitle = await findByText("System Error");
    const systemErrorModalMessage = await findByText(
      "We couldn't delete payee Nick Name. Please try again."
    );
    expect(systemErrorModalTitle).toBeVisible();
    expect(systemErrorModalMessage).toBeVisible();

    const okButton = await findByText("OK");
    await act(async () => {
      fireEvent.click(okButton);
    });

    expect(queryByText("System Error")).toBeNull();
  });

  it(">> Should verify System Error Modal shows payee name", async () => {
    mockApiData([
      {
        url,
        method: "DELETE",
        error: {
          response: {
            status: 500
          }
        }
      }
    ]);

    renderWithMocks(noNickNamePayee);
    const { findByRole, findByText, queryByText } = screen;

    const trashCan = await findByRole("button", { name: "Delete Contact" });
    await act(async () => {
      fireEvent.click(trashCan);
    });

    const confirmButton = await findByText("Delete payee");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(mockApi.delete).toHaveBeenCalledWith(url, apiConfig);

    const systemErrorModalTitle = await findByText("System Error");
    const systemErrorModalMessage = await findByText(
      "We couldn't delete payee WESTBURNE WEST. Please try again."
    );
    expect(systemErrorModalTitle).toBeVisible();
    expect(systemErrorModalMessage).toBeVisible();

    const okButton = await findByText("OK");
    await act(async () => {
      fireEvent.click(okButton);
    });

    expect(queryByText("System Error")).toBeNull();
  });
});
