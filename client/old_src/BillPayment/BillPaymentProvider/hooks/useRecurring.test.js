import React from "react";
import ReactRouter from "react-router";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import * as useMoveMoneyAnalytics from "utils/analytics/useMoveMoneyAnalytics";
import { RenderWithProviders, mockApiData } from "utils/TestUtils";
import { billPaymentErrors } from "utils/MessageCatalog";
import { SNACKBAR_TOP_DEFAULT_VIEW } from "utils/hooks/useGetSnackbarTop";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { billPaymentsBaseUrl } from "api";
import useRecurring from "./useRecurring";
import {
  payBillDataMock,
  LOADED_DATA,
  creditCardWarningDataMock
} from "./constants";
import { endingOptions } from "../../constants";

dayjs.extend(customParseFormat);

const WrapperWithArgs = (
  location,
  show,
  hide,
  modalComponent,
  showMessage = null
) => {
  const Component = props => {
    const { children } = props;
    return (
      <RenderWithProviders
        location={location}
        show={show}
        hide={hide}
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

describe("useRecurring hook", () => {
  it(">> should set proper state when fetches user profile on success ", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useRecurring(), {
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
    expect(result.current.recurringBillState.fromAccounts).toEqual([]);
    expect(result.current.recurringBillState.billPayees).toEqual([]);
    expect(result.current.recurringBillState.preparedDataForReview).toEqual({});
  });
  it(">> should confirm onChange call", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useRecurring(), {
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
      result.current.updateStateRecurring({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    const nextState = {
      to: payBillDataMock.billPayeesFormatted[1].key,
      from: payBillDataMock.fromAccountsFormatted[0].key
    };
    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });
    expect(result.current.recurringBillState.from).toEqual(nextState.from);
    expect(result.current.recurringBillState.to).toEqual(nextState.to);
  });
  it(">> should confirm prepareDataForReview and onClean calls", async () => {
    const analyticsReview = jest.fn();
    jest.spyOn(useMoveMoneyAnalytics, "default").mockReturnValue({
      started: jest.fn(),
      success: jest.fn(),
      failed: jest.fn(),
      review: analyticsReview
    });

    let hook;
    await act(async () => {
      hook = renderHook(() => useRecurring(), {
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
      result.current.updateStateRecurring({
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
        name: "frequency",
        value: "monthly"
      });
    });
    await act(async () => {
      result.current.prepareDataForReview();
    });
    expect(
      result.current.recurringBillState.preparedDataForReview
    ).toHaveProperty("Amount");
    expect(analyticsReview).toBeCalledTimes(1);

    await act(async () => {
      result.current.onCleanForm();
    });
    expect(result.current.recurringBillState.from).toEqual("");
    expect(result.current.recurringBillState.to).toEqual("");
  });
  it(">> should confirm resetting the form", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useRecurring(), {
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
      result.current.updateStateRecurring({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    const nextState = {
      to: payBillDataMock.billPayeesFormatted[1].key,
      from: payBillDataMock.fromAccountsFormatted[0].key
    };
    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });

    expect(result.current.recurringBillState.from).toEqual(nextState.from);
    expect(result.current.recurringBillState.to).toEqual(nextState.to);
    await act(async () => {
      result.current.confirm();
    });
    expect(result.current.recurringBillState.from).toEqual("");
    expect(result.current.recurringBillState.to).toEqual("");
  });
  it(">> should confirm goBack would render the form with the data", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useRecurring(), {
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
      result.current.updateStateRecurring({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    const nextState = {
      to: payBillDataMock.billPayeesFormatted[1].key,
      from: payBillDataMock.fromAccountsFormatted[0].key
    };
    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });

    expect(result.current.recurringBillState.from).toEqual(nextState.from);
    expect(result.current.recurringBillState.to).toEqual(nextState.to);
    await act(async () => {
      result.current.goBack();
    });
    expect(result.current.recurringBillState.from).toEqual(nextState.from);
    expect(result.current.recurringBillState.to).toEqual(nextState.to);
  });
  it(">> should confirm onCancelReview", async () => {
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useRecurring(), {
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
      result.current.updateStateRecurring({
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
  it(">> should confirm updateEndDateNoOfPaymentsMessage call", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useRecurring(), {
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
      result.current.updateStateRecurring({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    expect(result.current.recurringBillState.reviewEnding).toEqual("");
    expect(result.current.recurringBillState.reviewNumberOfPayments).toEqual(
      ""
    );
    expect(
      result.current.recurringBillState.endDateNoOfPaymentsMessage
    ).toEqual("");
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
        name: "starting",
        value: dayjs("Apr 01, 2020", "MMM DD, YYYY")
      });
      result.current.onChange({
        name: "endingOption",
        value: endingOptions.numberOfPayments
      });
      result.current.onChange({ name: "frequency", value: "weekly" });
      result.current.onChange({ name: "numberOfPayments", value: 5 });
      result.current.updateEndDateNoOfPaymentsMessage();
    });

    expect(result.current.recurringBillState.reviewEnding).toEqual(
      "Apr 29, 2020"
    );
    expect(result.current.recurringBillState.reviewNumberOfPayments).toEqual(5);
    expect(
      result.current.recurringBillState.endDateNoOfPaymentsMessage
    ).toEqual("End date: Apr 29, 2020");
  });
  it(">> should confirm prepareDataForPost call", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useRecurring(), {
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
      result.current.updateStateRecurring({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    expect(result.current.recurringBillState.preparedDataForPost).toEqual({});
    await act(async () => {
      result.current.onChange({
        name: "from",
        value: payBillDataMock.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: payBillDataMock.billPayeesFormatted[0].key
      });
      await result.current.prepareDataForPost();
    });

    expect(
      result.current.recurringBillState.preparedDataForPost
    ).toHaveProperty("billPayeeId");
  });
  it(">> should clean the form", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useRecurring(), {
        wrapper: WrapperWithArgs(
          "/bill-payment/recurring#review",
          show,
          hide,
          () => null,
          () => null
        )
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateRecurring({
        type: LOADED_DATA,
        data: payBillDataMock
      });
    });

    const nextState = {
      to: payBillDataMock.billPayeesFormatted[1].key,
      from: payBillDataMock.fromAccountsFormatted[0].key
    };
    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });

    expect(result.current.recurringBillState.from).toEqual(nextState.from);
    expect(result.current.recurringBillState.to).toEqual(nextState.to);

    expect(result.current.history.location.pathname).toEqual(
      "/bill-payment/recurring"
    );
    expect(result.current.history.location.hash).toEqual("#review");
    const spy = jest.spyOn(result.current, "hide");

    await act(async () => {
      await result.current.confirm();
    });

    expect(result.current.recurringBillState.from).toEqual("");
    expect(result.current.recurringBillState.to).toEqual("");
    expect(spy).toBeCalled();

    expect(result.current.history.location.pathname).toEqual(
      "/bill-payment/recurring"
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
      "/bill-payment/recurring"
    );
    expect(result.current.history.location.hash).toEqual("#create");

    expect(result.current.recurringBillState.from).toEqual("");
    expect(result.current.recurringBillState.to).toEqual("");

    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });

    await act(async () => {
      await result.current.onCleanForm();
    });

    expect(result.current.recurringBillState.from).toEqual("");
    expect(result.current.recurringBillState.to).toEqual("");
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
      hook = renderHook(() => useRecurring(), {
        wrapper: WrapperWithArgs("/", show, hide, () => null, showMessage)
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateRecurring({
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
        name: "isPosting",
        value: true // mocking
      });
    });

    await act(async () => {
      await result.current.onPayBill(nextTab);
    });

    expect(result.current.recurringBillState.isPosting).toEqual(false);
    expect(result.current.recurringBillState.successMessage).toEqual(
      "You've successfully created your bill payment(s) to TELUS MOBILITY."
    );

    expect(nextTab).toBeCalled();
    expect(analyticsSuccess).toBeCalledTimes(1);
    expect(result.current.showMessage).toBeCalledWith({
      type: "success",
      top: SNACKBAR_TOP_DEFAULT_VIEW,
      content:
        "You've successfully created your bill payment(s) to TELUS MOBILITY."
    });
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
      hook = renderHook(() => useRecurring(), {
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
      result.current.updateStateRecurring({
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

    expect(result.current.recurringBillState.isPosting).toEqual(false);
    expect(nextTab).not.toBeCalled();
    expect(modal).toBeCalled();
    expect(analyticsFailed).toBeCalledTimes(1);
  });
  it(">> should call showModal for credit account warning", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useRecurring(), {
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
      result.current.updateStateRecurring({
        type: LOADED_DATA,
        data: creditCardWarningDataMock
      });
    });
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

    let ret = await result.current.creditAccountWarning();
    expect(ret).toBeTruthy();
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

    ret = await result.current.creditAccountWarning();
    expect(ret).toEqual(0);
  });
  it(">> should hide modal on goBack", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useRecurring(), {
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
      result.current.updateStateRecurring({
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
      hook = renderHook(() => useRecurring(), {
        wrapper: WrapperWithArgs(
          "/bill-payment/recurring#review",
          show,
          hide,
          () => null,
          () => null
        )
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.updateStateRecurring({
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
      "/bill-payment/recurring"
    );
    expect(result.current.history.location.hash).toEqual("#create");
  });

  it(">> should hide modal on onCancelCreditCardWarning, and change hash", async () => {
    jest.spyOn(ReactRouter, "useLocation").mockReturnValue({
      pathname: "/move-money/bill-payment/recurring",
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
      renderHook(() => useRecurring(), {
        wrapper: WrapperWithArgs(
          "/bill-payment/recurring#review",
          () => null,
          () => null,
          () => null,
          () => null
        )
      });
    });

    expect(analyticsStarted).toBeCalledTimes(1);
  });
});
