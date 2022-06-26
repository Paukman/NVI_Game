import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import mockApi, { apiConfig, etransfersBaseUrl } from "api";
import { mockApiData, RenderWithProviders } from "utils/TestUtils";
import AntModalProvider from "StyleGuide/Components/Modal";
import { authNone } from "ManageContacts/ContactsReviewTestData";
import RecipientDetails from "./RecipientDetails";
import { ManageContactsContext } from "../ManageContactsProvider";

const url = `${etransfersBaseUrl}/recipients/CAuTRu9eXMwp`;

const mockAPIDeleteData = [
  {
    url,
    method: "DELETE",
    results: {
      data: {
        confirmationID: "12345"
      }
    }
  }
];

const recipient = {
  recipientDetails: {
    recipientId: "CAuTRu9eXMwp",
    aliasName: "Aaaron A (Ash)",
    defaultTransferAuthentication: {
      authenticationType: "Contact Level Security",
      question: "question",
      hashType: "SHA2"
    },
    notificationPreference: [
      {
        notificationHandleType: "Email",
        notificationHandle: "faketesting@atb.com",
        isActive: true
      }
    ]
  },
  transferType: 0
};
const authNoneRecipient = authNone.recipients[0];

const defaultProps = {
  id: "recipient-details",
  recipient,
  setRecipient: jest.fn()
};

const renderWithMocks = ({
  props = defaultProps,
  setPageName = jest.fn(),
  setOpenSnackbar = jest.fn(),
  setSnackbarMessage = jest.fn()
} = {}) =>
  render(
    <RenderWithProviders location="/" modalComponent={() => null}>
      <AntModalProvider>
        <ManageContactsContext.Provider
          value={{
            contactsInfo: { setIsLoading: jest.fn() },
            page: {
              pageName: "",
              setPageName,
              setOpenSnackbar,
              setSnackbarMessage
            }
          }}
        >
          <RecipientDetails {...props} />
        </ManageContactsContext.Provider>
      </AntModalProvider>
    </RenderWithProviders>
  );

