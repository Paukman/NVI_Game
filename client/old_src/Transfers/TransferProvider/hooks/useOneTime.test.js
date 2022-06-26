import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import ReactRouter from "react-router";
import { renderHook, act } from "@testing-library/react-hooks";
import { transferErrors } from "utils/MessageCatalog";
import { RenderWithProviders, mockApiData } from "utils/TestUtils";
import * as useMoveMoneyAnalytics from "utils/analytics/useMoveMoneyAnalytics";
import { transfersUrl } from "api";
import useOneTime from "./useOneTime";
import {
  transferDataMock,
  LOADED_DATA,
  FAILED_CALL,
  SUCCESS_CALL,
  NO_CALL,
  loanAccountsTestingData
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

describe("useOneTime hook", () => {
  it(">> should set proper state when fetches from and to transfer accounts on success ", async () => {
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
          ...transferDataMock
        }
      });
    });

    expect(result.current.oneTimeState.fromAllAccounts).toEqual(
      transferDataMock.fromAllAccounts
    );
    expect(result.current.oneTimeState.toAccounts).toEqual(
      transferDataMock.toAccounts
    );
    expect(result.current.oneTimeState.preparedDataForReview).toEqual({});
  });

  it(">> prepareDataForReview and onClean called", async () => {
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
        data: transferDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "from",
        value: transferDataMock.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: transferDataMock.toAccountsFormatted[1].key
      });
    });
    await act(async () => {
      result.current.prepareDataForReview();
    });
    expect(result.current.oneTimeState.preparedDataForReview).toHaveProperty(
      "Amount"
    );
    await act(async () => {
      result.current.onCleanForm();
    });
    expect(result.current.oneTimeState.from).toEqual("");
    expect(result.current.oneTimeState.to).toEqual("");
  });

  it(">> prepareDataForReview and prepareDataForPost called", async () => {
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
        data: transferDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "from",
        value: transferDataMock.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: transferDataMock.toAccountsFormatted[1].key
      });
      result.current.prepareDataForReview();
      result.current.prepareDataForPost();
    });
    expect(result.current.oneTimeState.preparedDataForReview).toHaveProperty(
      "Amount"
    );
    expect(result.current.oneTimeState.preparedDataForPost).toHaveProperty(
      "amount"
    );
  });

  it(">> should clean the form onCancel", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs(
          "/transfer-between-accounts/one-time#review",
          show,
          hide
        )
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: transferDataMock
      });
    });

    const nextState = {
      to: transferDataMock.toAccountsFormatted[1].key,
      from: transferDataMock.fromAccountsFormatted[0].key
    };
    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });

    expect(result.current.oneTimeState.from).toEqual(nextState.from);
    expect(result.current.oneTimeState.to).toEqual(nextState.to);

    expect(result.current.history.location.pathname).toEqual(
      "/transfer-between-accounts/one-time"
    );
    expect(result.current.history.location.hash).toEqual("#review");
    const spy = jest.spyOn(result.current, "hide");

    await act(async () => {
      await result.current.onCancel();
    });

    expect(result.current.oneTimeState.from).toEqual("");
    expect(result.current.oneTimeState.to).toEqual("");
    expect(spy).toBeCalledTimes(1);

    expect(result.current.history.location.pathname).toEqual(
      "/transfer-between-accounts/one-time"
    );
    expect(result.current.history.location.hash).toEqual("#create");

    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });

    await act(async () => {
      await result.current.onSendAnotherTransfer();
    });

    expect(spy).toBeCalledTimes(1);

    expect(result.current.history.location.pathname).toEqual(
      "/transfer-between-accounts/one-time"
    );
    expect(result.current.history.location.hash).toEqual("#create");

    expect(result.current.oneTimeState.from).toEqual("");
    expect(result.current.oneTimeState.to).toEqual("");

    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });

    await act(async () => {
      await result.current.onCleanForm();
    });

    expect(result.current.oneTimeState.from).toEqual("");
    expect(result.current.oneTimeState.to).toEqual("");
  });

  it(">> goBack should render the form with the data", async () => {
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
        data: transferDataMock
      });
    });

    const nextState = {
      to: transferDataMock.toAccountsFormatted[1].key,
      from: transferDataMock.fromAccountsFormatted[0].key
    };
    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });

    expect(result.current.oneTimeState.from).toEqual(nextState.from);
    expect(result.current.oneTimeState.to).toEqual(nextState.to);
    await act(async () => {
      result.current.goBack();
    });
    expect(result.current.oneTimeState.from).toEqual(nextState.from);
    expect(result.current.oneTimeState.to).toEqual(nextState.to);
  });

  it(">> on cancel review", async () => {
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/bill-payment/recurring#review", show)
      });
    });

    const { result } = hook;
    await act(async () => {
      result.current.updateStateOneTime({
        type: LOADED_DATA,
        data: transferDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "from",
        value: transferDataMock.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: transferDataMock.toAccountsFormatted[1].key
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
      failed: jest.fn()
    });
    mockApiData([
      {
        url: `${transfersUrl}/`,
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
        data: transferDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "from",
        value: transferDataMock.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: transferDataMock.toAccountsFormatted[1].key
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
      await result.current.onTransfer(nextTab);
    });

    expect(result.current.oneTimeState.isPosting).toEqual(false);
    expect(result.current.showMessage).toBeCalled();
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
      failed: analyticsFailed
    });
    mockApiData([
      {
        url: `${transfersUrl}/`,
        method: "POST",
        results: [],
        error: "Server Error"
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
        data: transferDataMock
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "from",
        value: transferDataMock.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: transferDataMock.toAccountsFormatted[1].key
      });
      result.current.onChange({
        name: "isPosting",
        value: true // mocking
      });
    });

    const modal = jest.spyOn(result.current, "show");

    await act(async () => {
      await result.current.onTransfer(nextTab);
    });

    expect(result.current.oneTimeState.isPosting).toEqual(false);
    expect(nextTab).not.toBeCalled();
    expect(modal).toBeCalled();
    expect(analyticsFailed).toBeCalledTimes(1);
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
        data: transferDataMock
      });
    });

    await act(async () => {
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
      expect(exchange).toMatchObject({
        fromAmount: "100.00",
        fromCurrency: "CAD",
        toAmount: "150.00",
        type: SUCCESS_CALL
      });
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
        data: transferDataMock
      });
    });

    await act(async () => {
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

      expect(result.current.oneTimeState.isExchangeLoading).toEqual(false);
      expect(modal).toBeCalled();
      expect(modal).toBeCalledWith(
        expect.objectContaining({
          content: transferErrors.MSG_RBTR_054()
        })
      );
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
        data: transferDataMock
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
        data: transferDataMock
      });
    });

    const nextState = {
      from: transferDataMock.fromAccountsFormattedUSD[0].key,
      to: transferDataMock.toAccountsFormattedUSD[3].key,
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
          content: transferErrors.MSG_RBTR_015()
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
        data: transferDataMock
      });
    });

    const nextState = {
      from: transferDataMock.fromAccountsFormattedUSD[0].key,
      to: transferDataMock.toAccountsFormattedUSD[3].key,
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

  it(">> should show modal if paying over balance on loan", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    const nextTab = jest.fn();
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
        data: loanAccountsTestingData
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "from",
        value: loanAccountsTestingData.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: loanAccountsTestingData.toAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "amount",
        value: "15"
      });
      result.current.onChange({
        name: "isPosting",
        value: true // mocking
      });
    });

    await act(async () => {
      result.current.prepareDataForPost();
    });

    const modal = jest.spyOn(result.current, "show");

    await act(async () => {
      await result.current.onTransfer(nextTab);
    });

    expect(nextTab).not.toBeCalled();
    expect(modal).toBeCalled();
    expect(modal).toBeCalledWith(
      expect.objectContaining({
        content: transferErrors.MSG_RBTR_047()
      })
    );
  });

  it(">> should show modal if paying over balance on loan with zero balance", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    const nextTab = jest.fn();
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
        data: loanAccountsTestingData
      });
    });

    await act(async () => {
      result.current.onChange({
        name: "from",
        value: loanAccountsTestingData.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: loanAccountsTestingData.toAccountsFormatted[1].key
      });
      result.current.onChange({
        name: "amount",
        value: "15"
      });
      result.current.onChange({
        name: "isPosting",
        value: true // mocking
      });
    });

    await act(async () => {
      result.current.prepareDataForPost();
    });

    const modal = jest.spyOn(result.current, "show");

    await act(async () => {
      await result.current.onTransfer(nextTab);
    });

    expect(nextTab).not.toBeCalled();
    expect(modal).toBeCalled();
    expect(modal).toBeCalledWith(
      expect.objectContaining({
        content: transferErrors.MSG_RBTR_046()
      })
    );
  });

  it(">> should set `to` and `from` accounts if they exist on location object", async () => {
    const [fromAccount] = transferDataMock.fromAccounts;
    const [toAccount] = transferDataMock.toAccounts;

    jest.spyOn(ReactRouter, "useLocation").mockReturnValue({
      pathname: "/move-money/transfer-between-accounts/one-time",
      hash: "#create",
      from: fromAccount.bankAccount,
      to: toAccount.bankAccount
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
        data: {
          ...transferDataMock
        }
      });
    });

    expect(result.current.oneTimeState.from).toEqual(fromAccount.id);
    expect(result.current.oneTimeState.to).toEqual(toAccount.id);
  });

  it(">> should not set `to` and `from` on location object if not at #create hash", async () => {
    const [fromAccount] = transferDataMock.fromAccounts;
    const [toAccount] = transferDataMock.toAccounts;

    jest.spyOn(ReactRouter, "useLocation").mockReturnValue({
      pathname: "/move-money/transfer-between-accounts/one-time",
      hash: "#review",
      from: fromAccount.bankAccount,
      to: toAccount.bankAccount
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
        data: {
          ...transferDataMock
        }
      });
    });

    expect(result.current.oneTimeState.from).toEqual("");
    expect(result.current.oneTimeState.to).toEqual("");
  });

  it(">> should start move money analytics on when #create hash is visited", async () => {
    jest.spyOn(ReactRouter, "useLocation").mockReturnValue({
      pathname: "/move-money/transfer-between-accounts/one-time",
      hash: "#create"
    });
    const analyticsStarted = jest.fn();
    jest.spyOn(useMoveMoneyAnalytics, "default").mockReturnValue({
      started: analyticsStarted,
      success: jest.fn(),
      failed: jest.fn()
    });

    await act(async () => {
      renderHook(() => useOneTime(), {
        wrapper: WrapperWithArgs("/")
      });
    });

    expect(analyticsStarted).toBeCalledTimes(1);
  });
});
