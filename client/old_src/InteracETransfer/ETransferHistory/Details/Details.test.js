import React from "react";
import { fireEvent, act } from "@testing-library/react";
import ModalProvider from "Common/ModalProvider";
import { etransfersBaseUrl } from "api";
import { mockApiData } from "utils/TestUtils";
import { MessageProvider } from "StyleGuide/Components";
import { requestETransferErrors } from "utils/MessageCatalog";
import { transferDetails } from "../ETransferHistory.testdata";
import Details from "./Details";

const cancelledTransferDetails = {
  amount: { currency: "CAD", value: 4.92 },
  eTransferStatus: "Cancelled",
  expiryDate: "2020-10-22T00:00:00.000Z",
  fromAccount: { accountName: "Basic Account", accountNumber: "6679" },
  recipient: {
    aliasName: "Guy Incognito",
    notificationPreference: [
      {
        notificationHandleType: "Email",
        notificationHandle: "qwigibo@atb.com",
        isActive: true
      }
    ]
  },
  requestedExecutionDate: "2020-10-19T18:33:28.000Z",
  type: "transfer",
  eTransferId: 1
};

describe("Etransfer history details page", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });
  });

  const pendingDetailsUrl = `${etransfersBaseUrl}/1`;

  const props = {
    etransferDetails: {
      eTransferId: "1",
      recipient: "Jane Dood",
      amount: "34.56",
      status: "Cancelled",
      type: "transfer"
    },
    onClose: jest.fn()
  };

  it(">> Should close the page on clcking cross icon", async () => {
    mockApiData([
      {
        url: pendingDetailsUrl,
        results: transferDetails,
        status: 200
      }
    ]);
    let component;
    await act(async () => {
      component = render(
        <ModalProvider>
          <MessageProvider>
            <Details {...props} />
          </MessageProvider>
        </ModalProvider>
      );
    });
    const { findByAltText } = component;

    const closeIcon = await findByAltText("close");
    await act(async () => {
      fireEvent.click(closeIcon);
    });
    expect(props.onClose).toBeCalled();
  });

  it(">> Should loads cancelled transaction and hide some details", async () => {
    mockApiData([
      {
        url: pendingDetailsUrl,
        results: cancelledTransferDetails,
        status: 200
      }
    ]);
    let component;
    await act(async () => {
      component = render(
        <ModalProvider>
          <MessageProvider>
            <Details {...props} />
          </MessageProvider>
        </ModalProvider>
      );
    });
    const { queryByText, findByTestId } = component;

    const expiryDate = queryByText("Expiry date");
    expect(expiryDate).not.toBeInTheDocument();

    const cancelButton = queryByText("Cancel transaction");
    expect(cancelButton).not.toBeInTheDocument();

    // Need to update condition for getMemo to use eTransferStatus. Then I can enable this test

    const memoMessage = await findByTestId("on-screen-message");
    expect(memoMessage.textContent).toEqual(
      requestETransferErrors.MSG_RBET_037C
    );
  });

  it(">> Should render error modal", async () => {
    mockApiData([
      {
        url: pendingDetailsUrl,
        results: transferDetails,
        status: 500
      }
    ]);

    let component;
    await act(async () => {
      component = render(
        <ModalProvider>
          <MessageProvider>
            <Details {...props} />
          </MessageProvider>
        </ModalProvider>
      );
    });
    const { getByText, findByText } = component;

    const systemError = await findByText("System Error");
    expect(systemError).toBeTruthy();

    const okButton = getByText("OK");
    await act(async () => {
      fireEvent.click(okButton);
    });

    expect(props.onClose).toHaveBeenCalled();
  });
});