describe("RecipientDetails", () => {
  it(">> Should render Recipient infomation with question and answer when autodeposit is not enabled", async () => {
    renderWithMocks();
    const { getByText } = screen;

    expect(getByText("Recipient name")).toBeVisible();
    expect(getByText("Aaaron A (Ash)")).toBeVisible();
    expect(getByText("Recipient email")).toBeVisible();
    expect(getByText("faketesting@atb.com")).toBeVisible();
    expect(getByText("Security question")).toBeVisible();
    expect(getByText("question")).toBeVisible();
    expect(getByText("Security answer")).toBeVisible();
  });

  it(">> Should render Recipient information without question and answer when autodeposit is enabled", async () => {
    const props = {
      ...defaultProps,
      recipient: {
        recipientDetails: {
          ...authNoneRecipient,
          legalName: "rebank auto deposit"
        },
        transferType: 2
      }
    };
    renderWithMocks({ props });
    const { getByTestId, getByText, queryByText } = screen;

    expect(getByText("Recipient name")).toBeVisible();
    expect(getByText("rebank auto deposit")).toBeVisible();
    expect(getByText("Recipient email")).toBeVisible();
    expect(getByText("faketesting@atb.com")).toBeVisible();

    expect(queryByText("Security question")).not.toBeInTheDocument();
    expect(queryByText("Security answer")).not.toBeInTheDocument();
    expect(getByText("Autodeposit")).toBeVisible();
    const autodepositMessage = getByTestId("autodeposit-enabled-message");
    expect(autodepositMessage.textContent).toBe(
      "rebank auto deposit has registered for Autodeposit of funds sent by Interac e-Transfer, so a security question isn't required. Transfers sent to faketesting@atb.com will be deposited automatically and can't be cancelled."
    );
  });
  it(">> Should verify clicking cross icon", async () => {
    const setRecipient = jest.fn();
    const props = { ...defaultProps, setRecipient };
    renderWithMocks({ props });
    const { getByAltText } = screen;

    const crossButton = getByAltText("Close Recipient");
    await act(async () => {
      fireEvent.click(crossButton);
    });

    expect(setRecipient).toHaveBeenCalledTimes(1);
  });
  it(">> Should verify Delete Modal's appearance", async () => {
    renderWithMocks();
    const { findByText, getByText } = screen;

    const deleteButton = getByText("Delete");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const modalTitle = await findByText("Delete recipient?");
    const modalMessage = await findByText("This will remove Aaaron A (Ash).");
    expect(modalTitle).toBeVisible();
    expect(modalMessage).toBeVisible();
  });

  it(">> Should verify Delete Recipient", async () => {
    mockApiData(mockAPIDeleteData);

    const setPageName = jest.fn();
    const setOpenSnackbar = jest.fn();
    const setSnackbarMessage = jest.fn();
    renderWithMocks({ setPageName, setOpenSnackbar, setSnackbarMessage });
    const { findByText, getByText, queryByText } = screen;

    const deleteButton = getByText("Delete");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const deleteConfirmButton = await findByText("Delete recipient");
    await act(async () => {
      fireEvent.click(deleteConfirmButton);
    });

    expect(queryByText("Delete recipient?")).toBeNull();

    expect(mockApi.delete).toHaveBeenCalledWith(url, apiConfig);

    expect(setPageName).toHaveBeenCalledTimes(1);
    expect(setOpenSnackbar).toHaveBeenCalledTimes(1);
    expect(setSnackbarMessage).toHaveBeenCalledTimes(1);
  });

  it(">> Should verify Delete Modal's Cancel", async () => {
    mockApiData(mockAPIDeleteData);

    const setPageName = jest.fn();
    const setOpenSnackbar = jest.fn();
    const setSnackbarMessage = jest.fn();
    renderWithMocks({ setPageName, setOpenSnackbar, setSnackbarMessage });
    const { findByText, getByText, queryByText } = screen;

    const deleteButton = getByText("Delete");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const modalHeader = await findByText("Delete recipient?");
    expect(modalHeader).toBeVisible();

    const cancelButton = await findByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(queryByText("Delete recipient?")).toBeNull();

    expect(setPageName).toHaveBeenCalledTimes(0);
    expect(setOpenSnackbar).toHaveBeenCalledTimes(0);
    expect(setSnackbarMessage).toHaveBeenCalledTimes(0);
  });

  it(">> Should verify Pending transfer", async () => {
    mockApiData([
      {
        url,
        method: "DELETE",
        error: {
          response: {
            status: 400,
            data: {
              code: "GENERIC_ERROR",
              message: "Failed to delete recipient."
            }
          }
        }
      }
    ]);

    renderWithMocks();
    const { findByTestId, findByText, getByText, queryByText } = screen;

    const deleteButton = getByText("Delete");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const confirmButton = await findByText("Delete recipient");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(queryByText("Delete recipient?")).toBeNull();

    expect(mockApi.delete).toHaveBeenCalledWith(url, apiConfig);

    const modalTitle = await findByText("Pending Transfers Detected");
    const modalErrorMessage = await findByTestId("ant-modal-content");

    expect(modalTitle).toBeVisible();
    expect(modalErrorMessage.textContent).toBe(
      "We couldn’t delete recipient Aaaron A (Ash) because they have pending Interac e-Transfer transactions."
    );

    const okButton = await findByText("OK");
    await act(async () => {
      fireEvent.click(okButton);
    });

    expect(queryByText("Pending Transfers Detected")).toBeNull();
  });

  it(">> Should verify System error on Delete", async () => {
    mockApiData([
      {
        url,
        method: "DELETE",
        error: {
          response: {
            status: 500,
            data: {
              code: "GENERIC_ERROR",
              message: "Failed to delete recipient."
            }
          }
        }
      }
    ]);

    renderWithMocks();
    const { findByText, getByText, queryByText } = screen;

    const deleteButton = getByText("Delete");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const confirmButton = await findByText("Delete recipient");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(queryByText("Delete recipient?")).toBeNull();

    expect(mockApi.delete).toHaveBeenCalledWith(url, apiConfig);

    const systemErrorModalTitle = await findByText("System Error");
    const systemErrorModalMessage = await findByText(
      "We couldn't delete recipient Aaaron A (Ash). Please try again."
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
