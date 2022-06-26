import React from "react";
import {
  render,
  act,
  fireEvent,
  findAllByRole,
  screen
} from "@testing-library/react";
import DataStore from "utils/store";
import { MemoryRouter } from "react-router-dom";
import {
  mockApiData,
  extraQueries,
  windowMatchMediaMock
} from "utils/TestUtils";
import MockDate from "mockdate";
import { transfersUrl, featureToggleBaseUrl } from "api";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ModalProvider from "Common/ModalProvider";
import AntModalProvider from "StyleGuide/Components/Modal";
import { MessageProvider } from "StyleGuide/Components";
import * as useResponsive from "utils/hooks/useResponsive";
import Transfer from "./index";
import TransferProvider from "./TransferProvider";
import { transferDataMock, transferDataMockDataReload } from "./constants";
import {
  oneTimeImmediateTransferFromUrl,
  oneTimeFutureDatedTransferFromUrl,
  recurringTransferFromUrl,
  transfersToUrl
} from "./TransferProvider/hooks/utils";

dayjs.extend(customParseFormat);

// Helps prevent GitLab pipeline failing due to timeout
jest.setTimeout(10000);

const renderComponent = () =>
  act(async () =>
    render(
      <MemoryRouter
        initialEntries={[
          "/move-money/transfer-between-accounts/one-time#create"
        ]}
      >
        <MessageProvider>
          <ModalProvider>
            <AntModalProvider>
              <TransferProvider>
                <Transfer />
              </TransferProvider>
            </AntModalProvider>
          </ModalProvider>
        </MessageProvider>
      </MemoryRouter>
    )
  );
const renderComponentWithExtraQueries = async () => {
  let queries;
  await act(async () => {
    queries = render(
      <MemoryRouter
        initialEntries={[
          "/move-money/transfer-between-accounts/one-time#create"
        ]}
      >
        <MessageProvider>
          <ModalProvider>
            <AntModalProvider>
              <TransferProvider>
                <Transfer />
              </TransferProvider>
            </AntModalProvider>
          </ModalProvider>
        </MessageProvider>
      </MemoryRouter>,
      { queries: { ...extraQueries } }
    );
  });
  return queries;
};

describe("Testing data persistence", () => {
  afterEach(() => {
    MockDate.reset();
    DataStore.flush();
  });
  beforeEach(() => {
    windowMatchMediaMock();
    MockDate.set("2019-01-30T10:20:30Z");
    DataStore.flush();
    mockApiData([
      {
        url: oneTimeImmediateTransferFromUrl,
        results: transferDataMock.oneTimeImmediateTransferFromAccounts
      },
      {
        url: oneTimeFutureDatedTransferFromUrl,
        results: transferDataMock.oneTimeFutureDatedTransferFromAccounts
      },
      {
        url: recurringTransferFromUrl,
        results: transferDataMock.recurringTransferFromAccounts
      },
      {
        url: transfersToUrl,
        results: transferDataMock.transfersToAccounts
      },
      {
        url: `${transfersUrl}/exchangerate`,
        results: [],
        error: "Server Error",
        method: "post"
      }
    ]);
  });

  it(">> should persist data", async () => {
    DataStore.flush();
    await renderComponent();
    const {
      getByTestId,
      findByTestId,
      findByPlaceholderText,
      findByAltText
    } = screen;

    // tabs for navigation
    const oneTimeTransfer = await findByAltText("pay-bill-one-time.svg");
    const recurringTransfer = await findByAltText("pay-bill-recurring-tab.svg");

    // fill in from in one-time
    let fromAccount = await findByTestId("dropdown-from");
    const fromAccountsOptions = await findAllByRole(fromAccount, "option");

    await act(async () => {
      fireEvent.click(fromAccountsOptions[1]);
    });
    expect(fromAccount.children[1].textContent).toBe(
      "Springboard Savings Account (1479) | $220,387.03 CAD"
    );

    // go to recurring form and check for persistence
    await act(async () => {
      fireEvent.click(recurringTransfer);
    });

    fromAccount = await findByTestId("dropdown-from");
    expect(fromAccount.children[1].textContent).toBe(
      "Springboard Savings Account (1479) | $220,387.03 CAD"
    );

    let toAccount = getByTestId("dropdown-to");
    expect(toAccount.children[1].textContent).toBe("Select account");
    const toAccountsOptions = await findAllByRole(toAccount, "option");
    await act(async () => {
      fireEvent.click(toAccountsOptions[2]);
    });

    expect(toAccount.children[1].textContent).toBe(
      "Tax-Free Saver Account (7100) | $3,106.88 CAD"
    );

    // back to one-time
    await act(async () => {
      fireEvent.click(oneTimeTransfer);
    });
    toAccount = await findByTestId("dropdown-to");
    expect(toAccount.children[1].textContent).toBe(
      "Tax-Free Saver Account (7100) | $3,106.88 CAD"
    );
    fromAccount = getByTestId("dropdown-from");
    expect(fromAccount.children[1].textContent).toBe(
      "Springboard Savings Account (1479) | $220,387.03 CAD"
    );

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      await fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    // back to recurring
    await act(async () => {
      fireEvent.click(recurringTransfer);
    });

    toAccount = await findByTestId("dropdown-to");
    expect(toAccount.children[1].textContent).toBe(
      "Tax-Free Saver Account (7100) | $3,106.88 CAD"
    );
    fromAccount = getByTestId("dropdown-from");
    expect(fromAccount.children[1].textContent).toBe(
      "Springboard Savings Account (1479) | $220,387.03 CAD"
    );
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("$100.00");
    await act(async () => {
      fireEvent.click(oneTimeTransfer);
    });
    toAccount = await findByTestId("dropdown-to");
    expect(toAccount.children[1].textContent).toBe(
      "Tax-Free Saver Account (7100) | $3,106.88 CAD"
    );
    fromAccount = getByTestId("dropdown-from");
    expect(fromAccount.children[1].textContent).toBe(
      "Springboard Savings Account (1479) | $220,387.03 CAD"
    );
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("$100.00");
  });
  it(">> should click between tabs", async () => {
    DataStore.flush();
    await renderComponent();
    const { findByText, findAllByText, findByAltText } = screen;

    const recurringTransfer = await findByAltText("pay-bill-recurring-tab.svg");
    const oneTimeTransfer = await findByAltText("pay-bill-one-time.svg");
    const scheduledTransfers = await findByAltText("etransfer-history.svg");

    await act(async () => {
      fireEvent.click(recurringTransfer);
    });
    let nextButton = await findByText("Next");
    expect(nextButton).toBeTruthy();
    await act(async () => {
      fireEvent.click(oneTimeTransfer);
    });
    nextButton = await findByText("Next");
    expect(nextButton).toBeTruthy();
    await act(async () => {
      fireEvent.click(scheduledTransfers);
    });
    const sheduledTransfersText = await findAllByText("Scheduled transfers");
    // one for tab, one for header
    expect(sheduledTransfersText).toHaveLength(2);
  });
});

