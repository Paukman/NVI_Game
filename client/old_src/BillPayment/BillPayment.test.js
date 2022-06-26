import React from "react";
import {
  render,
  act,
  fireEvent,
  screen,
  findAllByRole
} from "@testing-library/react";
import DataStore from "utils/store";
import ReactRouter from "react-router";
import { MemoryRouter } from "react-router-dom";
import { mockApiData, extraQueries } from "utils/TestUtils";
import { validateInvalidDate } from "utils";
import { billPaymentsBaseUrl, mfaBaseUrl } from "api";
import MockDate from "mockdate";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ModalProvider from "Common/ModalProvider";
import { MessageProvider } from "StyleGuide/Components";
import BillPayment from "./index";
import BillPaymentProvider from "./BillPaymentProvider";
import { payBillDataMock, recentPayments } from "./constants";
import * as utils from "./BillPaymentProvider/hooks/utils";

dayjs.extend(customParseFormat);

// Helps prevent GitLab pipeline failing due to timeout
jest.setTimeout(15000);

const challengesQuestionsURL = `${mfaBaseUrl}/challenges/questions`;
const challengesURL = `${mfaBaseUrl}/challenges/user`;
const challengesAnswersURL = `${mfaBaseUrl}/challenges/answers`;
const {
  immediatePayBillsFromUrl,
  recurringPayBillsFromUrl,
  billPayeesUrl
} = utils;

const renderBillPayment = async (type = "one-time#create") => {
  let container;
  await act(async () => {
    ({ container } = render(
      <MemoryRouter initialEntries={[`/move-money/bill-payment/${type}`]}>
        <MessageProvider>
          <ModalProvider>
            <BillPaymentProvider>
              <BillPayment />
            </BillPaymentProvider>
          </ModalProvider>
        </MessageProvider>
      </MemoryRouter>
    ));
  });
  return container;
};

const renderBillPaymentWithExtraQueries = async (type = "one-time#create") => {
  let queries;
  await act(async () => {
    queries = render(
      <MemoryRouter initialEntries={[`/move-money/bill-payment/${type}`]}>
        <MessageProvider>
          <ModalProvider>
            <BillPaymentProvider>
              <BillPayment />
            </BillPaymentProvider>
          </ModalProvider>
        </MessageProvider>
      </MemoryRouter>,
      { queries: extraQueries }
    );
  });
  return queries;
};

