import React from "react";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import ReactRouter from "react-router";
import dayjs from "dayjs";
import { billPaymentsBaseUrl, transfersUrl } from "api";
import { RenderWithProviders, mockApiData } from "utils/TestUtils";
import { billPaymentErrors } from "utils/MessageCatalog";
import * as useMoveMoneyAnalytics from "utils/analytics/useMoveMoneyAnalytics";
import { SNACKBAR_TOP_DEFAULT_VIEW } from "utils/hooks/useGetSnackbarTop";
import useOneTime from "./useOneTime";
import {
  payBillDataMock,
  testCreditAccount,
  LOADED_DATA,
  creditCardWarningDataMock,
  FAILED_CALL,
  SUCCESS_CALL,
  NO_CALL
} from "./constants";

const WrapperWithArgs = (
  location,
  show = () => null,
  hide = () => null,
  openSnackbar = () => null,
  modalComponent = () => null,
  showMessage = null
) => {
  const Component = props => {
    const { children } = props;
    return (
      <RenderWithProviders
        location={location}
        show={show}
        hide={hide}
        openSnackbar={openSnackbar}
        modalComponent={modalComponent}
        showMessage={showMessage}
      >
        {children}
      </RenderWithProviders>
    );
  };
  Component.propTypes = {
    children: PropTypes.element.isRequired
  };
  return Component;
};

