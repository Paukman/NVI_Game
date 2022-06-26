import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import mockApi, { apiConfig, payeeBaseUrl } from "api";
import { mockApiData, RenderWithProviders } from "utils/TestUtils";
import AntModalProvider from "StyleGuide/Components/Modal";
import PayeeDetails from "./PayeeDetails";
import { data, noNickNamePayee } from "../ContactsReviewTestData";
import { ManageContactsContext } from "../ManageContactsProvider";

const url = `${payeeBaseUrl}/payees/005612`;

const mockAPIDeleteData = [
  {
    url,
    method: "DELETE",
    results: {}
  }
];

const payeeData = data.payees[0];
const noNicknameData = noNickNamePayee.payees[0];

const defaultProps = {
  id: "payee-details",
  detailsData: payeeData,
  setPayeeDetails: jest.fn()
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
          <PayeeDetails {...props} />
        </ManageContactsContext.Provider>
      </AntModalProvider>
    </RenderWithProviders>
  );

describe("Payee Details >> ", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(">> Should render Payee infomation", async () => {
    renderWithMocks();
    const { getByText } = screen;

    expect(getByText("WESTBURNE WEST (0056)")).toBeVisible();
    expect(getByText("3636510056")).toBeVisible();
    expect(getByText("Nick Name (0056)")).toBeVisible();
  });

  it(">> Should verify clicking cross icon", async () => {
    const setPayeeDetails = jest.fn();
    const props = { ...defaultProps, setPayeeDetails };
    renderWithMocks({ props });
    const { getByAltText } = screen;

    const crossButton = getByAltText("Close Payee");
    await act(async () => {
      fireEvent.click(crossButton);
    });

    expect(setPayeeDetails).toHaveBeenCalledTimes(1);
  });

  it(">> Should verify Delete Modal's appearance", async () => {
    renderWithMocks();
    const { findByText, getByText } = screen;

    const deleteButton = getByText("Delete");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const modalTitle = await findByText("Delete payee Nick Name (0056)?");
    const modalMessage = await findByText(
      "We will also delete any scheduled payments for this payee."
    );
    expect(modalTitle).toBeVisible();
    expect(modalMessage).toBeVisible();
  });

  it(">> Should verify Delete Modal shows Payee Name when no Nickname is given", async () => {
    const props = { ...defaultProps, detailsData: noNicknameData };
    renderWithMocks({ props });
    const { findByText, getByText } = screen;

    const deleteButton = getByText("Delete");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const modalTitle = await findByText("Delete payee WESTBURNE WEST (0056)?");
    const modalMessage = await findByText(
      "We will also delete any scheduled payments for this payee."
    );
    expect(modalTitle).toBeVisible();
    expect(modalMessage).toBeVisible();
  });

  it(">> Should verify Delete Payee", async () => {
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

    const deleteConfirmButton = await findByText("Delete payee");
    await act(async () => {
      fireEvent.click(deleteConfirmButton);
    });

    expect(queryByText("Delete payee Nick Name (0056)?")).toBeNull();

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

    const modalHeader = await findByText("Delete payee Nick Name (0056)?");
    expect(modalHeader).toBeVisible();

    const cancelButton = await findByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(queryByText("Delete payee Nick Name (0056)?")).toBeNull();

    expect(setPageName).toHaveBeenCalledTimes(0);
    expect(setOpenSnackbar).toHaveBeenCalledTimes(0);
    expect(setSnackbarMessage).toHaveBeenCalledTimes(0);
  });

  it(">> Should verify Pending payment", async () => {
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

    renderWithMocks();
    const { findByText, getByText, queryByText } = screen;

    const deleteButton = getByText("Delete");
    await act(async () => {
      fireEvent.click(deleteButton);
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

  it(">> Should verify Pending payement modal shows Payee Name when no nickname is present", async () => {
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

    const props = { ...defaultProps, detailsData: noNicknameData };
    renderWithMocks({ props });
    const { findByText, getByText, queryByText } = screen;

    const deleteButton = getByText("Delete");
    await act(async () => {
      fireEvent.click(deleteButton);
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

  it(">> Should verify System Error", async () => {
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

    renderWithMocks();
    const { findByText, getByText, queryByText } = screen;

    const deleteButton = getByText("Delete");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const modalHeader = await findByText("Delete payee Nick Name (0056)?");
    expect(modalHeader).toBeVisible();

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
});