describe("Testing duplicate payments", () => {
  beforeEach(() => {
    MockDate.set("2019-01-30T10:20:30Z");
    DataStore.flush();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: billPayeesUrl,
        results: payBillDataMock.billPayees
      },
      {
        url: `${billPaymentsBaseUrl}/billpayments`,
        method: "POST",
        results: 200
      },
      {
        url:
          "/api/atb-rebank-api-billpayments/billpayments?status=completed,pending&fromDate=2019-01-30&toDate=2020-01-30",
        results: recentPayments,
        status: 200,
        method: "get"
      }
    ]);
  });
  afterEach(() => {
    MockDate.reset();
    DataStore.flush();
  });

  it(">> should detect duplicate payment and continue with payment", async () => {
    DataStore.flush();
    const {
      findByTestId,
      findByPlaceholderText,
      findByText,
      findAllByText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries();

    // fill in data
    const accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );

    const payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-when");
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
    const submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // try paying the bill
    const payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeTruthy();

    await act(async () => {
      fireEvent.click(payBillButton);
    });

    const duplicateModalHeader = await findByText("Duplicate Payment Detected");
    expect(duplicateModalHeader).toBeTruthy();

    // continue with payment
    const continuePayment = await findByText("Continue");
    expect(continuePayment).toBeTruthy();

    await act(async () => {
      fireEvent.click(continuePayment);
    });

    const successMessage = await findAllByText(
      "You've successfully created your bill payment to TELUS MOBILITY."
    );
    expect(successMessage).toHaveLength(2); // one for check mark, second for snackbar
  });

  it(">> should detect duplicate payment and cancel it", async () => {
    DataStore.flush();
    const {
      findByTestId,
      findByPlaceholderText,
      findByText,
      findAllByText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries();

    // fill in data
    let accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );

    let payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-when");
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
    const submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // try paying the bill
    const payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeTruthy();

    await act(async () => {
      fireEvent.click(payBillButton);
    });

    const duplicateModalHeader = await findByText("Duplicate Payment Detected");
    expect(duplicateModalHeader).toBeTruthy();

    // cancel payment
    const cancelPayment = await findAllByText("Cancel");
    expect(cancelPayment).toHaveLength(2); // one from review page and one from duplicate payment modal

    await act(async () => {
      fireEvent.click(cancelPayment[1]);
    });

    // back at create page
    // verify both forms are clean for another bill payment
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe("Select account");
    payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("Select bill payee");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const whenDate = await findByTestId("date-when");
    expect(whenDate.value).toBe("Jan 30, 2019");
  });
});
// TODO - DE - these tests could be improved, seeing lots of duplicate validations
describe("Testing Bill Payment starting page", () => {
  afterEach(() => {
    MockDate.reset();
    DataStore.flush();
  });
  beforeEach(() => {
    MockDate.set("2019-01-30T10:20:30Z");
    DataStore.flush();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: billPayeesUrl,
        results: payBillDataMock.billPayees
      }
    ]);
  });

  it(">> should render tabs and one time component by default", async () => {
    const container = await renderBillPayment();
    const {
      findByPlaceholderText,
      findByText,
      findByTestId,
      queryByTestId,
      findByAltText
    } = screen;

    const oneTimePayment = await findByAltText("pay-bill-one-time.svg");
    expect(oneTimePayment).toBeTruthy();

    const oneTimePaymentText = await findByText("One-time payment", {
      exact: true
    });
    expect(oneTimePaymentText).toBeDefined();

    const recurringPayment = await findByAltText("pay-bill-recurring-tab.svg");
    expect(recurringPayment).toBeTruthy();

    const recurringPaymentText = await findByText("Recurring payment", {
      exact: true
    });
    expect(recurringPaymentText).toBeDefined();

    // tabs
    // AT remark: this approach should be abandoned when we refactor tabMenuSelector
    expect(container.querySelector("#bill-payment-sidebar-container").toExist);
    expect(
      container.querySelector(
        "#bill-payment-sidebar-container > div.sidebar-tabs"
      ).children
    ).toHaveLength(2);

    // one-time form
    const submitButton = await findByText("Submit");
    expect(submitButton).toBeTruthy();
    const accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe("Select account");
    const payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("Select bill payee");
    const amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const whenDate = await findByTestId("date-when");
    expect(validateInvalidDate(whenDate.value)).toBeTruthy();

    // nothing from recurring
    const startingDate = queryByTestId("date-starting");
    expect(startingDate).toBeNull();
  });

  it(">> should switch between one time payment and recurring payment", async () => {
    await renderBillPayment();
    const {
      findByPlaceholderText,
      findByText,
      findByTestId,
      queryByTestId,
      findByAltText
    } = screen;

    // tabs
    const oneTimePayment = await findByAltText("pay-bill-one-time.svg");
    expect(oneTimePayment).toBeTruthy();

    const recurringPayment = await findByAltText("pay-bill-recurring-tab.svg");
    expect(recurringPayment).toBeTruthy();

    await act(async () => {
      fireEvent.click(recurringPayment);
    });

    // initial empty recurring form
    let submitButton = await findByText("Submit");
    expect(submitButton).toBeTruthy();
    let accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe("Select account");
    let payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("Select bill payee");
    let amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const frequency = await findByTestId("dropdown-frequency");
    // [0] is here because we don't have search. For to/from is [1]
    expect(frequency.children[0].textContent).toBe("Select frequency");
    let startingDate = queryByTestId("date-starting");
    // Just check for valid date. It will populated with current date, mocking works only locally.
    expect(validateInvalidDate(startingDate.value)).toBeTruthy();
    const whenDate = queryByTestId("date-when");
    expect(whenDate).toBeNull();

    await act(async () => {
      fireEvent.click(oneTimePayment);
    });

    // back at one-time form
    submitButton = await findByText("Submit");
    expect(submitButton).toBeTruthy();
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe("Select account");
    payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("Select bill payee");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const date = await findByTestId("date-when");
    // Just check for valid date. It will populated with current date, mocking works only locally.
    expect(validateInvalidDate(date.value)).toBeTruthy();

    startingDate = queryByTestId("date-starting");
    expect(startingDate).toBeNull();
  });

  it(">> should persist data", async () => {
    await renderBillPayment();
    const { findByTestId, findByPlaceholderText, findByAltText } = screen;

    // tabs
    const oneTimePayment = await findByAltText("pay-bill-one-time.svg");
    expect(oneTimePayment).toBeTruthy();

    const recurringPayment = await findByAltText("pay-bill-recurring-tab.svg");
    expect(recurringPayment).toBeTruthy();

    // fill in from in one-time
    let accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );

    // go to recurring form and check for persistence
    await act(async () => {
      fireEvent.click(recurringPayment);
    });

    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );

    let payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    //     // back to one-time
    await act(async () => {
      fireEvent.click(oneTimePayment);
    });
    payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    // back to recurring
    await act(async () => {
      fireEvent.click(recurringPayment);
    });

    payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("$100.00");
    // back to one-time
    await act(async () => {
      fireEvent.click(oneTimePayment);
    });
    payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("$100.00");
  });

  it(">> should show validation errors", async () => {
    await renderBillPayment();
    const { getByText, findByText, findByAltText } = screen;

    // move to the review page
    let submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(getByText("Select an account.")).toBeTruthy();
    expect(getByText("Select a payee.")).toBeTruthy();
    expect(getByText("Enter an amount.")).toBeTruthy();

    const recurringPayment = await findByAltText("pay-bill-recurring-tab.svg");
    expect(recurringPayment).toBeTruthy();

    await act(async () => {
      fireEvent.click(recurringPayment);
    });

    submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(getByText("Select an account.")).toBeTruthy();
    expect(getByText("Select a payee.")).toBeTruthy();
    expect(getByText("Enter an amount.")).toBeTruthy();
    expect(getByText("Select a frequency.")).toBeTruthy();
  });

  it(">> should call add payee modal from the payee dropdown menu", async () => {
    await renderBillPayment();

    const { findAllByText, findByTestId } = screen;
    const payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    act(() => {
      fireEvent.click(payeeOptions[0]);
    });
    expect(payees.children[1].textContent).toBe("Add payee");

    const addPayeeText = await findAllByText(/Account number/);
    expect(addPayeeText).toHaveLength(1);
  });
});

