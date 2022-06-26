import React from "react";
import { act, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockApiData, renderWithClient } from "utils/TestUtils";
import { accountsBaseUrl } from "api";
import getWindowDimensions from "utils/getWindowDimensions";
import useErrorModal from "utils/hooks/useErrorModal";
import { eTransferErrors } from "utils/MessageCatalog";
import DataStore from "utils/store";

import {
  noTransactions,
  creditCardOnlyOnePage,
  creditCardFirstPage,
  creditCardSecondPage,
  creditCardPendingTransactions,
  depositFirstPage,
  depositSecondPage
} from "./Transactions.testdata";
import Transactions from "./Transactions";

jest.mock("utils/getWindowDimensions");

const id = "details-creditcard-transactions";
const accountId = "QDmDXee-TPqxNtTHu57V1hEFrehrzZu8EdepxTTJ1vc";

const creditCardUrls = {
  posted: new RegExp(
    `${accountsBaseUrl}/creditcards/${accountId}/transactions\\?status=Completed&fromDate=.*&toDate=.*&limit=25$`
  ),
  morePosted: new RegExp(
    `${accountsBaseUrl}/creditcards/${accountId}/transactions\\?status=Completed&fromDate=.*&toDate=.*&limit=25&offset=1$`
  ),
  pending: `${accountsBaseUrl}/creditcards/${accountId}/transactions?status=Pending`
};

const depositUrls = {
  posted: `${accountsBaseUrl}/deposits/${accountId}/transactionsByCount?count=25`,
  morePosted: `${accountsBaseUrl}/deposits/${accountId}/transactionsByCount?count=25&lastKey=dakey&lastPostingDate=2019-10-24T06:00:00.000Z`,
  pending: `${accountsBaseUrl}/deposits/${accountId}/pendingTransactions`
};

const defaultProps = {
  id,
  accountId,
  type: "creditcard"
};

const TransactionsWrapper = props => {
  const { showErrorModal } = useErrorModal();

  return (
    <Transactions
      {...defaultProps}
      {...props}
      showErrorModal={showErrorModal}
    />
  );
};

const renderComponent = (props = {}) =>
  act(async () =>
    renderWithClient(
      <MemoryRouter initialEntries={[`/details/creditcard/123xyz`]}>
        <TransactionsWrapper {...props} />
      </MemoryRouter>,
      { container: document.body.appendChild(document.createElement("main")) }
    )
  );