describe("Testing cancel review modal", () => {
  afterEach(() => {
    MockDate.reset();
    DataStore.flush();
  });
  beforeEach(() => {
    windowMatchMediaMock();
    MockDate.set("2019-01-30T10:20:30Z");
    DataStore.flush();
    mockApiData([
      {
        url: oneTimeImmediateTransferFromUrl,
        results: transferDataMock.oneTimeImmediateTransferFromAccounts
      },
      {
        url: oneTimeFutureDatedTransferFromUrl,
        results: transferDataMock.oneTimeFutureDatedTransferFromAccounts
      },
      {
        url: recurringTransferFromUrl,
        results: transferDataMock.recurringTransferFromAccounts
      },
      {
        url: transfersToUrl,
        results: transferDataMock.transfersToAccounts
      }
    ]);
  });

  it(">> should edit from review for one-time", async () => {
    const {
      getByTestId,
      findByTestId,
      findByPlaceholderText,
      getByText,
      findByText,
      queryByDateTitle
    } = await renderComponentWithExtraQueries();

    // fill in data
    let fromAccount = await findByTestId("dropdown-from");
    const fromAccountsOptions = await findAllByRole(fromAccount, "option");

    await act(async () => {
      fireEvent.click(fromAccountsOptions[0]);
    });
    expect(fromAccount.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $42,000.01 CAD"
    );

    let toAccount = getByTestId("dropdown-to");
    const toAccountsOptions = await findAllByRole(toAccount, "option");
    await act(async () => {
      fireEvent.click(toAccountsOptions[2]);
    });
    expect(toAccount.children[1].textContent).toBe(
      "Tax-Free Saver Account (7100) | $3,106.88 CAD"
    );

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = getByTestId("date-when");
    await act(async () => {
      fireEvent.mouseDown(date);
      fireEvent.change(date, {
        target: { value: "Feb 10, 2019" }
      });
    });
    await act(async () => {
      fireEvent.click(queryByDateTitle("2019-02-10"));
    });
    expect(date.value).toBe("Feb 10, 2019");
    // move to the review page
    let nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });

    // confirm something from the review page
    const sendTransfer = await findByText("Send");
    expect(sendTransfer).toBeTruthy();

    const editButton = getByText("Edit");
    await act(async () => {
      fireEvent.click(editButton);
    });

    // back in form
    nextButton = await findByText("Next");
    expect(nextButton).toBeTruthy();
    fromAccount = getByTestId("dropdown-from");
    expect(fromAccount.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $42,000.01 CAD"
    );
    toAccount = getByTestId("dropdown-to");
    expect(toAccount.children[1].textContent).toBe(
      "Tax-Free Saver Account (7100) | $3,106.88 CAD"
    );
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("$100.00");
    const whenDate = getByTestId("date-when");
    expect(whenDate.value).toBe("Feb 10, 2019");
  });

  it(">> should cancel review for one-time", async () => {
    DataStore.flush();
    const {
      getByTestId,
      findByTestId,
      findByPlaceholderText,
      getByText,
      findByText,
      queryByDateTitle
    } = await renderComponentWithExtraQueries();

    // fill in data
    let fromAccount = await findByTestId("dropdown-from");
    const fromAccountsOptions = await findAllByRole(fromAccount, "option");

    await act(async () => {
      fireEvent.click(fromAccountsOptions[0]);
    });

    let toAccount = getByTestId("dropdown-to");
    const toAccountsOptions = await findAllByRole(toAccount, "option");
    await act(async () => {
      fireEvent.click(toAccountsOptions[1]);
    });

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });

    const date = getByTestId("date-when");
    await act(async () => {
      fireEvent.mouseDown(date);
      fireEvent.change(date, {
        target: { value: "Feb 10, 2019" }
      });
    });
    await act(async () => {
      fireEvent.click(queryByDateTitle("2019-02-10"));
    });

    // move to the review page
    let nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });

    // something in the review page
    let sendTransfer = await findByText("Send");
    expect(sendTransfer).toBeTruthy();

    // show modal to cancel the review
    let cancelButton = getByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    let modalText = await findByText("Cancel transfer?");
    expect(modalText).toBeTruthy();

    // go back to the review and confirm we're there
    const backButton = getByText("Back");
    await act(async () => {
      fireEvent.click(backButton);
    });

    sendTransfer = await findByText("Send");
    expect(sendTransfer).toBeTruthy();

    // show cancel modal once more but this time confirm
    cancelButton = getByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    modalText = await findByText("Cancel transfer", { exact: false });

    const confirmButton = getByText("Confirm");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    // back in empty form
    nextButton = await findByText("Next");
    fromAccount = getByTestId("dropdown-from");
    expect(fromAccount.children[1].textContent).toBe("Select account");
    toAccount = getByTestId("dropdown-to");
    expect(toAccount.children[1].textContent).toBe("Select account");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const whenDate = getByTestId("date-when");
    expect(whenDate.value).toBe("Jan 30, 2019");
  });

  it(">> should edit from review for recurring", async () => {
    const {
      getByTestId,
      findByPlaceholderText,
      getByText,
      findByText,
      findByAltText,
      queryByDateTitle
    } = await renderComponentWithExtraQueries();

    const recurringTransfer = await findByAltText("pay-bill-recurring-tab.svg");
    expect(recurringTransfer).toBeTruthy();

    await act(async () => {
      fireEvent.click(recurringTransfer);
    });

    // initial empty recurring form
    let nextButton = await findByText("Next");
    expect(nextButton).toBeTruthy();

    // fill in data
    let fromAccount = getByTestId("dropdown-from");
    const fromAccountsOptions = await findAllByRole(fromAccount, "option");

    await act(async () => {
      fireEvent.click(fromAccountsOptions[0]);
    });
    expect(fromAccount.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $42,000.01 CAD"
    );

    let toAccount = getByTestId("dropdown-to");
    const toAccountsOptions = await findAllByRole(toAccount, "option");
    await act(async () => {
      fireEvent.click(toAccountsOptions[2]);
    });
    expect(toAccount.children[1].textContent).toBe(
      "Tax-Free Saver Account (7100) | $3,106.88 CAD"
    );

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = getByTestId("date-starting");
    await act(async () => {
      fireEvent.mouseDown(date);
      fireEvent.change(date, {
        target: { value: "Feb 10, 2019" }
      });
    });
    await act(async () => {
      fireEvent.click(queryByDateTitle("2019-02-10"));
    });
    expect(date.value).toBe("Feb 10, 2019");

    let frequency = getByTestId("dropdown-frequency");
    const frequencyOptions = await findAllByRole(frequency, "option");
    await act(async () => {
      fireEvent.click(frequencyOptions[0]);
    });
    expect(frequency.children[0].textContent).toBe("Weekly");

    // move to the review page
    await act(async () => {
      fireEvent.click(nextButton);
    });

    // confirm something from the review page
    const sendTransfer = await findByText("Send");
    expect(sendTransfer).toBeTruthy();

    const editButton = getByText("Edit");
    await act(async () => {
      fireEvent.click(editButton);
    });

    // back in form
    nextButton = await findByText("Next");
    expect(nextButton).toBeTruthy();
    fromAccount = getByTestId("dropdown-from");
    expect(fromAccount.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $42,000.01 CAD"
    );
    toAccount = getByTestId("dropdown-to");
    expect(toAccount.children[1].textContent).toBe(
      "Tax-Free Saver Account (7100) | $3,106.88 CAD"
    );
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("$100.00");
    const staringDate = getByTestId("date-starting");
    expect(staringDate.value).toBe("Feb 10, 2019");

    frequency = getByTestId("dropdown-frequency");
    expect(frequency.children[0].textContent).toBe("Weekly");
  });

  it(">> should cancel review for recurring", async () => {
    const {
      getByTestId,
      findByPlaceholderText,
      getByText,
      findByText,
      findByAltText,
      queryByDateTitle
    } = await renderComponentWithExtraQueries();

    const recurringTransfer = await findByAltText("pay-bill-recurring-tab.svg");
    await act(async () => {
      fireEvent.click(recurringTransfer);
    });

    // initial empty recurring form
    let nextButton = await findByText("Next");

    // fill in data
    let fromAccount = getByTestId("dropdown-from");
    const fromAccountsOptions = await findAllByRole(fromAccount, "option");

    await act(async () => {
      fireEvent.click(fromAccountsOptions[0]);
    });

    let toAccount = getByTestId("dropdown-to");
    const toAccountsOptions = await findAllByRole(toAccount, "option");
    await act(async () => {
      fireEvent.click(toAccountsOptions[1]);
    });

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });

    const date = getByTestId("date-starting");
    await act(async () => {
      fireEvent.mouseDown(date);
      fireEvent.change(date, {
        target: { value: "Feb 10, 2019" }
      });
    });
    await act(async () => {
      fireEvent.click(queryByDateTitle("2019-02-10"));
    });

    let frequency = getByTestId("dropdown-frequency");
    const frequencyOptions = await findAllByRole(frequency, "option");
    await act(async () => {
      fireEvent.click(frequencyOptions[0]);
    });

    // move to the review page
    await act(async () => {
      fireEvent.click(nextButton);
    });

    // something in the review page
    let sendTransfer = await findByText("Send");

    // show modal to cancel the review
    let cancelButton = getByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    let modalText = await findByText("Cancel transfer?");
    expect(modalText).toBeTruthy();

    // go back to the review and confirm we're there
    const backButton = getByText("Back");
    await act(async () => {
      fireEvent.click(backButton);
    });

    sendTransfer = await findByText("Send");
    expect(sendTransfer).toBeTruthy();

    // show cancel modal once more but this time confirm
    cancelButton = getByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    modalText = await findByText("Cancel transfer", { exact: false });
    expect(modalText).toBeTruthy();

    const confirmButton = getByText("Confirm");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    // back in empty form
    nextButton = await findByText("Next");
    fromAccount = getByTestId("dropdown-from");
    expect(fromAccount.children[1].textContent).toBe("Select account");
    toAccount = getByTestId("dropdown-to");
    expect(toAccount.children[1].textContent).toBe("Select account");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const staringDate = getByTestId("date-starting");
    expect(staringDate.value).toBe("Jan 31, 2019");
    frequency = getByTestId("dropdown-frequency");
    expect(frequency.children[0].textContent).toBe("Select frequency");
  });
});