describe("Testing successful payments", () => {
  beforeEach(() => {
    MockDate.set("2019-01-30T10:20:30Z");
    DataStore.flush();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: billPayeesUrl,
        results: payBillDataMock.billPayees
      },
      {
        url: `${billPaymentsBaseUrl}/billpayments`,
        method: "POST",
        results: 200
      },
      {
        url: `${billPaymentsBaseUrl}/billpayments?status=completed,pending&fromDate=2020-05-25&toDate=2020-05-27`,
        results: "",
        status: 200,
        method: "get"
      }
    ]);
  });
  afterEach(() => {
    MockDate.reset();
    DataStore.flush();
  });

  it(">> should make a payment for one-time", async () => {
    const {
      findByTestId,
      findByPlaceholderText,
      findByText,
      findAllByText,
      findByAltText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries();

    // fill in data
    let accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );

    let payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-when");
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

    // // move to the review page
    const submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm something from the review page
    const payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeTruthy();

    await act(async () => {
      fireEvent.click(payBillButton);
    });

    const successMessage = await findAllByText(
      "You've successfully created your bill payment to TELUS MOBILITY."
    );
    expect(successMessage).toHaveLength(2); // one for check mark, second for snackbar

    const payAnotherBill = await findByText("Pay another bill");
    await act(async () => {
      fireEvent.click(payAnotherBill);
    });

    // verify both forms are clean for another bill payment
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe("Select account");
    payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("Select bill payee");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const whenDate = await findByTestId("date-when");
    expect(whenDate.value).toBe("Jan 30, 2019");

    const recurringPayment = await findByAltText("pay-bill-recurring-tab.svg");
    expect(recurringPayment).toBeTruthy();

    await act(async () => {
      fireEvent.click(recurringPayment);
    });

    // recurring is clean too
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe("Select account");
    payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("Select bill payee");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const startingDate = await findByTestId("date-starting");
    expect(startingDate.value).toBe("Jan 31, 2019");
    const frequency = await findByTestId("dropdown-frequency");
    expect(frequency.children[0].textContent).toBe("Select frequency");
  });

  it(">> should make a payment for recurring", async () => {
    const {
      findByTestId,
      findByPlaceholderText,
      findByText,
      findAllByText,
      findByAltText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries("recurring#create");

    const recurringPayment = await findByAltText("pay-bill-recurring-tab.svg");
    expect(recurringPayment).toBeTruthy();

    await act(async () => {
      fireEvent.click(recurringPayment);
    });

    // fill in data
    let accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );

    let payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");
    const date = await findByTestId("date-starting");
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

    let frequency = await findByTestId("dropdown-frequency");
    const frequencyOptions = await findAllByRole(frequency, "option");
    await act(async () => {
      fireEvent.click(frequencyOptions[0]);
    });
    expect(frequency.children[0].textContent).toBe("Weekly");

    // move to the review page
    const submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm something from the review page
    const payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeTruthy();

    await act(async () => {
      fireEvent.click(payBillButton);
    });

    const successMessage = await findAllByText(
      "You've successfully created your bill payment(s) to TELUS MOBILITY."
    );
    expect(successMessage).toHaveLength(2); // one for check mark, second for snackbar

    const payAnotherBill = await findByText("Pay another bill");
    await act(async () => {
      fireEvent.click(payAnotherBill);
    });

    // verify both forms are clean for another bill payment
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe("Select account");
    payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("Select bill payee");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const startingDate = await findByTestId("date-starting");
    expect(startingDate.value).toBe("Jan 31, 2019");
    frequency = await findByTestId("dropdown-frequency");
    expect(frequency.children[0].textContent).toBe("Select frequency");

    const oneTimePayment = await findByAltText("pay-bill-one-time.svg");
    expect(oneTimePayment).toBeTruthy();

    await act(async () => {
      fireEvent.click(oneTimePayment);
    });

    // one-time is clean too
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe("Select account");
    payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("Select bill payee");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const whenDate = await findByTestId("date-when");
    expect(whenDate.value).toBe("Jan 30, 2019");
  });
});

