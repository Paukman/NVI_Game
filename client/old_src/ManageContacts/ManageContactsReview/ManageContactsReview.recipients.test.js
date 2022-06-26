import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { mockApiData, RenderWithProviders } from "utils/TestUtils";
import mockApi, { apiConfig, etransfersBaseUrl } from "api";
import { manageContactMessage } from "utils/MessageCatalog";
import AntModalProvider from "StyleGuide/Components/Modal";
import {
  data,
  noRecipients,
  authNone,
  nonSHA2
} from "ManageContacts/ContactsReviewTestData";
import { ManageContactsContext } from "ManageContacts/ManageContactsProvider";
import ManageContactsReview from "./ManageContactsReview";

const url = `${etransfersBaseUrl}/recipients/CAzvX8UAKu9X`;
const optionUrl = `${etransfersBaseUrl}/options`;

const defaultProps = {
  id: "manage-contacts",
  isPayee: false,
  setRecipient: jest.fn(),
  setPayeeDetails: jest.fn()
};

const renderWithMocks = (props = {}, contextValues = {}) => {
  const {
    contactsData = data,
    setRecipientToHandle = jest.fn()
  } = contextValues;

  render(
    <RenderWithProviders location="/" modalComponent={() => null}>
      <AntModalProvider>
        <ManageContactsContext.Provider
          value={{
            contactsInfo: {
              contactsData,
              setIsLoading: jest.fn(),
              updateContactState: jest.fn()
            },
            page: {
              pageName: "",
              setPageName: jest.fn(),
              setOpenSnackbar: jest.fn(),
              setSnackbarMessage: jest.fn()
            },
            payee: { setPayeeToHandle: jest.fn() },
            recipient: {
              setRecipientToHandle,
              setShowAutodeposit: jest.fn(),
              setLegalName: jest.fn()
            }
          }}
        >
          <ManageContactsReview {...defaultProps} {...props} />
        </ManageContactsContext.Provider>
      </AntModalProvider>
    </RenderWithProviders>
  );
};