describe("Testing successful payments", () => {
  afterEach(() => {
    MockDate.reset();
    DataStore.flush();
  });
  beforeEach(() => {
    windowMatchMediaMock();
    MockDate.set("2019-01-30T10:20:30Z");
    DataStore.flush();
  });

  it(">> should make a payment for one-time and clear both forms on send another transfer", async () => {
    DataStore.flush();
    mockApiData([
      {
        url: oneTimeImmediateTransferFromUrl,
        results: transferDataMock.oneTimeImmediateTransferFromAccounts
      },
      {
        url: oneTimeFutureDatedTransferFromUrl,
        results: transferDataMock.oneTimeFutureDatedTransferFromAccounts
      },
      {
        url: recurringTransferFromUrl,
        results: transferDataMock.recurringTransferFromAccounts
      },
      {
        url: transfersToUrl,
        results: transferDataMock.transfersToAccounts
      },
      {
        url: `${transfersUrl}/`,
        method: "POST",
        status: 200,
        results: []
      }
    ]);
    const {
      getByTestId,
      findByTestId,
      findByPlaceholderText,
      getByText,
      findByText,
      findAllByText,
      findByAltText,
      queryByDateTitle
    } = await renderComponentWithExtraQueries();

    // fill in data
    let fromAccount = await findByTestId("dropdown-from");
    let fromAccountOptions = await findAllByRole(fromAccount, "option");

    await act(async () => {
      fireEvent.click(fromAccountOptions[1]);
    });

    expect(fromAccount.children[1].textContent).toBe(
      "Springboard Savings Account (1479) | $220,387.03 CAD"
    );

    let toAccount = getByTestId("dropdown-to");
    const toAccountOptions = await findAllByRole(toAccount, "option");
    await act(async () => {
      fireEvent.click(toAccountOptions[0]);
    });

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });

    const date = getByTestId("date-when");
    await act(async () => {
      fireEvent.mouseDown(date);
      fireEvent.change(date, {
        target: { value: "Feb 10, 2019" }
      });
    });
    await act(async () => {
      fireEvent.click(queryByDateTitle("2019-02-10"));
    });

    // move to the review page
    let nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });

    // we will simulate new API data before sending the transfer so we can
    // confirm it is called again
    mockApiData([
      {
        url: oneTimeImmediateTransferFromUrl,
        results: transferDataMockDataReload.oneTimeImmediateTransferFromAccounts
      },
      {
        url: oneTimeFutureDatedTransferFromUrl,
        results:
          transferDataMockDataReload.oneTimeFutureDatedTransferFromAccounts
      },
      {
        url: recurringTransferFromUrl,
        results: transferDataMockDataReload.recurringTransferFromAccounts
      },
      {
        url: transfersToUrl,
        results: transferDataMockDataReload.transfersToAccounts
      },
      {
        url: `${transfersUrl}/`,
        method: "POST",
        status: 200,
        results: []
      }
    ]);

    // confirm something from the review page
    const sendTransfer = await findByText("Send");
    await act(async () => {
      fireEvent.click(sendTransfer);
    });

    const successMessage = await findAllByText(
      "You've successfully created your transfer to No-Fee All-In Account."
    );
    expect(successMessage).toHaveLength(1); // we only check one on complete page

    // send another transfer
    const sendAnotherTransferButton = getByText("Send another transfer");
    await act(async () => {
      fireEvent.click(sendAnotherTransferButton);
    });

    // back in empty form
    nextButton = await findByText("Next");
    fromAccount = getByTestId("dropdown-from");
    expect(fromAccount.children[1].textContent).toBe("Select account");
    toAccount = getByTestId("dropdown-to");
    expect(toAccount.children[1].textContent).toBe("Select account");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const whenDate = getByTestId("date-when");
    expect(whenDate.value).toBe("Jan 30, 2019");

    // make sure recurring is empty as well
    const recurringTransfer = await findByAltText("pay-bill-recurring-tab.svg");

    await act(async () => {
      fireEvent.click(recurringTransfer);
    });
    nextButton = await findByText("Next");
    fromAccount = getByTestId("dropdown-from");
    expect(fromAccount.children[1].textContent).toBe("Select account");
    toAccount = getByTestId("dropdown-to");
    expect(toAccount.children[1].textContent).toBe("Select account");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const staringDate = getByTestId("date-starting");
    expect(staringDate.value).toBe("Jan 31, 2019");
    const frequency = getByTestId("dropdown-frequency");
    expect(frequency.children[0].textContent).toBe("Select frequency");

    // go back to one-time:
    const oneTimeTransfer = await findByAltText("pay-bill-one-time.svg");
    await act(async () => {
      fireEvent.click(oneTimeTransfer);
    });
    nextButton = await findByText("Next");
    fromAccount = getByTestId("dropdown-from");
    fromAccountOptions = await findAllByRole(fromAccount, "option");

    await act(async () => {
      fireEvent.click(fromAccountOptions[1]);
    });

    // verify that API is called, but this time with new data
    // confirming that we call API again after sending the transfer
    expect(fromAccount.children[1].textContent).toBe(
      "Springboard Savings Account (1479) | $300,000.01 CAD"
    );
  });

  it(">> should make a payment for recurring and clear both forms on send another transfer", async () => {
    DataStore.flush(); // for some reason I have to do it here as well, flushing after each not working?
    mockApiData([
      {
        url: oneTimeImmediateTransferFromUrl,
        results: transferDataMock.oneTimeImmediateTransferFromAccounts
      },
      {
        url: oneTimeFutureDatedTransferFromUrl,
        results: transferDataMock.oneTimeFutureDatedTransferFromAccounts
      },
      {
        url: recurringTransferFromUrl,
        results: transferDataMock.recurringTransferFromAccounts
      },
      {
        url: transfersToUrl,
        results: transferDataMock.transfersToAccounts
      },
      {
        url: `${transfersUrl}/`,
        method: "POST",
        status: 200,
        results: []
      }
    ]);
    const {
      getByTestId,
      findByTestId,
      findByPlaceholderText,
      getByText,
      findByText,
      findByAltText,
      findAllByText,
      queryByDateTitle
    } = await renderComponentWithExtraQueries();

    const recurringTransfer = await findByAltText("pay-bill-recurring-tab.svg");

    await act(async () => {
      fireEvent.click(recurringTransfer);
    });

    // fill in data
    let fromAccount = await findByTestId("dropdown-from");
    let fromAccountOptions = await findAllByRole(fromAccount, "option");

    await act(async () => {
      fireEvent.click(fromAccountOptions[1]);
    });

    expect(fromAccount.children[1].textContent).toBe(
      "Springboard Savings Account (1479) | $220,387.03 CAD"
    );

    let toAccount = getByTestId("dropdown-to");
    const toAccountOptions = await findAllByRole(toAccount, "option");
    await act(async () => {
      fireEvent.click(toAccountOptions[0]);
    });

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });

    const date = getByTestId("date-starting");
    await act(async () => {
      fireEvent.mouseDown(date);
      fireEvent.change(date, {
        target: { value: "Feb 10, 2019" }
      });
    });
    await act(async () => {
      fireEvent.click(queryByDateTitle("2019-02-10"));
    });

    let frequency = getByTestId("dropdown-frequency");
    const frequencyOptions = await findAllByRole(frequency, "option");
    await act(async () => {
      fireEvent.click(frequencyOptions[0]);
    });

    // move to the review page
    let nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });

    // we will simulate new API data before sending the transfer so we can
    // confirm it is called again
    mockApiData([
      {
        url: oneTimeImmediateTransferFromUrl,
        results: transferDataMockDataReload.oneTimeImmediateTransferFromAccounts
      },
      {
        url: oneTimeFutureDatedTransferFromUrl,
        results:
          transferDataMockDataReload.oneTimeFutureDatedTransferFromAccounts
      },
      {
        url: recurringTransferFromUrl,
        results: transferDataMockDataReload.recurringTransferFromAccounts
      },
      {
        url: transfersToUrl,
        results: transferDataMockDataReload.transfersToAccounts
      },
      {
        url: `${transfersUrl}/`,
        method: "POST",
        status: 200,
        results: []
      }
    ]);

    // confirm something from the review page
    const sendTransfer = await findByText("Send");

    await act(async () => {
      fireEvent.click(sendTransfer);
    });

    const successMessage = await findAllByText(
      "You've successfully created your transfers."
    );
    expect(successMessage).toHaveLength(2); // one for check mark, second for snackbar

    // send another transfer
    const sendAnotherTransferButton = getByText("Send another transfer");
    await act(async () => {
      fireEvent.click(sendAnotherTransferButton);
    });

    // back in empty form
    nextButton = await findByText("Next");
    fromAccount = getByTestId("dropdown-from");
    expect(fromAccount.children[1].textContent).toBe("Select account");
    toAccount = getByTestId("dropdown-to");
    expect(toAccount.children[1].textContent).toBe("Select account");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const staringDate = getByTestId("date-starting");
    expect(staringDate.value).toBe("Jan 31, 2019");
    frequency = getByTestId("dropdown-frequency");
    expect(frequency.children[0].textContent).toBe("Select frequency");

    // make sure one-time is empty as well
    const oneTimeTransfer = await findByAltText("pay-bill-one-time.svg");

    await act(async () => {
      fireEvent.click(oneTimeTransfer);
    });

    nextButton = await findByText("Next");
    fromAccount = getByTestId("dropdown-from");
    expect(fromAccount.children[1].textContent).toBe("Select account");
    toAccount = getByTestId("dropdown-to");
    expect(toAccount.children[1].textContent).toBe("Select account");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const whenDate = getByTestId("date-when");
    expect(whenDate.value).toBe("Jan 30, 2019");

    // go back to recurring
    await act(async () => {
      fireEvent.click(recurringTransfer);
    });
    nextButton = await findByText("Next");
    fromAccount = getByTestId("dropdown-from");
    fromAccountOptions = await findAllByRole(fromAccount, "option");

    await act(async () => {
      fireEvent.click(fromAccountOptions[1]);
    });

    // verify that API is called, but this time with new data
    // confirming that we call API again after sending the transfer
    expect(fromAccount.children[1].textContent).toBe(
      "Springboard Savings Account (1479) | $300,000.01 CAD"
    );
  });
});