describe("Transactions Tests", () => {
  beforeEach(() => {
    getWindowDimensions.mockReturnValue({ width: 1440 });
    DataStore.flush();
  });

  it(">> should show titles", async () => {
    await renderComponent({ type: "creditcard" });
    const { getByText } = screen;

    expect(getByText("Pending transactions")).toBeTruthy();
    expect(getByText("Posted transactions")).toBeTruthy();
  });

  describe("Credit card accounts", () => {
    it(">> should show more", async () => {
      mockApiData([
        {
          url: creditCardUrls.posted,
          results: creditCardFirstPage
        },
        {
          url: creditCardUrls.morePosted,
          results: creditCardSecondPage
        },
        {
          url: creditCardUrls.pending,
          results: creditCardPendingTransactions
        }
      ]);

      await renderComponent({ type: "creditcard" });
      const { findAllByText, getByText } = screen;

      expect(
        await findAllByText("CAT RIGHT TIME PAYMENTS CALGARY AB")
      ).toBeTruthy();

      const moreButton = getByText("Show more");
      await act(async () => {
        fireEvent.click(moreButton);
      });
      expect(getByText("DESCRIPTION ON NEXT PAGE")).toBeTruthy();
    });

    it(">> should show no credit card transactions message on desktop", async () => {
      mockApiData([
        {
          url: creditCardUrls.posted,
          results: noTransactions
        }
      ]);

      await renderComponent({ type: "creditcard" });
      const { getAllByText, getByText } = screen;

      expect(getByText("Pending transactions")).toBeTruthy();
      expect(getByText("Posted transactions")).toBeTruthy();
      expect(
        getAllByText("There are no transaction records to display.")
      ).toBeTruthy();
    });

    it(">> should show no credit card transactions message on mobile", async () => {
      getWindowDimensions.mockReturnValue({ width: 320 });
      mockApiData([
        {
          url: creditCardUrls.posted,
          results: noTransactions
        },
        {
          url: creditCardUrls.pending,
          results: noTransactions
        }
      ]);
      await renderComponent({ type: "creditcard" });
      const { getAllByText, getByText } = screen;

      expect(getByText("Pending transactions")).toBeTruthy();
      expect(getByText("Posted transactions")).toBeTruthy();
      expect(
        getAllByText("There are no transaction records to display.")
      ).toHaveLength(2);
    });

    it(">> should show pending transactions for `creditcard` type.", async () => {
      mockApiData([
        {
          url: creditCardUrls.pending,
          results: creditCardPendingTransactions
        }
      ]);

      await renderComponent({ type: "creditcard" });
      const { getByText } = screen;

      expect(getByText("A pending transaction")).toBeTruthy();
    });

    it(">> should show no MORE transactions", async () => {
      mockApiData([
        {
          url: creditCardUrls.posted,
          results: creditCardOnlyOnePage
        }
      ]);

      await renderComponent({ type: "creditcard" });
      const { getByText } = screen;

      expect(
        getByText(/To review older transactions, see your.*/)
      ).toBeTruthy();
    });

    it(">> should show an error modal when API fails to fetch posted credit card transactions", async () => {
      mockApiData([
        {
          url: creditCardUrls.posted,
          error: 500
        }
      ]);

      await renderComponent({ type: "creditcard" });
      const { findByText } = screen;

      const errorModal = await findByText(
        eTransferErrors.MSG_REBAS_000_CONTENT
      );
      expect(errorModal).toBeVisible();
    });

    it(">> should show an error modal when API fails to fetch pending credit card transactions", async () => {
      mockApiData([
        {
          url: creditCardUrls.pending,
          error: 500
        }
      ]);

      await renderComponent({ type: "creditcard" });
      const { findByText } = screen;

      const errorModal = await findByText(
        eTransferErrors.MSG_REBAS_000_CONTENT
      );
      expect(errorModal).toBeVisible();
    });

    it(">> should show a Try again button when API fails to fetch more credit card transactions", async () => {
      mockApiData([
        {
          url: creditCardUrls.posted,
          results: creditCardFirstPage
        },
        {
          url: creditCardUrls.pending,
          results: creditCardPendingTransactions
        },
        {
          url: creditCardUrls.morePosted,
          error: 500
        }
      ]);

      await renderComponent({ type: "creditcard" });
      const { getByText } = screen;

      const moreButton = getByText("Show more");
      await act(async () => {
        fireEvent.click(moreButton);
      });

      const errorMessage = getByText(eTransferErrors.MSG_REBAS_000_INLINE);
      const errorButton = getByText("Try again");
      expect(errorMessage).toBeVisible();
      expect(errorButton).toBeVisible();
    });
  });

  describe("Deposit accounts", () => {
    it(">> deposit - it should show more", async () => {
      mockApiData([
        {
          url: depositUrls.posted,
          results: depositFirstPage
        },
        {
          url: depositUrls.morePosted,
          results: depositSecondPage
        },
        {
          url: depositUrls.pending,
          results: noTransactions
        }
      ]);

      await renderComponent({ type: "deposit" });
      const { getByText, getAllByText } = screen;

      expect(getAllByText("PAYMENT - THANK YOU")).toBeTruthy();

      const moreButton = getByText("Show more");
      await act(async () => {
        fireEvent.click(moreButton);
      });
      expect(getByText("DEPOSIT SECOND PAGE")).toBeTruthy();
    });

    it(">> deposit - desktop view: it should show Visa Debit pending transactions.", async () => {
      mockApiData([
        {
          url: depositUrls.pending,
          results: [
            {
              transactionDate: "2021-01-29",
              paymentOrderId: "ATB   2021012900557387939905",
              description: "KGAS7125 MISSISSAUGA ONCA",
              netAmount: {
                currency: "CAD",
                value: 50
              },
              debitOrCredit: "Debit"
            },
            {
              transactionDate: "2021-01-29",
              paymentOrderId: "ATB   2021012900557387940002",
              description: "KGAS7126 MISSISSAUGA WEST",
              netAmount: {
                currency: "CAD",
                value: 1255.99
              },
              debitOrCredit: "Credit"
            }
          ]
        }
      ]);

      await renderComponent({ type: "deposit" });
      const { findByText, getByText, queryByText, getAllByText } = screen;

      expect(await findByText("Pending transactions")).toBeTruthy();
      expect(getByText("Posted transactions")).toBeTruthy();
      expect(getByText("Date")).toBeTruthy();
      expect(getByText("Description")).toBeTruthy();
      expect(getByText("Amount")).toBeTruthy();
      // Pending Visa Debit transactions should not display balance.
      expect(queryByText("Balance")).toBeNull();
      expect(queryByText("1,234.56")).toBeNull(); // Default balance value should not show.

      expect(getAllByText("Jan 29, 2021")).toBeTruthy();
      expect(getAllByText("KGAS7125 MISSISSAUGA ONCA")).toBeTruthy();
      expect(getAllByText("KGAS7126 MISSISSAUGA WEST")).toBeTruthy();
      expect(getByText("$50.00")).toBeTruthy();
      // Credit transaction type should have '+' sign.
      expect(getByText("+ $1,255.99")).toBeTruthy();
    });

    it(">> deposit - mobile view: it should show Visa Debit pending transactions.", async () => {
      getWindowDimensions.mockReturnValue({ width: 320 });
      mockApiData([
        {
          url: depositUrls.pending,
          results: [
            {
              transactionDate: "2021-01-29",
              paymentOrderId: "ATB   2021012900557387939905",
              description: "KGAS7125 MISSISSAUGA ONCA",
              netAmount: {
                currency: "CAD",
                value: 50
              },
              debitOrCredit: "Debit"
            },
            {
              transactionDate: "2021-01-29",
              paymentOrderId: "ATB   2021012900557387940002",
              description: "KGAS7126 MISSISSAUGA WEST",
              netAmount: {
                currency: "CAD",
                value: 1255.99
              },
              debitOrCredit: "Credit"
            }
          ]
        }
      ]);

      await renderComponent({ type: "deposit" });
      const { findByText, getByText, getAllByText } = screen;

      expect(await findByText("Jan 29, 2021")).toBeTruthy();
      expect(getAllByText("KGAS7125 MISSISSAUGA ONCA")).toBeTruthy();
      expect(getAllByText("KGAS7126 MISSISSAUGA WEST")).toBeTruthy();
      expect(getByText("$50.00")).toBeTruthy();
      // Credit transaction type should have '+' sign.
      expect(getByText("+ $1,255.99")).toBeTruthy();
    });

    it(">> deposit - desktop view: it should not show `Pending transactions` section if no Visa Debit pending transactions.", async () => {
      mockApiData([
        {
          url: depositUrls.pending,
          results: noTransactions
        }
      ]);

      await renderComponent({ type: "deposit" });
      const { queryByText, getByText } = screen;

      expect(queryByText("Pending transactions")).toBeNull();
      expect(getByText("Posted transactions")).toBeTruthy();
    });

    it(">> deposit - mobile view: it should not show `Pending transactions` section if no Visa Debit pending transactions.", async () => {
      getWindowDimensions.mockReturnValue({ width: 320 });

      mockApiData([
        {
          url: depositUrls.pending,
          results: []
        }
      ]);

      await renderComponent({ type: "deposit" });
      const { queryByText, getByText } = screen;

      expect(queryByText("Pending transactions")).toBeNull();
      expect(getByText("Posted transactions")).toBeTruthy();
    });

    it(">> deposit - desktop view: it should show no transactions message when no transactions available.", async () => {
      mockApiData([
        {
          url: depositUrls.posted,
          results: noTransactions
        }
      ]);

      await renderComponent({ type: "deposit" });
      const { getByText, queryByText } = screen;

      expect(getByText("Posted transactions")).toBeTruthy();
      expect(queryByText("Pending transactions")).toBeNull();
      expect(
        getByText("There are no transaction records to display.")
      ).toBeTruthy();
    });

    it(">> deposit - mobile view: it should show no transactions message when no transactions available.", async () => {
      getWindowDimensions.mockReturnValue({ width: 320 });
      mockApiData([
        {
          url: depositUrls.posted,
          results: noTransactions
        }
      ]);

      await renderComponent({ type: "deposit" });
      const { getByText, queryByText } = screen;

      expect(getByText("Posted transactions")).toBeTruthy();
      expect(queryByText("Pending transactions")).toBeNull();
      expect(
        getByText("There are no transaction records to display.")
      ).toBeTruthy();
    });

    it(">> deposit - should show an error modal when API fails to fetch posted deposit transactions", async () => {
      mockApiData([
        {
          url: depositUrls.posted,
          error: 500
        }
      ]);

      await renderComponent({ type: "deposit" });
      const { findByText } = screen;

      const errorModal = await findByText(
        eTransferErrors.MSG_REBAS_000_CONTENT
      );
      expect(errorModal).toBeVisible();
    });

    it(">> deposit - should show an error modal when API fails to fetch pending deposit transactions", async () => {
      mockApiData([
        {
          url: depositUrls.pending,
          error: 500
        }
      ]);

      await renderComponent({ type: "deposit" });
      const { findByText } = screen;

      const errorModal = await findByText(
        eTransferErrors.MSG_REBAS_000_CONTENT
      );
      expect(errorModal).toBeVisible();
    });

    it(">> deposit - should show a Try again button when API fails to fetch more posted deposit transactions", async () => {
      mockApiData([
        {
          url: depositUrls.posted,
          results: depositFirstPage
        },
        {
          url: depositUrls.pending,
          results: noTransactions
        },
        {
          url: depositUrls.morePosted,
          error: 500
        }
      ]);

      await renderComponent({ type: "deposit" });
      const { findByText, getByText } = screen;

      const moreButton = await findByText("Show more");
      await act(async () => {
        fireEvent.click(moreButton);
      });

      const errorMessage = await findByText(
        eTransferErrors.MSG_REBAS_000_INLINE
      );
      const errorButton = getByText("Try again");
      expect(errorMessage).toBeVisible();
      expect(errorButton).toBeVisible();
    });
  });
});