describe("Testing cancel review modal", () => {
  afterEach(() => {
    MockDate.reset();
    DataStore.flush();
  });
  beforeEach(() => {
    MockDate.set("2019-01-30T10:20:30Z");
    DataStore.flush();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: billPayeesUrl,
        results: payBillDataMock.billPayees
      }
    ]);
  });

  it(">> should edit from review for one-time", async () => {
    const {
      findByTestId,
      findByPlaceholderText,
      findByText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries();

    // fill in data
    let accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );

    let payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-when");
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
    let submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm something from the review page
    const payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeTruthy();

    const editButton = await findByText("Edit");
    await act(async () => {
      fireEvent.click(editButton);
    });

    // back in form
    submitButton = await findByText("Submit");
    expect(submitButton).toBeTruthy();
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );
    payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("$100.00");
    const whenDate = await findByTestId("date-when");
    expect(whenDate.value).toBe("Feb 10, 2019");
  });

  it(">> should cancel review for one-time", async () => {
    const {
      findByTestId,
      findByPlaceholderText,
      findByText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries();

    // fill in data
    let accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );

    let payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-when");
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
    let submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // something in the review page
    let payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeTruthy();

    // show modal to cancel the review
    let cancelButton = await findByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    let modalText = await findByText("Cancel bill payment?");
    expect(modalText).toBeTruthy();

    // go back to the review and confirm we're there
    const backButton = await findByText("Back");
    await act(async () => {
      fireEvent.click(backButton);
    });

    payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeTruthy();

    // show cancel modal once more but this time confirm
    cancelButton = await findByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    modalText = await findByText("Cancel bill payment", { exact: false });

    expect(modalText).toBeTruthy();

    const confirmButton = await findByText("Confirm");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    // back in empty form
    submitButton = await findByText("Submit");
    expect(submitButton).toBeTruthy();
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe("Select account");
    payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("Select bill payee");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const whenDate = await findByTestId("date-when");
    expect(whenDate.value).toBe("Jan 30, 2019");
  });

  it(">> should edit from review for recurring", async () => {
    const {
      findByPlaceholderText,
      findByText,
      findByTestId,
      findByAltText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries("recurring#create");
    const recurringPayment = await findByAltText("pay-bill-recurring-tab.svg");
    expect(recurringPayment).toBeTruthy();

    await act(async () => {
      fireEvent.click(recurringPayment);
    });

    // fill in data
    let accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );

    let payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-starting");
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

    let frequency = await findByTestId("dropdown-frequency");
    const frequencyOptions = await findAllByRole(frequency, "option");
    await act(async () => {
      fireEvent.click(frequencyOptions[0]);
    });
    expect(frequency.children[0].textContent).toBe("Weekly");

    // move to the review page
    let submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm something from the review page
    const payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeTruthy();

    const editButton = await findByText("Edit");
    await act(async () => {
      fireEvent.click(editButton);
    });

    // back in form
    submitButton = await findByText("Submit");
    expect(submitButton).toBeTruthy();
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );
    payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("$100.00");
    const startingDate = await findByTestId("date-starting");
    expect(startingDate.value).toBe("Feb 10, 2019");

    frequency = await findByTestId("dropdown-frequency");
    expect(frequency.children[0].textContent).toBe("Weekly");
  });

  it(">> should cancel review for recurring", async () => {
    const {
      findByPlaceholderText,
      findByText,
      findByTestId,
      findByAltText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries("recurring#create");
    const recurringPayment = await findByAltText("pay-bill-recurring-tab.svg");
    expect(recurringPayment).toBeTruthy();

    await act(async () => {
      fireEvent.click(recurringPayment);
    });

    // fill in data
    let accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );

    let payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    let amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");
    const date = await findByTestId("date-starting");
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

    let frequency = await findByTestId("dropdown-frequency");
    const frequencyOptions = await findAllByRole(frequency, "option");
    await act(async () => {
      fireEvent.click(frequencyOptions[0]);
    });
    expect(frequency.children[0].textContent).toBe("Weekly");

    // move to the review page
    let submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // something in the review page
    let payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeTruthy();

    // show modal to cancel the review
    let cancelButton = await findByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    let modalText = await findByText("Cancel these bill payments?");
    expect(modalText).toBeTruthy();

    // go back to the review and confirm we're there
    const backButton = await findByText("Back");
    await act(async () => {
      fireEvent.click(backButton);
    });

    payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeTruthy();

    // show cancel modal once more but this time confirm
    cancelButton = await findByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    modalText = await findByText("Cancel these bill payments", {
      exact: false
    });
    expect(modalText).toBeTruthy();

    const confirmButton = await findByText("Confirm");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    // back in empty form
    submitButton = await findByText("Submit");
    expect(submitButton).toBeTruthy();
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe("Select account");
    payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("Select bill payee");
    amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const startingDate = await findByTestId("date-starting");
    expect(startingDate.value).toBe("Jan 31, 2019");
    frequency = await findByTestId("dropdown-frequency");
    expect(frequency.children[0].textContent).toBe("Select frequency");
  });
});

describe("Testing failed payments", () => {
  afterEach(() => {
    MockDate.reset();
    DataStore.flush();
  });
  beforeEach(() => {
    MockDate.set("2019-01-30T10:20:30Z");
    DataStore.flush();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: billPayeesUrl,
        results: payBillDataMock.billPayees
      },
      {
        url: `${billPaymentsBaseUrl}/billpayments`,
        result: [],
        method: "POST",
        error: {
          config: {
            url: "/api/atb-rebank-api-billpayments/billpayments"
          },
          message: "billPayeeId property is missing"
        }
      }
    ]);
  });
  it(">> should fail payment for one-time payment", async () => {
    const {
      findByTestId,
      findByPlaceholderText,
      findByText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries();

    // fill in data
    const accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );

    const payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-when");
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
    const submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm something from the review page
    const payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeTruthy();

    await act(async () => {
      fireEvent.click(payBillButton);
    });

    const paymentFailed = await findByText("Payment failed");
    expect(paymentFailed).toBeDefined();
  });

  it(">> should fail payment for recurring payment", async () => {
    const {
      findByTestId,
      findByPlaceholderText,
      findByText,
      findByAltText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries("recurring#create");

    const recurringPayment = await findByAltText("pay-bill-recurring-tab.svg");
    expect(recurringPayment).toBeTruthy();

    await act(async () => {
      fireEvent.click(recurringPayment);
    });

    // fill in data
    const accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accounts.children[1].textContent).toBe(
      "No-Fee All-In Account (7679) | $93,428.49 CAD"
    );

    const payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-starting");
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

    const frequency = await findByTestId("dropdown-frequency");
    const frequencyOptions = await findAllByRole(frequency, "option");
    await act(async () => {
      fireEvent.click(frequencyOptions[0]);
    });
    expect(frequency.children[0].textContent).toBe("Weekly");

    // move to the review page
    const submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm something from the review page
    const payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeTruthy();

    await act(async () => {
      fireEvent.click(payBillButton);
    });

    const paymentFailed = await findByText("Payment failed");
    expect(paymentFailed).toBeDefined();
  });
});

