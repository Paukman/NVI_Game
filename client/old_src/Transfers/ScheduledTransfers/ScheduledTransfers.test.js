import React from "react";
import { render, act, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ModalProvider from "Common/ModalProvider";
import { MessageProvider } from "StyleGuide/Components";
import { transfersUrl } from "api";
import * as manualApi from "api/manualApiSend";
import {
  accountAndTransactionSummaryErrors,
  eTransferErrors
} from "utils/MessageCatalog";
import { mockApiData, windowMatchMediaMock } from "utils/TestUtils";
import DataStore from "utils/store";
import ScheduledTransfers from "./ScheduledTransfers";
import TransferProvider from "../TransferProvider/TransferProvider";

const renderScheduledTransfer = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <MessageProvider>
          <ModalProvider>
            <TransferProvider>
              <ScheduledTransfers />
            </TransferProvider>
          </ModalProvider>
        </MessageProvider>
      </MemoryRouter>
    );
  });
};

describe("Testing Scheduled Transfers", () => {
  beforeEach(() => {
    windowMatchMediaMock();
    DataStore.flush();
  });

  describe("> Skeleton State", () => {
    it(">> No Transaction", async () => {
      mockApiData([
        {
          url: `${transfersUrl}/transfers/pending`,
          results: []
        }
      ]);
      await renderScheduledTransfer();
      const { getByText } = screen;
      expect(getByText("Schedule new transfer")).toBeVisible();
      expect(
        getByText(accountAndTransactionSummaryErrors.MSG_REBAS_014C)
      ).toBeVisible();
    });

    it(">> Fetch API call failed", async () => {
      mockApiData([
        {
          url: `${transfersUrl}/transfers/pending`,
          error: "some error"
        }
      ]);
      await renderScheduledTransfer();
      const { findByText } = screen;
      expect(
        await findByText(eTransferErrors.MSG_REBAS_000_CONTENT)
      ).toBeVisible();
    });
  });

  describe("> Loaded state", () => {
    beforeEach(() => {
      DataStore.flush();
      mockApiData([
        {
          url: `${transfersUrl}/transfers/pending`,
          results: [
            {
              transferId:
                "AJIuJEeccXkdl4tPDD0AvY93NTp9JAYqCfuO87mbhjiuP6TV1Rl2jdFyfVF1eSWT_z1CkiHoC6GQZExgl3egqoQ1ZPlanhBbe3XRmIJPOjPJ34gvPqTRmL7day9gfIP2sHoVApqGMx9iSirvKntqmjbvnUtZ3s0nww5UPL_nKvc",
              status: "pending",
              paymentDate: "2020-05-08",
              sourceAccountProductName: "No-Fee All-In Account",
              sourceAccountNumber: "9479",
              sourceAccountCurrency: "CAD",
              targetAccountProductName: "Springboard Savings Account",
              targetAccountNumber: "8379",
              targetAccountCurrency: "CAD",
              amount: { currency: "CAD", value: 1 },
              remainingPayments: "1",
              paymentType: "One Time Future Dated"
            }
          ]
        }
      ]);
    });
    it(">> Testing header", async () => {
      await renderScheduledTransfer();
      const { getByText } = screen;

      expect(getByText("Scheduled transfers").textContent).toEqual(
        "Scheduled transfers"
      );
      expect(getByText("To")).toBeTruthy();
      expect(getByText("From")).toBeTruthy();
      expect(getByText("Amount")).toBeTruthy();
      expect(getByText("Next scheduled")).toBeTruthy();
    });

    it(">> Testing delete flow, list view", async () => {
      await renderScheduledTransfer();
      // Get array of delete icons, delete first
      const { getByRole, getByText } = screen;

      await act(async () => {
        fireEvent.click(getByRole("button", { name: "Delete" }));
      });
      expect(getByText("Cancel transfer?")).toBeTruthy();
      expect(
        getByText("From account: No-Fee All-In Account (9479)")
      ).toBeTruthy();
      expect(
        getByText("To account: Springboard Savings Account (8379)")
      ).toBeTruthy();
      expect(getByText("Amount: $1.00")).toBeTruthy();
    });

    it(">> Testing delete flow, details view", async () => {
      await renderScheduledTransfer();

      // Click on first item, delete from details view
      const { getByText } = screen;

      fireEvent.click(getByText("No-Fee All-In Account"));
      fireEvent.click(getByText("Cancel scheduled transfer"));

      expect(getByText("Cancel transfer?")).toBeTruthy();
      expect(
        getByText("From account: No-Fee All-In Account (9479)")
      ).toBeTruthy();
      expect(
        getByText("To account: Springboard Savings Account (8379)")
      ).toBeTruthy();
      expect(getByText("Amount: $1.00")).toBeTruthy();
    });

    it(">> should disable the confirm button in the delete modal after one click", async () => {
      jest
        .spyOn(manualApi, "manualApiSend")
        .mockImplementation(
          () => new Promise(resolve => setTimeout(resolve, 250))
        );

      await renderScheduledTransfer();
      const { getByRole, getByText } = screen;

      await act(async () => {
        fireEvent.click(getByRole("button", { name: "Delete" }));
      });
      expect(getByText("Cancel transfer?")).toBeTruthy();

      const confirmDeleteButton = getByText("Confirm");
      await act(async () => {
        fireEvent.click(confirmDeleteButton);
      });
      expect(confirmDeleteButton).toBeDisabled();
    });
  });
});
