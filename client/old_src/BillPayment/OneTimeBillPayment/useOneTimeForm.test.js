import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import PropTypes from "prop-types";
import { RenderWithProviders } from "utils/TestUtils";
import DataStore from "utils/store";
import useOneTimeForm from "./useOneTimeForm";
import {
  SUCCESS_CALL,
  FAILED_CALL,
  NO_CALL,
  EXCEEDING_AMOUNT
} from "../BillPaymentProvider/hooks/constants";

const mockState = {
  state: {
    from: "",
    to: "",
    when: "",
    amount: ""
  }
};

const mockStateCADtoUSD = {
  from: "",
  fromAccounts: [
    {
      id: "idFrom",
      currency: "CAD",
      availableBalance: { currency: "CAD", value: 387005.66 }
    }
  ],
  billPayees: [
    {
      billPayeeId: "idTo",
      ATBMastercardCurrency: "USD"
    }
  ],
  to: "idTo",
  amount: "$99.00",
  amountTo: "",
  fromCurrency: "",
  toCurrency: "USD",
  isDisplayedToAmount: false
};

const ProvidersWrapper = () => {
  const Component = props => {
    const { children } = props;
    return <RenderWithProviders location="/">{children}</RenderWithProviders>;
  };
  Component.propTypes = {
    children: PropTypes.element.isRequired
  };
  return Component;
};