describe("BillPayment useOneTime hook", () => {
  it(">> should set proper state when fetches user profile on success ", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/")
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: {
          ...payBillDataMock,
          fromBillAccounts: [
            ...payBillDataMock.fromBillAccounts,
            testCreditAccount
          ]
        }
      });
    });

    expect(result.current.oneTimeBillState.fromAccounts).toEqual([
      ...payBillDataMock.fromBillAccounts,
      testCreditAccount
    ]);
    expect(result.current.oneTimeBillState.billPayees).toEqual(
      payBillDataMock.billPayees
    );
    expect(result.current.oneTimeBillState.preparedDataForReview).toEqual({});
  });

  it(">> onChange called", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/")
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    const nextState = {
      to: "toValue",
      from: "fromValue"
    };
    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });
    expect(result.current.oneTimeBillState.from).toEqual(nextState.from);
    expect(result.current.oneTimeBillState.to).toEqual(nextState.to);
  });

  it(">> prepareDataForReview and onClean called", async () => {
    const analyticsReview = jest.fn();
    jest.spyOn(useMoveMoneyAnalytics, "default").mockReturnValue({
      started: jest.fn(),
      success: jest.fn(),
      failed: jest.fn(),
      review: analyticsReview
    });

    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs(
          "/",
          () => null,
          () => null,
          () => null,
          () => null
        )
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "from",
        value: payBillDataMock.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: payBillDataMock.billPayeesFormatted[0].key
      });
    });
    await act(async () => {
      result.current.prepareDataForReview();
    });

    expect(
      result.current.oneTimeBillState.preparedDataForReview
    ).toHaveProperty("Amount");
    expect(analyticsReview).toBeCalledTimes(1);
    await act(async () => {
      result.current.onCleanForm();
    });
    expect(result.current.oneTimeBillState.from).toEqual("");
    expect(result.current.oneTimeBillState.to).toEqual("");
  });

  it(">> should call showModal for credit account warning", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs(
          "/",
          show,
          hide,
          () => null,
          () => null
        )
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: creditCardWarningDataMock
      });
    });
    let returnFound = false;
    const numberOfAccounts =
      creditCardWarningDataMock.fromAccountsFormatted.length;
    await act(async () => {
      result.current.onChange({
        name: "from",
        value:
          creditCardWarningDataMock.fromAccountsFormatted[numberOfAccounts - 1]
            .key
      });
      result.current.onChange({
        name: "to",
        value: payBillDataMock.billPayeesFormatted[0].key
      });
    });

    const creditCardWarningModal = jest.spyOn(result.current, "show");

    returnFound = await result.current.creditAccountWarning();
    expect(returnFound).toBeTruthy();
    expect(returnFound).toBeTruthy();
    expect(creditCardWarningModal).toBeCalledWith({
      content: billPaymentErrors.CREDIT_CARD_WARNING(),
      actions: (
        <React.Fragment>
          <button
            type="button"
            className="ui button basic"
            onClick={result.current.onCancelCreditCardWarning}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ui button basic"
            onClick={result.current.goBack}
          >
            OK
          </button>
        </React.Fragment>
      )
    });
    // load plain account
    await act(async () => {
      result.current.onChange({
        name: "from",
        value: creditCardWarningDataMock.fromAccountsFormatted[1].key
      });
      result.current.onChange({
        name: "to",
        value: payBillDataMock.billPayeesFormatted[0].key
      });
    });

    returnFound = await result.current.creditAccountWarning();
    expect(returnFound).toEqual(0);
  });

  it(">> prepareDataForReview and prepareDataForPost called", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs(
          "/",
          () => null,
          () => null,
          () => null,
          () => null
        )
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "from",
        value: payBillDataMock.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: payBillDataMock.billPayeesFormatted[0].key
      });
    });
    await act(async () => {
      result.current.prepareDataForReview();
      result.current.prepareDataForPost();
    });
    expect(
      result.current.oneTimeBillState.preparedDataForReview
    ).toHaveProperty("Amount");
    expect(result.current.oneTimeBillState.preparedDataForPost).toHaveProperty(
      "amount"
    );
  });

  it(">> should clean the form", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs(
          "/bill-payment/one-time#review",
          show,
          hide,
          () => null,
          () => null
        )
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    const nextState = {
      to: "toValue",
      from: "fromValue"
    };
    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });

    expect(result.current.oneTimeBillState.from).toEqual(nextState.from);
    expect(result.current.oneTimeBillState.to).toEqual(nextState.to);

    expect(result.current.history.location.pathname).toEqual(
      "/bill-payment/one-time"
    );
    expect(result.current.history.location.hash).toEqual("#review");
    const spy = jest.spyOn(result.current, "hide");

    await act(async () => {
      await result.current.onCancel();
    });

    expect(result.current.oneTimeBillState.from).toEqual("");
    expect(result.current.oneTimeBillState.to).toEqual("");
    expect(spy).toBeCalledTimes(1);

    expect(result.current.history.location.pathname).toEqual(
      "/bill-payment/one-time"
    );
    expect(result.current.history.location.hash).toEqual("#create");

    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });

    await act(async () => {
      await result.current.onPayAnotherBill();
    });

    expect(spy).toBeCalledTimes(1);

    expect(result.current.history.location.pathname).toEqual(
      "/bill-payment/one-time"
    );
    expect(result.current.history.location.hash).toEqual("#create");

    expect(result.current.oneTimeBillState.from).toEqual("");
    expect(result.current.oneTimeBillState.to).toEqual("");

    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });

    await act(async () => {
      await result.current.onCleanForm();
    });

    expect(result.current.oneTimeBillState.from).toEqual("");
    expect(result.current.oneTimeBillState.to).toEqual("");
  });

  it(">> goBack should render the form with the data", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs(
          "/",
          () => null,
          () => null,
          () => null,
          () => null
        )
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    const nextState = {
      to: "toValue",
      from: "fromValue"
    };
    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });

    expect(result.current.oneTimeBillState.from).toEqual(nextState.from);
    expect(result.current.oneTimeBillState.to).toEqual(nextState.to);
    await act(async () => {
      result.current.goBack();
    });
    expect(result.current.oneTimeBillState.from).toEqual(nextState.from);
    expect(result.current.oneTimeBillState.to).toEqual(nextState.to);
  });

  it(">> on cancel review", async () => {
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs(
          "/bill-payment/recurring#review",
          show,
          () => null,
          () => null,
          () => null
        )
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "from",
        value: payBillDataMock.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: payBillDataMock.billPayeesFormatted[0].key
      });
    });
    const showCancelReviewModal = jest.spyOn(result.current, "show");
    await act(async () => {
      result.current.onCancelReview();
    });
    expect(showCancelReviewModal).toBeCalled();
  });
  it(">> should process paying with success", async () => {
    const nextTab = jest.fn();
    const hide = jest.fn();
    const show = jest.fn();
    const showMessage = jest.fn();
    const analyticsSuccess = jest.fn();
    jest.spyOn(useMoveMoneyAnalytics, "default").mockReturnValue({
      started: jest.fn(),
      success: analyticsSuccess,
      failed: jest.fn(),
      review: jest.fn()
    });
    mockApiData([
      {
        url: `${billPaymentsBaseUrl}/billpayments`,
        results: [],
        status: 200,
        method: "post"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs(
          "/",
          show,
          hide,
          () => null,
          () => null,
          showMessage
        )
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "from",
        value: payBillDataMock.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: payBillDataMock.billPayeesFormatted[1].key
      });
      result.current.onChange({
        name: "amount",
        value: "1"
      });
      result.current.onChange({
        name: "isPosting",
        value: true // mocking
      });
    });

    await act(async () => {
      await result.current.onPayBill(nextTab);
    });

    expect(result.current.oneTimeBillState.isPosting).toEqual(false);
    expect(result.current.oneTimeBillState.successMessage).toEqual(
      "You've successfully created your bill payment to TELUS MOBILITY."
    );
    expect(result.current.showMessage).toBeCalledWith({
      type: "success",
      top: SNACKBAR_TOP_DEFAULT_VIEW,
      content:
        "You've successfully created your bill payment to TELUS MOBILITY."
    });
    expect(nextTab).toBeCalled();
    expect(analyticsSuccess).toBeCalledTimes(1);
  });
  it(">> should process paying with failure", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    const nextTab = jest.fn();
    const analyticsFailed = jest.fn();
    jest.spyOn(useMoveMoneyAnalytics, "default").mockReturnValue({
      started: jest.fn(),
      success: jest.fn(),
      failed: analyticsFailed,
      review: jest.fn()
    });
    mockApiData([
      {
        url: `${billPaymentsBaseUrl}/billpayments`,
        method: "POST",
        results: [],
        error: "Server Error"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs(
          "/",
          show,
          hide,
          () => null,
          () => null
        )
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "from",
        value: payBillDataMock.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: payBillDataMock.billPayeesFormatted[0].key
      });
      result.current.onChange({
        name: "isPosting",
        value: true // mocking
      });
    });

    const modal = jest.spyOn(result.current, "show");

    await act(async () => {
      await result.current.onPayBill(nextTab);
    });

    expect(result.current.oneTimeBillState.isPosting).toEqual(false);
    expect(nextTab).not.toBeCalled();
    expect(modal).toBeCalled();
    expect(analyticsFailed).toBeCalledTimes(1);
  });
  it(">> should hide modal on goBack", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs(
          "/",
          show,
          hide,
          () => null,
          () => null
        )
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: creditCardWarningDataMock
      });
    });
    await act(async () => {
      result.current.onChange({
        name: "from",
        value: creditCardWarningDataMock.fromAccountsFormatted[2].key
      });
      result.current.onChange({
        name: "to",
        value: payBillDataMock.billPayeesFormatted[0].key
      });
    });
    const spy = jest.spyOn(result.current, "hide");
    await act(async () => {
      result.current.goBack();
    });
    expect(spy).toBeCalled();
  });
  it(">> should hide modal on onCancelCreditCardWarning, and change hash", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs(
          "/bill-payment/one-time#review",
          show,
          hide,
          () => null,
          () => null
        )
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: creditCardWarningDataMock
      });
    });
    await act(async () => {
      result.current.onChange({
        name: "from",
        value: creditCardWarningDataMock.fromAccountsFormatted[2].key
      });
      result.current.onChange({
        name: "to",
        value: payBillDataMock.billPayeesFormatted[0].key
      });
    });
    const spy = jest.spyOn(result.current, "hide");
    await act(async () => {
      result.current.onCancelCreditCardWarning();
    });
    expect(spy).toBeCalled();

    expect(result.current.history.location.pathname).toEqual(
      "/bill-payment/one-time"
    );
    expect(result.current.history.location.hash).toEqual("#create");
  });

  it(">> should succeed on API in updateExchangeRate", async () => {
    mockApiData([
      {
        url: `${transfersUrl}/exchangerate`,
        results: { exchangeRate: 1.5, toAmount: 150.0, fromAmount: 100.0 },
        status: 200,
        method: "post"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/")
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "enableFeatureToggle",
        value: true // mocking
      });
      result.current.onChange({
        name: "isExchangeLoading",
        value: true // mocking
      });
    });

    let exchange;
    await act(async () => {
      exchange = await result.current.updateExchangeRate({
        fieldToUpdate: "amount",
        exchangeAmount: 100,
        fromCurrency: "CAD",
        toCurrency: "USD"
      });
      expect(exchange.type).toEqual(SUCCESS_CALL);
    });
  });
  it(">> should fail on API in updateExchangeRate", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    mockApiData([
      {
        url: `${transfersUrl}/exchangerate`,
        results: [],
        error: "Server Error",
        method: "post"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/", show, hide)
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "enableFeatureToggle",
        value: true // mocking
      });
      result.current.onChange({
        name: "isExchangeLoading",
        value: true // mocking
      });
    });

    const modal = jest.spyOn(result.current, "show");

    let exchange;
    await act(async () => {
      exchange = await result.current.updateExchangeRate({
        fieldToUpdate: "amount",
        exchangeAmount: 100,
        fromCurrency: "CAD",
        toCurrency: "USD"
      });
      expect(exchange).toEqual(FAILED_CALL);

      expect(result.current.oneTimeBillState.isExchangeLoading).toEqual(false);
      expect(modal).toBeCalled();
      expect(modal).toBeCalledWith(
        expect.objectContaining({
          content: billPaymentErrors.MSG_RBTR_054()
        })
      );
    });
  });
  it(">> should fail on API in updateExchangeRate exceeding amount of 50K", async () => {
    mockApiData([
      {
        url: `${transfersUrl}/exchangerate`,
        results: [],
        error: {
          response: {
            data: {
              message: "Amount exceedes maximum allowed amount of $50,000.00."
            }
          }
        },
        method: "post"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/")
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "enableFeatureToggle",
        value: true // mocking
      });
      result.current.onChange({
        name: "isExchangeLoading",
        value: true // mocking
      });
    });

    let exchange;
    const filedToUpdate = "amount";
    await act(async () => {
      exchange = await result.current.updateExchangeRate({
        fieldToUpdate: filedToUpdate,
        exchangeAmount: 100,
        fromCurrency: "CAD",
        toCurrency: "USD"
      });
      expect(exchange).toEqual({
        error: "EXCEEDING_AMOUNT",
        limit: 50000,
        type: "FAILED_CALL"
      });
    });
  });
  it(">> should return above $50k error when the API returns fromAmount over $50k", async () => {
    mockApiData([
      {
        url: `${transfersUrl}/exchangerate`,
        results: {
          exchangeRate: 0.7669299792928905,
          toAmount: 38380,
          fromAmount: 50004.565
        },
        status: 200,
        method: "post"
      }
    ]);

    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/")
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "enableFeatureToggle",
        value: true // mocking
      });
      result.current.onChange({
        name: "isExchangeLoading",
        value: true // mocking
      });
    });

    let exchange;
    const fieldToUpdate = "amount";
    await act(async () => {
      exchange = await result.current.updateExchangeRate({
        fieldToUpdate,
        exchangeAmount: 38350,
        fromCurrency: "CAD",
        toCurrency: "USD"
      });
    });
    expect(exchange).toEqual({
      error: "EXCEEDING_AMOUNT",
      limit: 50000,
      type: "FAILED_CALL"
    });
  });
  it(">> should fail on API in updateExchangeRate exceeding amount of 99999.99", async () => {
    mockApiData([
      {
        url: `${transfersUrl}/exchangerate`,
        results: [],
        error: {
          response: {
            data: {
              message: "Amount exceedes maximum allowed amount of $100,000.00."
            }
          }
        },
        method: "post"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/")
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "enableFeatureToggle",
        value: true // mocking
      });
      result.current.onChange({
        name: "isExchangeLoading",
        value: true // mocking
      });
    });

    let exchange;
    const filedToUpdate = "amount";
    await act(async () => {
      exchange = await result.current.updateExchangeRate({
        fieldToUpdate: filedToUpdate,
        exchangeAmount: 100,
        fromCurrency: "CAD",
        toCurrency: "USD"
      });
      expect(exchange).toEqual({
        error: "EXCEEDING_AMOUNT",
        limit: 99999.99,
        type: "FAILED_CALL"
      });
    });
  });
  it(">> should make no call on API in updateExchangeRate", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/")
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "enableFeatureToggle",
        value: true // mocking
      });
    });

    let exchange;
    await act(async () => {
      exchange = await result.current.updateExchangeRate({
        fieldToUpdate: "amount",
        exchangeAmount: "0.00",
        fromCurrency: "CAD",
        toCurrency: "USD"
      });
      expect(exchange).toEqual(NO_CALL);
    });
  });

  it(">> should display modal when from/to selected and date changed to future date", async () => {
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/", show)
      });
    });
    const { result } = hook;

    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "enableFeatureToggle",
        value: true // mocking
      });
    });

    const nextState = {
      from: payBillDataMock.fromAccountsFormatted[2].key,
      to: payBillDataMock.billPayeesFormatted[3].key,
      when: dayjs().add(10, "day")
    };

    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });

    const futureDateModal = jest.spyOn(result.current, "show");
    await act(async () => {
      result.current.onChange({ name: "when", value: nextState.when });
      expect(futureDateModal).toBeCalled();
      expect(futureDateModal).toBeCalledWith(
        expect.objectContaining({
          content: billPaymentErrors.MSG_RBBP_015()
        })
      );
    });
  });
  it(">> should display modal when date future date and from/to changed cross currency", async () => {
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/", show)
      });
    });
    const { result } = hook;

    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "enableFeatureToggle",
        value: true // mocking
      });
    });

    const nextState = {
      from: payBillDataMock.fromAccountsFormatted[2].key,
      to: payBillDataMock.billPayeesFormatted[3].key,
      when: dayjs().add(10, "day")
    };

    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "when", value: nextState.when });
    });

    const futureDateModal = jest.spyOn(result.current, "show");
    await act(async () => {
      result.current.onChange({ name: "to", value: nextState.to });
      expect(futureDateModal).toBeCalled();
    });
  });
  it(">> should call clearExchangeRateFields", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/")
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.onChange({
        name: "exchangeRateFormatted",
        value: "exchangeRateFormatted"
      });
      result.current.onChange({ name: "amount", value: "amount" });
      result.current.onChange({ name: "amountTo", value: "amountTo" });
    });

    await act(async () => {
      await result.current.clearExchangeRateFields("amount");
    });

    expect(result.current.oneTimeBillState.exchangeRateFormatted).toEqual("");
    expect(result.current.oneTimeBillState.amount).toEqual("");
    expect(result.current.oneTimeBillState.amountTo).toEqual("amountTo");

    await act(async () => {
      result.current.onChange({
        name: "exchangeRateFormatted",
        value: "exchangeRateFormatted"
      });
      result.current.onChange({ name: "amount", value: "amount" });
      result.current.onChange({ name: "amountTo", value: "amountTo" });
    });

    await act(async () => {
      await result.current.clearExchangeRateFields("amountTo");
    });

    expect(result.current.oneTimeBillState.exchangeRateFormatted).toEqual("");
    expect(result.current.oneTimeBillState.amountTo).toEqual("");
    expect(result.current.oneTimeBillState.amount).toEqual("amount");
  });

  it(">> should set `to` payee and `from` account if they exist on location object", async () => {
    const [fromAccount] = payBillDataMock.fromBillAccounts;
    const creditCardPayee = payBillDataMock.billPayees.find(
      ({ ATBMastercardIndicator }) => ATBMastercardIndicator
    );

    jest.spyOn(ReactRouter, "useLocation").mockReturnValue({
      pathname: "/move-money/bill-payment/one-time",
      hash: "#create",
      from: fromAccount.bankAccount,
      to: { accountNumber: creditCardPayee.payeeCustomerReference }
    });

    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/")
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    expect(result.current.oneTimeBillState.from).toEqual(fromAccount.id);
    expect(result.current.oneTimeBillState.to).toEqual(
      creditCardPayee.billPayeeId
    );
  });

  it(">> should not set `to` payee and `from` account if not at #create hash", async () => {
    const [fromAccount] = payBillDataMock.fromBillAccounts;
    const creditCardPayee = payBillDataMock.billPayees.find(
      ({ ATBMastercardIndicator }) => ATBMastercardIndicator
    );

    jest.spyOn(ReactRouter, "useLocation").mockReturnValue({
      pathname: "/move-money/bill-payment/one-time",
      hash: "#review",
      from: fromAccount.bankAccount,
      to: { accountNumber: creditCardPayee.payeeCustomerReference }
    });

    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/")
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    expect(result.current.oneTimeBillState.from).toEqual("");
    expect(result.current.oneTimeBillState.to).toEqual("");
  });
  it(">> should start move money analytics on when #create hash is visited", async () => {
    jest.spyOn(ReactRouter, "useLocation").mockReturnValue({
      pathname: "/move-money/bill-payment/one-time",
      hash: "#create"
    });
    const analyticsStarted = jest.fn();
    jest.spyOn(useMoveMoneyAnalytics, "default").mockReturnValue({
      started: analyticsStarted,
      success: jest.fn(),
      failed: jest.fn(),
      review: jest.fn()
    });

    await act(async () => {
      renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/")
      });
    });

    expect(analyticsStarted).toBeCalledTimes(1);
  });

  it(">> should track duplicate payments", async () => {
    jest.spyOn(ReactRouter, "useLocation").mockReturnValue({
      pathname: "/move-money/bill-payment/one-time",
      hash: "#create"
    });
    const duplicatePayment = jest.fn();
    jest.spyOn(useMoveMoneyAnalytics, "default").mockReturnValue({
      duplicatePayment,
      started: jest.fn(),
      failed: jest.fn()
    });

    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/")
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.onCancelDuplicatePayment();
    });

    expect(duplicatePayment).toBeCalledWith(
      expect.objectContaining({ action: "Cancel" })
    );

    await act(async () => {
      await result.current.onContinueDuplicatePayment(null);
    });

    expect(duplicatePayment).toBeCalledWith(
      expect.objectContaining({ action: "Continue" })
    );
  });
});