describe("Testing no payees", () => {
  beforeEach(() => {
    DataStore.flush();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: billPayeesUrl,
        results: null
      }
    ]);
  });
  afterEach(() => {
    DataStore.flush();
  });

  it(">> should cancel no payees modal on one time", async () => {
    await renderBillPayment();
    const { findByText, findByTestId, findByPlaceholderText } = screen;
    const modalText = await findByText(/No payees have been created./);
    expect(modalText).toBeDefined();

    const cancelButton = await findByText(/Cancel/);
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // should be in one-time form
    const submitButton = await findByText("Submit");
    expect(submitButton).toBeTruthy();
    const accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe("Select account");
    const payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("Select bill payee");
    const amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const whenDate = await findByTestId("date-when");
    // Just check for valid date. It will populated with current date, mocking works only locally.
    expect(validateInvalidDate(whenDate.value)).toBeTruthy();
  });
  it(">> should show add payee modal on bill payment", async () => {
    await renderBillPayment("#addPayee");
    const { findAllByText } = screen;
    const addPayeeText = await findAllByText(/Account number/);
    expect(addPayeeText).toHaveLength(1);
  });
  it(">> should add payee modal from no payees modal on one time", async () => {
    await renderBillPayment();
    const { findByText, getAllByText, findAllByText } = screen;
    const modalText = await findByText(/No payees have been created./);
    expect(modalText).toBeDefined();

    const addPayeeButtons = getAllByText(/Add payee/);
    expect(addPayeeButtons).toHaveLength(2); // one from dropdown menu, one from modal
    await act(async () => {
      fireEvent.click(addPayeeButtons[1]);
    });

    const addPayeeText = await findAllByText(/Account number/);
    expect(addPayeeText).toHaveLength(1);
  });
  it(">> should cancel no payees modal on recurring", async () => {
    await renderBillPayment("recurring#create");
    const {
      findByText,
      findByTestId,
      findByPlaceholderText,
      queryByTestId
    } = screen;
    const modalText = await findByText(/No payees have been created./);
    expect(modalText).toBeDefined();

    const cancelButton = await findByText(/Cancel/);
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // should be in one-time form
    const submitButton = await findByText("Submit");
    expect(submitButton).toBeTruthy();
    const accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe("Select account");
    const payees = await findByTestId("dropdown-to");
    expect(payees.children[1].textContent).toBe("Select bill payee");
    const amount = await findByPlaceholderText("$");
    expect(amount.value).toEqual("");
    const frequency = await findByTestId("dropdown-frequency");
    // [0] is here because we don't have search. For to/from is [1]
    expect(frequency.children[0].textContent).toBe("Select frequency");
    const startingDate = queryByTestId("date-starting");
    // Just check for valid date. It will populated with current date, mocking works only locally.
    expect(validateInvalidDate(startingDate.value)).toBeTruthy();
  });
  it(">> should show add payees modal on recurring", async () => {
    await renderBillPayment("recurring#create");
    const { findByText, getAllByText, findAllByText } = screen;
    const modalText = await findByText(/No payees have been created./);
    expect(modalText).toBeDefined();

    const addPayeeButtons = getAllByText(/Add payee/);
    expect(addPayeeButtons).toHaveLength(2); // one from dropdown menu, one from modal
    await act(async () => {
      fireEvent.click(addPayeeButtons[1]);
    });

    const addPayeeText = await findAllByText(/Account number/);
    expect(addPayeeText).toHaveLength(1);
  });
  it(">> should show add new payee on recurring", async () => {
    await renderBillPayment("recurring#create");
    const { findByText, getAllByText, findAllByText } = screen;
    const modalText = await findByText(/No payees have been created./);
    expect(modalText).toBeDefined();

    const addPayeeButtons = getAllByText(/Add payee/);
    expect(addPayeeButtons).toHaveLength(2); // one from dropdown menu, one from modal
    await act(async () => {
      fireEvent.click(addPayeeButtons[1]);
    });

    const addPayeeText = await findAllByText(/Account number/);
    expect(addPayeeText).toHaveLength(1);
  });
});