describe("useOneTimeForm hook", () => {
  it(">> onChange is called in the provider", async () => {
    DataStore.flush();
    let hook;
    const onChangeMock = jest.fn();
    const updateExchangeRate = jest.fn();
    updateExchangeRate.mockReturnValueOnce({
      type: SUCCESS_CALL,
      toAmount: "100.00"
    });
    await act(async () => {
      hook = renderHook(
        ({ onChange, state }) =>
          useOneTimeForm(onChange, state, updateExchangeRate),
        {
          initialProps: {
            onChange: onChangeMock,
            state: mockState
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;
    await act(async () => {
      result.current.onChangeDate("some date");
    });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    await act(async () => {
      result.current.onBlurAmount({
        target: {
          value: 123
        }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(2);
    await act(async () => {
      result.current.handleOnAccountChange(null, { name: "", value: "" });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(3);
    await act(async () => {
      result.current.handleAmountChange({
        target: {
          name: "amount",
          value: "123"
        }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(4);
    expect(updateExchangeRate).toBeCalled();
    await act(async () => {
      result.current.handleAmountChange({
        target: {
          name: "someOtherField",
          value: "123"
        }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(5);
    await act(async () => {
      result.current.onFocusAmount({
        target: {
          value: 123
        }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(6);
  });
  it(">> onChange is called for Add Payee", async () => {
    DataStore.flush();
    let hook;
    const updateExchangeRate = jest.fn();
    await act(async () => {
      hook = renderHook(
        ({ onChange, state }) =>
          useOneTimeForm(onChange, state, updateExchangeRate),
        {
          initialProps: {
            state: mockState
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;
    await act(async () => {
      result.current.handleOnAccountChange(null, {
        name: "to",
        value: "add-payee"
      });
    });
    expect(result.current.history.location.pathname).toEqual(
      "/move-money/bill-payment/"
    );
    expect(result.current.history.location.hash).toEqual("#addPayee");
  });
  it(">> should call onBlurAmount and onFocusAmount properly", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateExchangeRateMock = jest.fn();
    updateExchangeRateMock.mockImplementation(() => {
      return {
        type: NO_CALL
      };
    });
    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateExchangeRate }) =>
          useOneTimeForm(onChange, state, updateExchangeRate),
        {
          initialProps: {
            onChange: onChangeMock,
            state: mockState,
            updateExchangeRate: updateExchangeRateMock
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;

    await act(async () => {
      await result.current.onBlurAmount({
        target: { value: "100" }
      });
    });
    expect(onChangeMock).toHaveBeenCalledWith({
      name: "amount",
      value: "$100.00"
    });
    expect(updateExchangeRateMock).toBeCalled();

    await act(async () => {
      await result.current.onFocusAmount({
        target: { value: "100" }
      });
    });

    expect(onChangeMock).toHaveBeenCalledWith({
      name: "amount",
      value: "$100.00"
    });
  });

  it(">> should properly call handleOnAccountChange with cross currency", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateExchangeRate = jest.fn();
    updateExchangeRate.mockImplementation(() => {
      return {
        type: SUCCESS_CALL,
        toAmount: 100.34
      };
    });
    await act(async () => {
      hook = renderHook(
        ({ onChange, state }) =>
          useOneTimeForm(onChange, state, updateExchangeRate),
        {
          initialProps: {
            onChange: onChangeMock,
            state: {
              from: "idFrom",
              fromAccounts: [
                {
                  id: "idFrom",
                  currency: "USD",
                  availableBalance: { currency: "CAD", value: 387005.66 }
                }
              ],
              billPayees: [
                {
                  billPayeeId: "idTo",
                  ATBMastercardCurrency: "USD"
                }
              ],
              to: "",
              amount: "$100.00",
              amountTo: "",
              fromCurrency: "CAD",
              toCurrency: null,
              isDisplayedToAmount: false
            }
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;

    // invalid entry validation for from account
    await act(async () => {
      await result.current.handleOnAccountChange(null, {
        name: "to",
        value: "idTo"
      });
    });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(result.current.getValues().to).toEqual("idTo");
    expect(result.current.getValues().fromCurrency).toEqual("CAD");
    expect(result.current.getValues().isDisplayedToAmount).toEqual(true);
    expect(result.current.getValues().amountTo).toEqual("100.34");
    expect(onChangeMock).toBeCalledTimes(1);
    // no errors, all validation are called
    expect(result.current.errors).toEqual({});
  });

  it(">> should return NO_CALL from handleOnAccountChange with disabled account", async () => {
    DataStore.flush();
    let hook;
    const onChangeMock = jest.fn();
    const updateExchangeRate = jest.fn();
    await act(async () => {
      hook = renderHook(
        ({ onChange, state }) =>
          useOneTimeForm(onChange, state, updateExchangeRate),
        {
          initialProps: {
            onChange: onChangeMock,
            state: {
              fromAccountsFormatted: [
                {
                  key: "id",
                  text: "account",
                  value: "id",
                  disabled: true
                }
              ]
            }
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;
    let res;
    await act(async () => {
      res = await result.current.handleOnAccountChange(null, {
        name: "from",
        value: "id"
      });
    });
    expect(res).toEqual(NO_CALL);
  });

  it(">> should return NO_CALL from handleOnAccountChange with disabled payee", async () => {
    DataStore.flush();
    let hook;
    const onChangeMock = jest.fn();
    const updateExchangeRate = jest.fn();
    await act(async () => {
      hook = renderHook(
        ({ onChange, state }) =>
          useOneTimeForm(onChange, state, updateExchangeRate),
        {
          initialProps: {
            onChange: onChangeMock,
            state: {
              billPayeesFormatted: [
                {
                  key: "id",
                  text: "account",
                  value: "id",
                  disabled: true
                }
              ]
            }
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;
    let res;
    await act(async () => {
      res = await result.current.handleOnAccountChange(null, {
        name: "to",
        value: "id"
      });
    });
    expect(res).toEqual(NO_CALL);
  });

  it(">> should properly call handleOnAccountChange with different result.type", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateExchangeRate = jest.fn();
    updateExchangeRate.mockImplementation(() => {
      return {
        type: NO_CALL
      };
    });
    await act(async () => {
      hook = renderHook(
        ({ onChange, state }) =>
          useOneTimeForm(onChange, state, updateExchangeRate),
        {
          initialProps: {
            onChange: onChangeMock,
            state: {
              from: "idFrom",
              fromAccounts: [
                {
                  id: "idFrom",
                  currency: "USD",
                  availableBalance: { currency: "CAD", value: 387005.66 }
                }
              ],
              billPayees: [
                {
                  billPayeeId: "idTo",
                  ATBMastercardCurrency: "USD"
                }
              ],
              to: "",
              amount: "$99.00",
              amountTo: "crazyAmount",
              fromCurrency: "CAD",
              toCurrency: null,
              isDisplayedToAmount: false
            }
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;

    // invalid entry validation for from account
    await act(async () => {
      await result.current.handleOnAccountChange(null, {
        name: "to",
        value: "idTo"
      });
    });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(result.current.getValues().to).toEqual("idTo");
    expect(result.current.getValues().fromCurrency).toEqual("CAD");
    expect(result.current.getValues().isDisplayedToAmount).toEqual(true);
    expect(result.current.getValues().amountTo).toEqual("crazyAmount");
    expect(onChangeMock).toBeCalledTimes(1);
    // no errors, all validation are called
    expect(result.current.errors).toEqual({});
  });
  it(">> should call onBlurAmount on SUCCESS_CALL for exchange API", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateExchangeRateMock = jest.fn();
    updateExchangeRateMock.mockImplementation(() => {
      return {
        type: SUCCESS_CALL,
        toAmount: 100.34
      };
    });
    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateExchangeRate }) =>
          useOneTimeForm(onChange, state, updateExchangeRate),
        {
          initialProps: {
            onChange: onChangeMock,
            state: mockStateCADtoUSD,
            updateExchangeRate: updateExchangeRateMock
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;

    await act(async () => {
      await result.current.onBlurAmount({
        target: { value: "100" }
      });
    });
    expect(onChangeMock).toHaveBeenCalledWith({
      name: "amount",
      value: "$100.00"
    });
    expect(result.current.getValues().amountTo).toEqual("100.34");
  });

  it(">> should call onBlurAmountTo on SUCCESS_CALL for empty value", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateExchangeRateMock = jest.fn();
    updateExchangeRateMock.mockImplementation(() => {
      return {
        type: SUCCESS_CALL,
        toAmount: 100.34,
        fromAmount: 125.43
      };
    });
    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateExchangeRate }) =>
          useOneTimeForm(onChange, state, updateExchangeRate),
        {
          initialProps: {
            onChange: onChangeMock,
            state: mockState,
            updateExchangeRate: updateExchangeRateMock
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;

    await act(async () => {
      await result.current.onBlurAmountTo({
        target: { value: "" }
      });
    });
    expect(result.current.getValues().amountTo).toEqual("100.34");
    expect(result.current.getValues().amount).not.toBeDefined();
    expect(onChangeMock).toHaveBeenCalledWith({
      name: "amountTo",
      value: "$100.34"
    });

    await act(async () => {
      await result.current.onBlurAmountTo({
        target: { value: "0.0" }
      });
    });
    expect(result.current.getValues().amountTo).toEqual("100.34");
    expect(result.current.getValues().amount).not.toBeDefined();
    expect(onChangeMock).toHaveBeenCalledWith({
      name: "amountTo",
      value: "$100.34"
    });
  });

  it(">> should call onBlurAmountTo on SUCCESS_CALL for real value", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateExchangeRateMock = jest.fn();
    updateExchangeRateMock.mockImplementation(() => {
      return {
        type: SUCCESS_CALL,
        toAmount: 100.34,
        fromAmount: 125.43
      };
    });
    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateExchangeRate }) =>
          useOneTimeForm(onChange, state, updateExchangeRate),
        {
          initialProps: {
            onChange: onChangeMock,
            state: mockState,
            updateExchangeRate: updateExchangeRateMock
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;

    await act(async () => {
      await result.current.onBlurAmountTo({
        target: { value: "100.02" }
      });
    });
    expect(result.current.getValues().amountTo).not.toBeDefined();
    expect(result.current.getValues().amount).toEqual("125.43");
    expect(onChangeMock).toHaveBeenCalledWith({
      name: "amountTo",
      value: "$100.02"
    });
  });

  it(">> should call onBlurAmountTo on FAILED_CALL on exceeding amount", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateExchangeRateMock = jest.fn();
    updateExchangeRateMock.mockImplementation(() => {
      return {
        type: FAILED_CALL,
        error: EXCEEDING_AMOUNT,
        limit: 50000
      };
    });
    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateExchangeRate }) =>
          useOneTimeForm(onChange, state, updateExchangeRate),
        {
          initialProps: {
            onChange: onChangeMock,
            state: mockStateCADtoUSD,
            updateExchangeRate: updateExchangeRateMock
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;

    await act(async () => {
      await result.current.onBlurAmountTo({
        target: { value: 100.02 }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(result.current.getValues().maxLimitExceeded).toEqual(50000);
  });

  it(">> should call onBlurAmount on FAILED_CALL on exceeding amount", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateExchangeRateMock = jest.fn();
    updateExchangeRateMock.mockImplementation(() => {
      return {
        type: FAILED_CALL,
        error: EXCEEDING_AMOUNT,
        limit: 50000
      };
    });
    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateExchangeRate }) =>
          useOneTimeForm(onChange, state, updateExchangeRate),
        {
          initialProps: {
            onChange: onChangeMock,
            state: mockStateCADtoUSD,
            updateExchangeRate: updateExchangeRateMock
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;

    await act(async () => {
      await result.current.onBlurAmount({
        target: { value: 100.02 }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(result.current.getValues().maxLimitExceeded).toEqual(50000);
  });
  it(">> should call onBlurAmountTo on NO_CALL for any value", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateExchangeRate = jest.fn();
    updateExchangeRate.mockImplementation(() => {
      return {
        type: NO_CALL
      };
    });
    await act(async () => {
      hook = renderHook(
        ({ onChange, state }) =>
          useOneTimeForm(onChange, state, updateExchangeRate),
        {
          initialProps: {
            onChange: onChangeMock,
            state: mockState
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;

    await act(async () => {
      await result.current.onBlurAmountTo({
        target: { value: "100.02" }
      });
    });
    expect(result.current.getValues().amountTo).not.toBeDefined();
    expect(result.current.getValues().amount).not.toBeDefined();
    expect(onChangeMock).toHaveBeenCalledWith({
      name: "amountTo",
      value: "$100.02"
    });

    await act(async () => {
      await result.current.onBlurAmountTo({
        target: { value: "" }
      });
    });
    expect(result.current.getValues().amountTo).not.toBeDefined();
    expect(result.current.getValues().amount).not.toBeDefined();
    expect(onChangeMock).toHaveBeenCalledWith({
      name: "amountTo",
      value: ""
    });
  });
  it(">> should call handleOnAccountChange on FAILED_CALL exceeding any limit", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateExchangeRateMock = jest.fn();
    updateExchangeRateMock.mockImplementation(() => {
      return {
        type: FAILED_CALL,
        error: EXCEEDING_AMOUNT,
        limit: 50000
      };
    });
    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateExchangeRate }) =>
          useOneTimeForm(onChange, state, updateExchangeRate),
        {
          initialProps: {
            updateExchangeRate: updateExchangeRateMock,
            onChange: onChangeMock,
            state: mockStateCADtoUSD
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;

    await act(async () => {
      result.current.handleOnAccountChange(null, {
        name: "from",
        value: "idFrom"
      });
    });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(result.current.getValues().maxLimitExceeded).toEqual(50000);
    expect(result.current.errors.amount).toEqual(
      expect.objectContaining({ type: "requiredMaxExchangeAmount" })
    );
  });
});