describe("Testing failed payments", () => {
  afterEach(() => {
    MockDate.reset();
    DataStore.flush();
  });
  beforeEach(() => {
    windowMatchMediaMock();
    MockDate.set("2019-01-30T10:20:30Z");
    DataStore.flush();
    mockApiData([
      {
        url: oneTimeImmediateTransferFromUrl,
        results: transferDataMock.oneTimeImmediateTransferFromAccounts
      },
      {
        url: oneTimeFutureDatedTransferFromUrl,
        results: transferDataMock.oneTimeFutureDatedTransferFromAccounts
      },
      {
        url: recurringTransferFromUrl,
        results: transferDataMock.recurringTransferFromAccounts
      },
      {
        url: transfersToUrl,
        results: transferDataMock.transfersToAccounts
      },
      {
        url: `${transfersUrl}/`,
        result: [],
        method: "POST",
        error: {
          config: {
            url: `${transfersUrl}/`
          },
          message: "Something went wrong!"
        }
      }
    ]);
  });

  it(">> should fail a payment for one-time", async () => {
    const {
      getByTestId,
      findByTestId,
      findByPlaceholderText,
      getByText,
      findByText,
      findAllByText,
      queryByDateTitle
    } = await renderComponentWithExtraQueries();

    // fill in data
    const fromAccount = await findByTestId("dropdown-from");
    const fromAccountOptions = await findAllByRole(fromAccount, "option");

    await act(async () => {
      fireEvent.click(fromAccountOptions[1]);
    });

    const toAccount = getByTestId("dropdown-to");
    const toAccountOptions = await findAllByRole(toAccount, "option");
    await act(async () => {
      fireEvent.click(toAccountOptions[0]);
    });

    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });

    const date = getByTestId("date-when");
    await act(async () => {
      fireEvent.mouseDown(date);
      fireEvent.change(date, {
        target: { value: "Feb 10, 2019" }
      });
    });
    await act(async () => {
      fireEvent.click(queryByDateTitle("2019-02-10"));
    });

    // move to the review page
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });

    // confirm something from the review page
    const sendTransfer = await findByText("Send");

    await act(async () => {
      fireEvent.click(sendTransfer);
    });

    const transferFailed = await findAllByText("Transfer Failed");
    expect(transferFailed).toBeDefined();
    expect(getByText(/Something went wrong!/)).toBeTruthy();
  });

  it(">> should fail a payment for recurring", async () => {
    DataStore.flush(); // for some reason I have to do it here as well, flushing after each not working?
    const {
      getByTestId,
      findByTestId,
      findByPlaceholderText,
      getByText,
      findByText,
      findByAltText,
      findAllByText,
      queryByDateTitle
    } = await renderComponentWithExtraQueries();

    const recurringTransfer = await findByAltText("pay-bill-recurring-tab.svg");

    await act(async () => {
      fireEvent.click(recurringTransfer);
    });

    // fill in data
    const fromAccount = await findByTestId("dropdown-from");
    const fromAccountOptions = await findAllByRole(fromAccount, "option");

    await act(async () => {
      fireEvent.click(fromAccountOptions[1]);
    });

    const toAccount = getByTestId("dropdown-to");
    const toAccountOptions = await findAllByRole(toAccount, "option");
    await act(async () => {
      fireEvent.click(toAccountOptions[0]);
    });

    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });

    const date = getByTestId("date-starting");
    await act(async () => {
      fireEvent.mouseDown(date);
      fireEvent.change(date, {
        target: { value: "Feb 10, 2019" }
      });
    });
    await act(async () => {
      fireEvent.click(queryByDateTitle("2019-02-10"));
    });

    const frequency = getByTestId("dropdown-frequency");
    const frequencyOptions = await findAllByRole(frequency, "option");
    await act(async () => {
      fireEvent.click(frequencyOptions[0]);
    });

    // move to the review page
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });

    // confirm something from the review page
    const sendTransfer = await findByText("Send");

    await act(async () => {
      fireEvent.click(sendTransfer);
    });

    const transferFailed = await findAllByText("Transfer Failed");
    expect(transferFailed).toBeDefined();
    expect(getByText(/Something went wrong!/)).toBeTruthy();
  });
});