describe("Testing credit card warning", () => {
  beforeEach(() => {
    MockDate.set("2019-01-30T10:20:30Z");
    DataStore.flush();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: billPayeesUrl,
        results: payBillDataMock.billPayees
      }
    ]);
  });

  afterEach(() => {
    MockDate.reset();
    DataStore.flush();
  });

  it(">> should show credit card warning for one-time and return to create page", async () => {
    const {
      findByTestId,
      findByPlaceholderText,
      getAllByText,
      queryByDateTitle,
      findByText
    } = await renderBillPaymentWithExtraQueries();

    // fill in data
    let accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[2]);
    });
    expect(accounts.children[1].textContent).toBe(
      "CREDIT CARD TEST ACCOUNT (4435) | $89,486.63 CAD"
    );

    const payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-when");
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
    const submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm credit card warning
    await act(async () => {
      await findByText(/This transfer is a cash advance from your credit card/);
    });
    const creditCardText = await findByText(
      /This transfer is a cash advance from your credit card/
    );
    expect(creditCardText).toBeDefined();
    const cancelButton = getAllByText("Cancel"); // because it is rendering review page there is 2 cancel buttons
    await act(async () => {
      fireEvent.click(cancelButton[1]);
    });

    // // back in create page:
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe(
      "CREDIT CARD TEST ACCOUNT (4435) | $89,486.63 CAD"
    );
  });

  it(">> should show credit card warning for one-time and stay on review page", async () => {
    const {
      findByTestId,
      findByPlaceholderText,
      findByText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries();

    // fill in data
    const accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[2]);
    });
    expect(accounts.children[1].textContent).toBe(
      "CREDIT CARD TEST ACCOUNT (4435) | $89,486.63 CAD"
    );

    const payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-when");
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
    const submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm credit card warning
    const creditCardText = await findByText(
      /This transfer is a cash advance from your credit card/
    );
    expect(creditCardText).toBeDefined();
    const cancelButton = await findByText("OK"); // because it is rendering review page there is 2 cancel buttons
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // on review in create page:
    const payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeDefined();
  });

  it(">> should show credit card warning for recurring and return to create page", async () => {
    const {
      findByTestId,
      findByPlaceholderText,
      findByText,
      getAllByText,
      findByAltText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries("recurring#create");

    const recurringPayment = await findByAltText("pay-bill-recurring-tab.svg");
    expect(recurringPayment).toBeTruthy();

    await act(async () => {
      fireEvent.click(recurringPayment);
    });

    // fill in data
    let accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[2]);
    });
    expect(accounts.children[1].textContent).toBe(
      "CREDIT CARD TEST ACCOUNT (4435) | $89,486.63 CAD"
    );

    const payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-starting");
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

    const frequency = await findByTestId("dropdown-frequency");
    const frequencyOptions = await findAllByRole(frequency, "option");
    await act(async () => {
      fireEvent.click(frequencyOptions[0]);
    });
    expect(frequency.children[0].textContent).toBe("Weekly");

    // move to the review page
    const submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm credit card warning
    const creditCardText = await findByText(
      /This transfer is a cash advance from your credit card/
    );
    expect(creditCardText).toBeDefined();
    const cancelButton = getAllByText("Cancel"); // because it is rendering review page there is 2 cancel buttons
    await act(async () => {
      fireEvent.click(cancelButton[1]);
    });

    // back in create page:
    accounts = await findByTestId("dropdown-from");
    expect(accounts.children[1].textContent).toBe(
      "CREDIT CARD TEST ACCOUNT (4435) | $89,486.63 CAD"
    );
  });

  it(">> should show credit card warning for recurring and stay on review page", async () => {
    const {
      findByTestId,
      findByPlaceholderText,
      findByText,
      findByAltText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries("recurring#create");

    const recurringPayment = await findByAltText("pay-bill-recurring-tab.svg");
    expect(recurringPayment).toBeTruthy();

    await act(async () => {
      fireEvent.click(recurringPayment);
    });

    // fill in data
    const accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[2]);
    });
    expect(accounts.children[1].textContent).toBe(
      "CREDIT CARD TEST ACCOUNT (4435) | $89,486.63 CAD"
    );

    const payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-starting");
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

    const frequency = await findByTestId("dropdown-frequency");
    const frequencyOptions = await findAllByRole(frequency, "option");
    await act(async () => {
      fireEvent.click(frequencyOptions[0]);
    });
    expect(frequency.children[0].textContent).toBe("Weekly");

    // move to the review page
    const submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm credit card warning
    const creditCardText = await findByText(
      /This transfer is a cash advance from your credit card/
    );
    expect(creditCardText).toBeDefined();
    const cancelButton = await findByText("OK"); // because it is rendering review page there is 2 cancel buttons
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // on review in create page:
    const payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeDefined();
  });
});
describe("recurring payment with RSA", () => {
  beforeEach(() => {
    MockDate.set("2019-01-30T10:20:30Z");
    DataStore.flush();
  });
  afterEach(() => {
    MockDate.reset();
    DataStore.flush();
  });
  it("recurring pay with success RSA", async () => {
    DataStore.flush();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: billPayeesUrl,
        results: payBillDataMock.billPayees
      },
      {
        url: challengesURL,
        results: {
          currentChallengeType: "ChallengeQuestion"
        }
      },
      {
        url: `${billPaymentsBaseUrl}/billpayments`,
        method: "POST",
        status: 230,
        results: {
          deviceTokenCookie: "",
          sessionId: "123",
          transactionId: ""
        }
      },
      {
        url: challengesQuestionsURL,
        results: {
          challengeQuestions: [
            {
              challengeQuestionId: 123,
              challengeQuestion: "favorite car"
            }
          ]
        }
      },
      {
        url: challengesAnswersURL,
        method: "POST",
        results: {
          challengeAnswer: "PASS",
          transactionToken: 123
        }
      }
    ]);

    const {
      queryAllByText,
      findByAltText,
      findByTestId,
      findByPlaceholderText,
      findByText,
      findByLabelText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries();
    const recurringPayment = await findByAltText("pay-bill-recurring-tab.svg");
    expect(recurringPayment).toBeTruthy();

    await act(async () => {
      fireEvent.click(recurringPayment);
    });

    // fill in data
    const accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[2]);
    });
    expect(accounts.children[1].textContent).toBe(
      "CREDIT CARD TEST ACCOUNT (4435) | $89,486.63 CAD"
    );

    const payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-starting");
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

    const frequency = await findByTestId("dropdown-frequency");
    const frequencyOptions = await findAllByRole(frequency, "option");
    await act(async () => {
      fireEvent.click(frequencyOptions[0]);
    });
    expect(frequency.children[0].textContent).toBe("Weekly");

    // move to the review page
    const submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm credit card warning
    const creditCardText = await findByText(
      /This transfer is a cash advance from your credit card/
    );
    expect(creditCardText).toBeDefined();
    const cancelButton = await findByText("OK"); // because it is rendering review page there is 2 cancel buttons
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // on review in create page:
    const payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeDefined();

    await act(async () => {
      fireEvent.click(payBillButton);
    });

    expect(
      await findByText(
        "For security purposes, please answer the following question:"
      )
    ).toBeVisible();

    const securityAnswerInput = await findByLabelText("Security answer");
    await act(async () => {
      fireEvent.change(securityAnswerInput, {
        target: { value: "car" }
      });
    });
    const submit = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submit);
    });
    expect(
      queryAllByText(
        "You've successfully created your bill payment(s) to TELUS MOBILITY."
      )
    ).toBeDefined();
  });

  it("recurring pay with fail RSA", async () => {
    DataStore.flush();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: billPayeesUrl,
        results: payBillDataMock.billPayees
      },
      {
        url: challengesURL,
        results: {
          currentChallengeType: "ChallengeQuestion"
        }
      },
      {
        url: challengesQuestionsURL,
        results: {
          challengeQuestions: [{ id: 123, challengeQuestion: "car" }]
        },
        method: "GET"
      },
      {
        url: challengesAnswersURL,
        method: "POST",
        results: { challengeAnswer: "FAIL" }
      },
      {
        url: `${billPaymentsBaseUrl}/billpayments`,
        method: "POST",
        status: 230,
        results: {
          deviceTokenCookie: "",
          sessionId: "123",
          transactionId: ""
        }
      }
    ]);

    const {
      findByAltText,
      findByTestId,
      findByPlaceholderText,
      findByText,
      findByLabelText,
      queryByDateTitle,
      findByRole
    } = await renderBillPaymentWithExtraQueries();
    const recurringPayment = await findByAltText("pay-bill-recurring-tab.svg");
    expect(recurringPayment).toBeTruthy();
    await act(async () => {
      fireEvent.click(recurringPayment);
    });

    // fill in data
    const accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[2]);
    });
    expect(accounts.children[1].textContent).toBe(
      "CREDIT CARD TEST ACCOUNT (4435) | $89,486.63 CAD"
    );

    const payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-starting");
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

    const frequency = await findByTestId("dropdown-frequency");
    const frequencyOptions = await findAllByRole(frequency, "option");
    await act(async () => {
      fireEvent.click(frequencyOptions[0]);
    });
    expect(frequency.children[0].textContent).toBe("Weekly");

    // move to the review page
    const submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm credit card warning
    const creditCardText = await findByText(
      /This transfer is a cash advance from your credit card/
    );
    expect(creditCardText).toBeDefined();
    const cancelButton = await findByText("OK"); // because it is rendering review page there is 2 cancel buttons
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // on review in create page:
    const payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeDefined();

    await act(async () => {
      fireEvent.click(payBillButton);
    });

    expect(
      await findByText(
        "For security purposes, please answer the following question:"
      )
    ).toBeVisible();

    const securityAnswerInput = await findByLabelText("Security answer");
    await act(async () => {
      fireEvent.change(securityAnswerInput, {
        target: { value: "car" }
      });
    });
    const submit = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submit);
    });
    expect(
      await findByText(
        "For security purposes, please answer the following question:"
      )
    ).toBeVisible();
    // need to exit out of the modal or else it hangs around in the dom for the next test
    const cancel = await findByRole("img", { name: /close/i });
    await act(async () => {
      fireEvent.click(cancel);
    });
  });
});