describe("ManageContactsReview for Recipients", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(">> Should Match Header Values For Recipients", () => {
    renderWithMocks();
    const { getByText } = screen;

    const emailAddress = getByText(
      (_, { textContent }) => textContent === "(faketesting@atb.com)"
    );

    expect(getByText("Recipients")).toBeVisible();
    expect(getByText("Add recipient")).toBeVisible();
    expect(getByText("AB")).toBeVisible();
    expect(getByText("Aaaron Brick")).toBeVisible();
    expect(emailAddress).toBeVisible();
  });

  it(">> Should verify Icons", async () => {
    renderWithMocks();
    const { findByRole } = screen;

    const blueCross = await findByRole("button", { name: "Add Recipient" });
    const trashCan = await findByRole("button", { name: "Delete Contact" });
    const chevron = await findByRole("img", { name: "Select Contact" });
    expect(blueCross).toBeVisible();
    expect(trashCan).toBeVisible();
    expect(chevron).toBeVisible();
  });

  it(">> Should ensure `recipientToHandle` is reset to null on mount", () => {
    const setRecipientToHandle = jest.fn();
    renderWithMocks({}, { setRecipientToHandle });

    expect(setRecipientToHandle).toBeCalledWith(null);
  });

  it(">> Should verify Empty Recipient state", async () => {
    renderWithMocks({}, { contactsData: noRecipients });
    const { findByText } = screen;

    const recipientsHeader = await findByText("No recipients");
    expect(recipientsHeader).toBeVisible();
  });

  it(">> Should verify Delete Modal's appearance", async () => {
    renderWithMocks();
    const { findByRole, findByText } = screen;

    const recipientsHeader = await findByText("Recipients");
    expect(recipientsHeader).toBeVisible();

    const trashCan = await findByRole("button", { name: "Delete Contact" });
    await act(async () => {
      fireEvent.click(trashCan);
    });

    const modalTitle = await findByText("Delete recipient?");
    const modalMessage = await findByText("This will remove Aaaron Brick.");
    expect(modalTitle).toBeVisible();
    expect(modalMessage).toBeVisible();
  });

  it(">> Should verify Delete Modal's cancel click", async () => {
    renderWithMocks();
    const { findByRole, findByText, queryByText } = screen;

    const recipientsHeader = await findByText("Recipients");
    expect(recipientsHeader).toBeVisible();

    const trashCan = await findByRole("button", { name: "Delete Contact" });
    await act(async () => {
      fireEvent.click(trashCan);
    });

    const modalHeader = await findByText("Delete recipient?");
    expect(modalHeader).toBeVisible();

    const cancelButton = await findByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(queryByText("Delete recipient?")).toBeNull();
  });

  it(">> Should verify Delete Recipient", async () => {
    mockApiData([
      {
        url,
        method: "DELETE",
        results: {
          data: {
            confirmationID: "12345"
          }
        }
      }
    ]);

    renderWithMocks();
    const { findByRole, findByText, queryByText } = screen;

    const trashCan = await findByRole("button", { name: "Delete Contact" });
    await act(async () => {
      fireEvent.click(trashCan);
    });

    const confirmButton = await findByText("Delete recipient");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(queryByText("Delete recipient?")).toBeNull();

    expect(mockApi.delete).toHaveBeenCalledWith(url, apiConfig);
  });

  it(">> Should verify Delete Recipient fail on system error", async () => {
    mockApiData([
      {
        url,
        method: "DELETE",
        error: {
          response: {
            status: 500,
            data: {
              code: "GENERIC_ERROR",
              message: "Failed to add recipient."
            }
          }
        }
      }
    ]);

    renderWithMocks();
    const { findByRole, findByText, queryByText } = screen;

    const trashCan = await findByRole("button", { name: "Delete Contact" });
    await act(async () => {
      fireEvent.click(trashCan);
    });

    const confirmButton = await findByText("Delete recipient");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(queryByText("Delete recipient?")).toBeNull();

    expect(mockApi.delete).toHaveBeenCalledWith(url, apiConfig);

    const systemErrorModalTitle = await findByText("System Error");
    const systemErrorModalMessage = await findByText(
      "We couldn't delete recipient Aaaron Brick. Please try again."
    );
    expect(systemErrorModalTitle).toBeVisible();
    expect(systemErrorModalMessage).toBeVisible();

    const okButton = await findByText("OK");
    await act(async () => {
      fireEvent.click(okButton);
    });

    expect(queryByText("System Error")).toBeNull();
  });

  it(">> Should verify Pending transfer", async () => {
    mockApiData([
      {
        url,
        method: "DELETE",
        error: {
          response: {
            status: 400
          }
        }
      }
    ]);

    renderWithMocks();
    const { findByRole, findByTestId, findByText, queryByText } = screen;

    const trashCan = await findByRole("button", { name: "Delete Contact" });
    await act(async () => {
      fireEvent.click(trashCan);
    });

    const confirmButton = await findByText("Delete recipient");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(queryByText("Delete recipient?")).toBeNull();

    expect(mockApi.delete).toHaveBeenCalledWith(url, apiConfig);

    const pendingModalTitle = await findByText("Pending Transfers Detected");
    const pendingModalMessage = await findByTestId("ant-modal-content");

    expect(pendingModalTitle).toBeVisible();
    expect(pendingModalMessage.textContent).toBe(
      "We couldn’t delete recipient Aaaron Brick because they have pending Interac e-Transfer transactions."
    );

    const okButton = await findByText("OK");
    await act(async () => {
      fireEvent.click(okButton);
    });

    expect(queryByText("Pending Transfers Detected")).toBeNull();
  });

  it(">> Should verify rendering to details Page for user with Autodeposit ", async () => {
    mockApiData([
      {
        url: optionUrl,
        method: "POST",
        data: { email: "faketesting@atb.com" },
        results: [{ transferType: 2 }]
      }
    ]);

    const setRecipient = jest.fn();

    renderWithMocks({ setRecipient });
    const { getByText } = screen;

    const detailsDiv = getByText("Aaaron Brick");
    await act(async () => {
      fireEvent.click(detailsDiv);
    });

    expect(mockApi.post).toHaveBeenCalledWith(optionUrl, {
      email: "faketesting@atb.com"
    });
    expect(setRecipient).toHaveBeenCalledTimes(2);
  });

  it(">> Should verify rendering to details Page for user with SHA2 ", async () => {
    mockApiData([
      {
        url: optionUrl,
        method: "POST",
        data: { email: "faketesting@atb.com" },
        results: [{ transferType: 0 }]
      }
    ]);

    const setRecipient = jest.fn();

    renderWithMocks({ setRecipient });
    const { getByText } = screen;

    const detailsDiv = getByText("Aaaron Brick");
    await act(async () => {
      fireEvent.click(detailsDiv);
    });

    expect(mockApi.post).toHaveBeenCalledWith(optionUrl, {
      email: "faketesting@atb.com"
    });
    expect(setRecipient).toHaveBeenCalledTimes(2);
  });

  it(">> Should verify appearance of Alert Modal with Non SHA2 ", async () => {
    mockApiData([
      {
        url: optionUrl,
        method: "POST",
        data: { email: "faketesting@atb.com" },
        results: [{ transferType: 0 }]
      }
    ]);

    renderWithMocks({}, { contactsData: nonSHA2 });
    const { findByText, getByText } = screen;

    const detailsDiv = getByText("Aaaron Brick");
    await act(async () => {
      fireEvent.click(detailsDiv);
    });

    expect(mockApi.post).toHaveBeenCalledWith(optionUrl, {
      email: "faketesting@atb.com"
    });

    const modalTitle = await findByText(
      manageContactMessage.ADL_MSG_ET_060B_TITLE
    );
    expect(modalTitle).toBeVisible();
  });

  it(">> Should verify appearance of Alert Modal for authenticationType NONE ", async () => {
    mockApiData([
      {
        url: optionUrl,
        method: "POST",
        data: { email: "faketesting@atb.com" },
        results: [{ transferType: 0 }]
      }
    ]);

    renderWithMocks({}, { contactsData: authNone });
    const { findByText, getByText } = screen;

    const detailsDiv = getByText("rebank auto deposit");
    await act(async () => {
      fireEvent.click(detailsDiv);
    });

    expect(mockApi.post).toHaveBeenCalledWith(optionUrl, {
      email: "faketesting@atb.com"
    });
    const modalTitle = await findByText(
      manageContactMessage.MSG_RBET_060B_TITLE
    );
    expect(modalTitle).toBeVisible();
  });
});