describe("Testing eligible accounts", () => {
  afterEach(() => {
    MockDate.reset();
    DataStore.flush();
  });
  beforeEach(() => {
    windowMatchMediaMock();
    MockDate.set("2019-01-30T10:20:30Z");
    DataStore.flush();
    mockApiData([
      {
        url: oneTimeImmediateTransferFromUrl,
        results: transferDataMock.oneTimeImmediateTransferFromAccounts
      },
      {
        url: oneTimeFutureDatedTransferFromUrl,
        results: transferDataMock.oneTimeFutureDatedTransferFromAccounts
      },
      {
        url: recurringTransferFromUrl,
        results: transferDataMock.recurringTransferFromAccounts
      },
      {
        url: transfersToUrl,
        results: transferDataMock.transfersToAccounts
      }
    ]);
  });
  it(">> should filter ineligible accounts for from field for one-time", async () => {
    DataStore.flush();
    await renderComponent();
    const { getByTestId, findByTestId } = screen;

    // select regular account from 'from'
    const fromAccount = await findByTestId("dropdown-from");
    let fromAccountOptions = await findAllByRole(fromAccount, "option");
    // 5 initialy
    expect(fromAccountOptions.length).toEqual(6);
    await act(async () => {
      fireEvent.click(fromAccountOptions[1]);
    });
    expect(fromAccount.children[1].textContent).toBe(
      "Springboard Savings Account (1479) | $220,387.03 CAD"
    );

    // select loan from 'to'
    const toAccount = getByTestId("dropdown-to");
    let toAccountOptions = await findAllByRole(toAccount, "option");
    // 8-1 springboard is removed
    expect(toAccountOptions.length).toEqual(8);
    await act(async () => {
      fireEvent.click(toAccountOptions[1]);
    });
    expect(toAccount.children[1].textContent).toBe(
      "Linked Line of Credit (7200) | $500,000.00 CAD"
    );

    // go back to 'from' and select different line of credit
    fromAccountOptions = await findAllByRole(fromAccount, "option");
    expect(fromAccountOptions.length).toEqual(5);
    await act(async () => {
      fireEvent.click(fromAccountOptions[3]);
    });
    expect(fromAccount.children[1].textContent).toBe(
      "Linked Line of Credit (9400) | $500,000.00 CAD"
    );

    // 'to' is cleared, and we have ineligible accounts in the list
    toAccountOptions = await findAllByRole(toAccount, "option");
    // 7 accounts, 1 divider
    expect(toAccountOptions.length).toEqual(9);
    expect(toAccount.children[1].textContent).toBe("Select account");

    expect(toAccountOptions[0].textContent).toEqual(
      "No-Fee All-In Account (7679) | $42,000.01 CAD"
    );
    expect(toAccountOptions[1].textContent).toEqual(
      "Springboard Savings Account (1479) | $220,387.03 CAD"
    );
    expect(toAccountOptions[2].textContent).toEqual(
      "Tax-Free Saver Account (7100) | $3,106.88 CAD"
    );
    expect(toAccountOptions[3].textContent).toEqual(
      "Residential Mortgage Loan (1100) | $0.00 CAD"
    );
    expect(toAccountOptions[4].textContent).toEqual(
      "TPPL Unsecured and Cash Secured (1700) | $0.00 CAD"
    );
    expect(toAccountOptions[5].textContent).toEqual("Ineligible accounts");
    expect(toAccountOptions[6].textContent).toEqual(
      "Linked Line of Credit (7200) | $500,000.00 CAD"
    );
    expect(toAccountOptions[7].textContent).toEqual(
      "Daily Interest Account (4700) | $858.11 CAD"
    );
    expect(toAccountOptions[8].textContent).toEqual(
      "Springboard Savings Account USD (1122) | $12,000.23 USD"
    );
  });

  it(">> should filter ineligible accounts for to field from one-time", async () => {
    DataStore.flush();
    await renderComponent();
    const { findByTestId } = screen;

    // select regular account from 'to'
    const toAccount = await findByTestId("dropdown-to");
    let toAccountOptions = await findAllByRole(toAccount, "option");
    // 8 accounts initially
    expect(toAccountOptions.length).toEqual(9);
    await act(async () => {
      fireEvent.click(toAccountOptions[1]);
    });
    expect(toAccount.children[1].textContent).toBe(
      "Springboard Savings Account (1479) | $220,387.03 CAD"
    );

    // select loan from 'from'
    const fromAccount = await findByTestId("dropdown-from");
    let fromAccountOptions = await findAllByRole(fromAccount, "option");
    // 5 - 1 (Springboard)
    expect(fromAccountOptions.length).toEqual(6);
    await act(async () => {
      fireEvent.click(fromAccountOptions[3]);
    });
    expect(fromAccount.children[1].textContent).toBe(
      "Linked Line of Credit (9400) | $500,000.00 CAD"
    );

    // select loan from 'to'
    toAccountOptions = await findAllByRole(toAccount, "option");
    // 8-1 loan is removed, Springboard is back
    expect(toAccountOptions.length).toEqual(8);
    await act(async () => {
      fireEvent.click(toAccountOptions[2]);
    });
    expect(toAccount.children[1].textContent).toBe(
      "Linked Line of Credit (7200) | $500,000.00 CAD"
    );

    // 'from' is cleared, and we have ineligible accounts in the list
    fromAccountOptions = await findAllByRole(fromAccount, "option");
    // 4 accounts, 1 divider
    expect(fromAccountOptions.length).toEqual(6);
    expect(fromAccount.children[1].textContent).toBe("Select account");

    expect(fromAccountOptions[0].textContent).toEqual(
      "No-Fee All-In Account (7679) | $42,000.01 CAD"
    );
    expect(fromAccountOptions[1].textContent).toEqual(
      "Springboard Savings Account (1479) | $220,387.03 CAD"
    );
    expect(fromAccountOptions[2].textContent).toEqual(
      "Tax-Free Saver Account (7100) | $3,106.88 CAD"
    );
    expect(fromAccountOptions[3].textContent).toEqual("Ineligible accounts");
    expect(fromAccountOptions[4].textContent).toEqual(
      "Linked Line of Credit (9400) | $500,000.00 CAD"
    );
    expect(toAccountOptions[5].textContent).toEqual(
      "TPPL Unsecured and Cash Secured (1700) | $0.00 CAD"
    );
  });

  it(">> should show `No future transactions` modal and reset to current date when unsupported account is selected", async () => {
    DataStore.flush();
    await renderComponent();
    const {
      getByTestId,
      getByText,
      findByText,
      findByTestId,
      queryByText
    } = screen;

    const fromAccount = await findByTestId("dropdown-from");
    const fromAccountOptions = await findAllByRole(fromAccount, "option");
    await act(async () => {
      fireEvent.click(fromAccountOptions[4]);
    });
    expect(fromAccount.children[1].textContent).toBe(
      "Linked Line of Credit (9400) | $500,000.00 CAD"
    );

    const dateField = getByTestId("date-when");

    fireEvent.mouseDown(dateField);
    fireEvent.change(dateField, {
      target: { value: "Feb 10, 2019" }
    });

    expect(dateField.value).toBe("Feb 10, 2019");

    let modalTitle = await findByText("Future transfers not supported");
    expect(modalTitle).toBeVisible();

    // Close modal
    const okButton = getByText("OK");
    fireEvent.click(okButton);

    modalTitle = queryByText("Future transfers not supported");
    expect(modalTitle).not.toBeInTheDocument();

    // Reset date
    expect(dateField.value).toBe("Jan 30, 2019");
  });
});