describe("one time payment with RSA", () => {
  afterEach(() => {
    MockDate.reset();
  });
  beforeEach(() => {
    MockDate.set("2019-01-30T10:20:30Z");
  });
  it("one time pay with success RSA", async () => {
    DataStore.flush();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: billPayeesUrl,
        results: payBillDataMock.billPayees
      },
      {
        url: challengesURL,
        results: {
          currentChallengeType: "ChallengeQuestion"
        }
      },
      {
        url: `${billPaymentsBaseUrl}/billpayments`,
        method: "POST",
        status: 230,
        results: {
          deviceTokenCookie: "",
          sessionId: "123",
          transactionId: ""
        }
      },
      {
        url: challengesQuestionsURL,
        results: {
          challengeQuestions: [{ id: 123, challengeQuestion: "car" }]
        },
        method: "GET"
      },
      {
        url: challengesAnswersURL,
        method: "POST",
        results: { challengeAnswer: "PASS" }
      }
    ]);

    const {
      queryAllByText,
      findByTestId,
      findByPlaceholderText,
      findByText,
      findByLabelText,
      queryByDateTitle
    } = await renderBillPaymentWithExtraQueries();
    // fill in data
    const accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[2]);
    });

    expect(accounts.children[1].textContent).toBe(
      "CREDIT CARD TEST ACCOUNT (4435) | $89,486.63 CAD"
    );

    const payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    // move to the review page
    const date = await findByTestId("date-when");
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

    const submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const creditCardText = await findByText(
      /This transfer is a cash advance from your credit card/
    );
    expect(creditCardText).toBeDefined();
    const cancelButton = await findByText("OK"); // because it is rendering review page there is 2 cancel buttons
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    const payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeDefined();

    await act(async () => {
      fireEvent.click(payBillButton);
    });

    expect(
      await findByText(
        "For security purposes, please answer the following question:"
      )
    ).toBeVisible();

    const securityAnswerInput = await findByLabelText("Security answer");
    await act(async () => {
      fireEvent.change(securityAnswerInput, {
        target: { value: "car" }
      });
    });
    const submit = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submit);
    });
    expect(
      queryAllByText(
        "You've successfully created your bill payment(s) to TELUS MOBILITY."
      )
    ).toBeDefined();
  });
  it("one time pay with fail RSA", async () => {
    DataStore.flush();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: billPayeesUrl,
        results: payBillDataMock.billPayees
      },
      {
        url: challengesURL,
        results: {
          currentChallengeType: "ChallengeQuestion"
        }
      },
      {
        url: `${billPaymentsBaseUrl}/billpayments`,
        method: "POST",
        status: 230,
        results: {
          deviceTokenCookie: "",
          sessionId: "123",
          transactionId: ""
        }
      },
      {
        url: challengesQuestionsURL,
        results: {
          challengeQuestions: [{ id: 123, challengeQuestion: "car" }]
        },
        method: "GET"
      },
      {
        url: challengesAnswersURL,
        method: "POST",
        results: { challengeAnswer: "FAILED" }
      }
    ]);

    const {
      findByTestId,
      findByPlaceholderText,
      findByText,
      findByLabelText,
      queryByText,
      queryByDateTitle,
      findByRole
    } = await renderBillPaymentWithExtraQueries();

    // fill in data
    const accounts = await findByTestId("dropdown-from");
    const accountOptions = await findAllByRole(accounts, "option");

    await act(async () => {
      fireEvent.click(accountOptions[2]);
    });
    expect(accounts.children[1].textContent).toBe(
      "CREDIT CARD TEST ACCOUNT (4435) | $89,486.63 CAD"
    );

    const payees = await findByTestId("dropdown-to");
    const payeeOptions = await findAllByRole(payees, "option");
    await act(async () => {
      fireEvent.click(payeeOptions[1]);
    });
    expect(payees.children[1].textContent).toBe("TELUS MOBILITY (1967)");

    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    const date = await findByTestId("date-when");
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

    // // move to the review page
    const submitButton = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm credit card warning
    const creditCardText = await findByText(
      /This transfer is a cash advance from your credit card/
    );
    expect(creditCardText).toBeDefined();
    const cancelButton = await findByText("OK");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // on review in create page:
    const payBillButton = await findByText("Pay bill");
    expect(payBillButton).toBeDefined();

    await act(async () => {
      fireEvent.click(payBillButton);
    });

    expect(
      await findByText(
        "For security purposes, please answer the following question:"
      )
    ).toBeVisible();

    const securityAnswerInput = await findByLabelText("Security answer");
    await act(async () => {
      fireEvent.change(securityAnswerInput, {
        target: { value: "car" }
      });
    });
    const submit = await findByText("Submit");
    await act(async () => {
      fireEvent.click(submit);
    });

    // need to exit out of the modal or else it hangs around in the dom for the next test
    const cancel = await findByRole("img", { name: /close/i });
    await act(async () => {
      fireEvent.click(cancel);
    });

    expect(
      queryByText(/You've successfully created your bill payment(s)/)
    ).toBeFalsy();
    await act(async () => {
      fireEvent.click(cancel);
    });
  });
});

