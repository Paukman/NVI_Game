/* eslint-disable react/no-unescaped-entities */
import React from "react";
import ReactRouter from "react-router";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import { RenderWithProviders, mockApiData } from "utils/TestUtils";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { transfersUrl } from "api";
import * as useMoveMoneyAnalytics from "utils/analytics/useMoveMoneyAnalytics";
import useRecurring from "./useRecurring";
import { transferDataMock, LOADED_DATA } from "./constants";
import { endingOptions } from "../../constants";

dayjs.extend(customParseFormat);

const WrapperWithArgs = (
  location,
  show,
  hide,
  openSnackbar,
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
    expect(result.current.recurringState.fromAccounts).toEqual([]);
    expect(result.current.recurringState.toAccounts).toEqual([]);
    expect(result.current.recurringState.preparedDataForReview).toEqual({});
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
    expect(result.current.recurringState.from).toEqual(nextState.from);
    expect(result.current.recurringState.to).toEqual(nextState.to);
  });
  it(">> should confirm prepareDataForReview and onClean calls", async () => {
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
    });
    expect(result.current.recurringState.preparedDataForReview).toHaveProperty(
      "Amount"
    );
    await act(async () => {
      result.current.onCleanForm();
    });
    expect(result.current.recurringState.from).toEqual("");
    expect(result.current.recurringState.to).toEqual("");
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

    expect(result.current.recurringState.from).toEqual(nextState.from);
    expect(result.current.recurringState.to).toEqual(nextState.to);
    await act(async () => {
      result.current.confirm();
    });
    expect(result.current.recurringState.from).toEqual("");
    expect(result.current.recurringState.to).toEqual("");
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

    expect(result.current.recurringState.from).toEqual(nextState.from);
    expect(result.current.recurringState.to).toEqual(nextState.to);
    await act(async () => {
      result.current.goBack();
    });
    expect(result.current.recurringState.from).toEqual(nextState.from);
    expect(result.current.recurringState.to).toEqual(nextState.to);
  });
  it(">> should confirm onCancelReview", async () => {
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useRecurring(), {
        wrapper: WrapperWithArgs(
          "/transfer-between-accounts/recurring#review",
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
        value: transferDataMock.toAccountsFormatted[0].key
      });
    });
    const showCancelReviewModal = jest.spyOn(result.current, "show");
    await act(async () => {
      result.current.onCancelReview();
    });
    expect(showCancelReviewModal).toBeCalled();
  });
  it(">> should confirm updateEndDateNoOfTransfersMessage call", async () => {
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
        data: transferDataMock
      });
    });

    expect(result.current.recurringState.reviewEnding).toEqual("");
    expect(result.current.recurringState.reviewNumberOfTransfers).toEqual("");
    expect(result.current.recurringState.endDateNoOfTransfersMessage).toEqual(
      ""
    );
    await act(async () => {
      result.current.onChange({
        name: "from",
        value: transferDataMock.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: transferDataMock.toAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "starting",
        value: dayjs("Apr 01, 2020", "MMM DD, YYYY")
      });
      result.current.onChange({
        name: "endingOption",
        value: endingOptions.numberOfTransfers
      });
      result.current.onChange({ name: "frequency", value: "weekly" });
      result.current.onChange({ name: "numberOfTransfers", value: 5 });
      result.current.updateEndDateNoOfTransfersMessage();
    });

    expect(result.current.recurringState.reviewEnding).toEqual("Apr 29, 2020");
    expect(result.current.recurringState.reviewNumberOfTransfers).toEqual(5);
    expect(result.current.recurringState.endDateNoOfTransfersMessage).toEqual(
      "End date: Apr 29, 2020"
    );
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
        data: transferDataMock
      });
    });

    expect(result.current.recurringState.preparedDataForPost).toEqual({});
    await act(async () => {
      result.current.onChange({
        name: "from",
        value: transferDataMock.fromAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "to",
        value: transferDataMock.toAccountsFormatted[0].key
      });
      await result.current.prepareDataForPost();
    });

    expect(result.current.recurringState.preparedDataForPost).toHaveProperty(
      "toAccountId"
    );
  });
  it(">> should clean the form", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useRecurring(), {
        wrapper: WrapperWithArgs(
          "/transfer-between-accounts/recurring#review",
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

    expect(result.current.recurringState.from).toEqual(nextState.from);
    expect(result.current.recurringState.to).toEqual(nextState.to);

    expect(result.current.history.location.pathname).toEqual(
      "/transfer-between-accounts/recurring"
    );
    expect(result.current.history.location.hash).toEqual("#review");
    const spy = jest.spyOn(result.current, "hide");

    await act(async () => {
      await result.current.confirm();
    });

    expect(result.current.recurringState.from).toEqual("");
    expect(result.current.recurringState.to).toEqual("");
    expect(spy).toBeCalled();

    expect(result.current.history.location.pathname).toEqual(
      "/transfer-between-accounts/recurring"
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
      "/transfer-between-accounts/recurring"
    );
    expect(result.current.history.location.hash).toEqual("#create");

    expect(result.current.recurringState.from).toEqual("");
    expect(result.current.recurringState.to).toEqual("");

    await act(async () => {
      result.current.onChange({ name: "from", value: nextState.from });
      result.current.onChange({ name: "to", value: nextState.to });
    });

    await act(async () => {
      await result.current.onCleanForm();
    });

    expect(result.current.recurringState.from).toEqual("");
    expect(result.current.recurringState.to).toEqual("");
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
      hook = renderHook(() => useRecurring(), {
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
      result.current.updateStateRecurring({
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
        name: "starting",
        value: dayjs("Apr 01, 2020", "MMM DD, YYYY")
      });
      result.current.onChange({
        name: "endingOption",
        value: endingOptions.numberOfTransfers
      });
      result.current.onChange({ name: "frequency", value: "weekly" });
      result.current.onChange({ name: "numberOfTransfers", value: 5 });
      result.current.onChange({
        name: "isPosting",
        value: true // mocking
      });
    });

    await act(async () => {
      await result.current.onTransfer(nextTab);
    });

    expect(result.current.recurringState.isPosting).toEqual(false);
    expect(result.current.showMessage).toBeCalledWith(
      expect.objectContaining({
        content: "You've successfully created your transfers."
      })
    );
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
        value: transferDataMock.toAccountsFormatted[0].key
      });
      result.current.onChange({
        name: "starting",
        value: dayjs("Apr 01, 2020", "MMM DD, YYYY")
      });
      result.current.onChange({
        name: "endingOption",
        value: endingOptions.numberOfTransfers
      });
      result.current.onChange({ name: "frequency", value: "weekly" });
      result.current.onChange({ name: "numberOfTransfers", value: 5 });
      result.current.onChange({
        name: "isPosting",
        value: true // mocking
      });
    });

    const modal = jest.spyOn(result.current, "show");

    await act(async () => {
      await result.current.onTransfer(nextTab);
    });

    expect(result.current.recurringState.isPosting).toEqual(false);
    expect(nextTab).not.toBeCalled();
    expect(modal).toBeCalled();
    expect(analyticsFailed).toBeCalledTimes(1);
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
        data: transferDataMock
      });
    });
    await act(async () => {
      result.current.onChange({
        name: "from",
        value: transferDataMock.fromAccountsFormatted[2].key
      });
      result.current.onChange({
        name: "to",
        value: transferDataMock.toAccountsFormatted[0].key
      });
    });
    const spy = jest.spyOn(result.current, "hide");
    await act(async () => {
      result.current.goBack();
    });
    expect(spy).toBeCalled();
  });

  it(">> should start move money analytics on when #create hash is visited", async () => {
    jest.spyOn(ReactRouter, "useLocation").mockReturnValue({
      pathname: "/move-money/transfer-between-accounts/recurring",
      hash: "#create"
    });
    const analyticsStarted = jest.fn();
    jest.spyOn(useMoveMoneyAnalytics, "default").mockReturnValue({
      started: analyticsStarted,
      success: jest.fn(),
      failed: jest.fn()
    });

    await act(async () => {
      renderHook(() => useRecurring(), {
        wrapper: WrapperWithArgs(
          "/",
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