describe("Testing cross currency change to recurring modal", () => {
  afterEach(() => {
    DataStore.flush();
  });
  beforeEach(() => {
    windowMatchMediaMock();
    DataStore.flush();
    mockApiData([
      {
        url: oneTimeImmediateTransferFromUrl,
        results: transferDataMock.oneTimeImmediateTransferFromAccounts
      },
      {
        url: oneTimeFutureDatedTransferFromUrl,
        results: transferDataMock.oneTimeFutureDatedTransferFromAccounts
      },
      {
        url: transfersToUrl,
        results: transferDataMock.transfersToAccountsUSD
      },
      {
        url: `${featureToggleBaseUrl}/dev-rebank-cross-currency`,
        results: { status: true }
      }
    ]);
  });
  it(">> should display `No recurring transfers` modal if accounts are cross currency recurring link is clicked", async () => {
    DataStore.flush();
    global.window = { location: { pathname: null } };
    await renderComponent();
    const {
      getByTestId,
      findByTestId,
      getByText,
      findByText,
      findByRole,
      queryByText
    } = screen;

    // Select From CAD account
    const fromAccount = await findByTestId("dropdown-from");
    const fromAccountOptions = await findAllByRole(fromAccount, "option");
    await act(async () => {
      fireEvent.click(fromAccountOptions[1]);
    });
    expect(fromAccount.children[1].textContent).toBe(
      "Springboard Savings Account (1479) | $220,387.03 CAD"
    );

    // select To USD account
    const toAccount = getByTestId("dropdown-to");
    const toAccountOptions = await findAllByRole(toAccount, "option");
    await act(async () => {
      fireEvent.click(toAccountOptions[1]);
    });
    expect(toAccount.children[1].textContent).toBe(
      "Springboard Savings Account USD (1122) | $12,000.23 USD"
    );

    const recurringTransferLink = getByText("Recurring transfer");
    fireEvent.click(recurringTransferLink);

    let modalTitle = await findByText("Recurring Transfers Not Supported");
    expect(modalTitle).toBeVisible();

    // Back button should close modal and keep user on One-time transfer page
    const modalBackButton = await findByRole("button", { name: "Back" });
    fireEvent.click(modalBackButton);

    modalTitle = queryByText("Recurring Transfers Not Supported");
    expect(modalTitle).not.toBeInTheDocument();

    let frequencyField = queryByText("Frequency");
    expect(frequencyField).not.toBeInTheDocument();

    fireEvent.click(recurringTransferLink);

    // Continue button should close modal and move user to Recurring transfer page
    const modalContinueButton = await findByRole("button", {
      name: "Continue"
    });
    fireEvent.click(modalContinueButton);

    modalTitle = queryByText("Recurring Transfers Not Supported");
    expect(modalTitle).not.toBeInTheDocument();

    frequencyField = await findByText("Frequency");
    expect(frequencyField).toBeVisible();
  });
});