describe("Testing cross currency change to recurring modal", () => {
  afterEach(() => {
    DataStore.flush();
  });
  beforeEach(() => {
    DataStore.flush();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: billPayeesUrl,
        results: payBillDataMock.billPayees
      }
    ]);
  });
  it(">> should display dialog if accounts are cross currency and click on recurring", async () => {
    DataStore.flush();
    global.window = { location: { pathname: null } };
    const {
      findByTestId,
      findByAltText,
      findByText,
      queryByText
    } = await renderBillPaymentWithExtraQueries();

    const recurringBillPayment = await findByAltText(
      "pay-bill-recurring-tab.svg"
    );

    // Select From a3
    const fromAccount = await findByTestId("dropdown-from");
    const fromAccountOptions = await findAllByRole(fromAccount, "option");
    expect(fromAccountOptions.length).toEqual(3);
    await act(async () => {
      fireEvent.click(fromAccountOptions[1]);
    });
    expect(fromAccount.children[1].textContent).toBe(
      "Springboard Savings Account (1479) | $42,442.26 CAD"
    );

    // select To as USD
    const toAccount = await findByTestId("dropdown-to");
    const toAccountOptions = await findAllByRole(toAccount, "option");
    expect(toAccountOptions.length).toEqual(4);
    await act(async () => {
      fireEvent.click(toAccountOptions[2]);
    });
    expect(toAccount.children[1].textContent).toBe("USD Mastercard (5678)");
    await act(async () => {
      fireEvent.click(recurringBillPayment);
    });

    // modal dialog to stop cross currency recurring go back
    const modalBackButton = await findByText("Back");
    expect(modalBackButton).toBeVisible();
    act(() => {
      fireEvent.click(modalBackButton);
    });
    let recurringFrequency = queryByText("Frequency");
    expect(recurringFrequency).not.toBeInTheDocument();

    // modal dialog to stop cross currency recurring continue
    act(() => {
      fireEvent.click(recurringBillPayment);
    });
    const modalContinueButton = await findByText("Continue");
    expect(modalContinueButton).toBeVisible();
    act(() => {
      fireEvent.click(modalContinueButton);
    });
    recurringFrequency = await findByText("Frequency");
    expect(recurringFrequency).toBeVisible();
  });
});

describe("Testing add non-existing payee modal", () => {
  const newPayee = {
    accountNumber: "12345678-Not-in-state",
    currency: "CAD"
  };
  beforeEach(() => {
    DataStore.flush();
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromAccounts
      },
      {
        url: billPayeesUrl,
        results: payBillDataMock.billPayees
      }
    ]);
    jest.spyOn(ReactRouter, "useLocation").mockReturnValue({
      pathname: "/move-money/bill-payment/one-time",
      hash: "#create",
      to: newPayee
    });
  });

  afterEach(() => {
    DataStore.flush();
  });

  it(">> should display a non-existing payee modal when `to` payee from location is not in state", async () => {
    await renderBillPayment();
    const { findByText } = screen;

    const modalTitle = await findByText("Non-existing Payee");
    const modalText = await findByText(
      "Add this Mastercard to your payees to make a payment."
    );
    expect(modalTitle).toBeVisible();
    expect(modalText).toBeVisible();
  });

  it(">> should close non-existing payee modal and push #addPayee onto history when Add payee button is clicked", async () => {
    const mockedHistoryPush = jest.fn();
    jest.spyOn(ReactRouter, "useHistory").mockReturnValue({
      push: mockedHistoryPush,
      listen: jest.fn().mockReturnValue(jest.fn())
    });

    await renderBillPayment();
    const { findByText, findByRole, queryByText } = screen;

    await findByText("Non-existing Payee");
    const addPayeeButton = await findByRole("button", { name: "Add payee" });
    await act(async () => {
      fireEvent.click(addPayeeButton);
    });

    expect(queryByText("Non-existing Payee")).not.toBeInTheDocument();
    expect(mockedHistoryPush).toBeCalledWith({
      pathname: "/move-money/bill-payment",
      hash: "#addPayee",
      initialPayee: { accountNumber: "12345678-Not-in-state", id: "8836" }
    });
  });

  it(">> should close non-existing payee modal when Cancel button is clicked", async () => {
    await renderBillPayment();
    const { findByText, findByRole, queryByText } = screen;

    await findByText("Non-existing Payee");
    const cancelButton = await findByRole("button", { name: "Cancel" });
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(queryByText("Non-existing Payee")).not.toBeInTheDocument();
  });
});
