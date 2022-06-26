import React from "react";

import {
  render,
  screen,
  act,
  waitForElementToBeRemoved
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ModalProvider from "Common/ModalProvider";
import { MessageProvider } from "StyleGuide/Components";
import { mockApiData, windowMatchMediaMock } from "utils/TestUtils";
import { eTransferErrors } from "utils/MessageCatalog";
import DataStore from "utils/store";
import * as manualApi from "api/manualApiSend";

import ScheduledPayments from "./ScheduledPayments";

const renderScheduledPayments = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        initialEntries={["/move-money/bill-payment/scheduled-payments"]}
      >
        <MessageProvider>
          <ModalProvider>
            <ScheduledPayments />
          </ModalProvider>
        </MessageProvider>
      </MemoryRouter>
    );
  });
};

describe("Scheduled Bill Payment", () => {
  describe("Scheduled Bill Payments - Delete modal", () => {
    beforeEach(() => {
      DataStore.flush();
      mockApiData([
        {
          url: "/api/atb-rebank-api-billpayments/billpayments/",
          results: [
            {
              amount: { currency: "CAD", value: 0.02 },
              payeeCustomerReference: "987456852",
              payeeName: "CITY OF CALGARY PROPERTY TAX",
              payeeNickname: "CITY OF CALGARY",
              paymentDate: "2022-02-28",
              paymentExecutionCycle: {
                periodFrequency: 12,
                periodUnit: "Month",
                dayWithinPeriod: 28,
                nextExecutionDate: "2022-02-28",
                lastExecutionDate: "2022-03-01"
              },
              paymentId:
                "1S48fN5wjStqwg9YdnOhEQYn01IqGOMcICBEd86rHHyYifTkfiut6yLDkEBRWx12gJvJ0af_X_n6NqhgXUlzjesqQdRBlCCasOhdfyKgxK4",
              paymentType: "Recurring With End Date",
              postedDate: null,
              remainingPayments: "1",
              sourceAccountNumber: "6679",
              sourceAccountProductName: "Basic Account",
              status: "pending"
            }
          ]
        }
      ]);
    });

    it(">> should show the delete modal when trash button clicked", async () => {
      await renderScheduledPayments();
      const { getByRole, getByText, findByText } = screen;

      await act(async () => {
        fireEvent.click(getByRole("button", { name: "Delete" }));
      });
      const cancelModalButton = await findByText("Cancel these bill payments?");
      expect(cancelModalButton).toBeTruthy();
      expect(getByText("Confirm")).toBeTruthy();
      expect(getByText("Back")).toBeTruthy();
    });

    it(">> should hide the delete modal when Back button clicked", async () => {
      await renderScheduledPayments();
      const { getByRole, getByText, queryByText, findByText } = screen;

      await act(async () => {
        fireEvent.click(getByRole("button", { name: "Delete" }));
      });
      const cancelModalButton = await findByText("Cancel these bill payments?");
      expect(cancelModalButton).toBeTruthy();

      const backButton = getByText("Back");
      await act(async () => {
        fireEvent.click(backButton);
      });
      expect(
        queryByText("Cancel these bill payments?")
      ).not.toBeInTheDocument();
    });

    it(">> should disable the Confirm button in the delete modal after one click", async () => {
      jest
        .spyOn(manualApi, "manualApiSend")
        .mockImplementation(
          () => new Promise(resolve => setTimeout(resolve, 250))
        );

      await renderScheduledPayments();
      const { getByRole, getByText, findByText } = screen;

      await act(async () => {
        fireEvent.click(getByRole("button", { name: "Delete" }));
      });
      const cancelModalButton = await findByText("Cancel these bill payments?");
      expect(cancelModalButton).toBeTruthy();

      const confirmDeleteButton = getByText("Confirm");
      await act(async () => {
        fireEvent.click(confirmDeleteButton);
      });
      expect(confirmDeleteButton).toBeDisabled();
    });
  });

  describe("Scheduled Bill Payments - Data fetching failure", () => {
    const errorMessage = eTransferErrors.MSG_REBAS_000_CONTENT;
    beforeEach(async () => {
      windowMatchMediaMock();
      DataStore.flush();
      mockApiData([
        {
          url: "/api/atb-rebank-api-billpayments/billpayments/",
          error: "some error"
        }
      ]);

      await renderScheduledPayments();
    });

    it("should show error modal when failed to fetch data", async () => {
      const { findByText } = screen;
      expect(await findByText(errorMessage)).toBeVisible();
      expect(await findByText("OK")).toBeVisible();
    });

    it("should dismiss error modal when OK button is clicked", async () => {
      const { findByText, getByText } = screen;
      const okButton = await findByText("OK");

      act(() => {
        okButton.click();
      });
      await waitForElementToBeRemoved(() => getByText(errorMessage));
    });
  });
});