describe("Testing Tabbed menu/sidebar display for Scheduled Transfer details page view", () => {
  afterEach(() => {
    MockDate.reset();
    DataStore.flush();
  });
  beforeEach(() => {
    windowMatchMediaMock();
    DataStore.flush();
    mockApiData([
      {
        url: oneTimeImmediateTransferFromUrl,
        results: transferDataMock.oneTimeImmediateTransferFromAccounts
      },
      {
        url: oneTimeFutureDatedTransferFromUrl,
        results: transferDataMock.oneTimeFutureDatedTransferFromAccounts
      },
      {
        url: recurringTransferFromUrl,
        results: transferDataMock.recurringTransferFromAccounts
      },
      {
        url: transfersToUrl,
        results: transferDataMock.transfersToAccounts
      },
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

  it(">> should show sidebar menu/tabbed header for non-mobile view", async () => {
    await renderComponent();
    const { getByText, findByText } = screen;
    const scheduledTransfersTab = getByText("Scheduled transfers");

    fireEvent.click(scheduledTransfersTab);
    fireEvent.click(await findByText("Springboard Savings Account"));
    expect(scheduledTransfersTab).toBeInTheDocument();
  });

  it(">> should hide sidebar menu/tabbed header for mobile view", async () => {
    jest.spyOn(useResponsive, "default").mockReturnValue({
      screenIsAtMost: () => true
    });

    await renderComponent();
    const { getByText, findByText } = screen;
    const scheduledTransfersTab = getByText("Scheduled transfers");

    fireEvent.click(scheduledTransfersTab);
    fireEvent.click(await findByText("Springboard Savings Account"));
    expect(scheduledTransfersTab).not.toBeInTheDocument();
  });
});
