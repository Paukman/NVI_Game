import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import PropTypes from "prop-types";
import { RenderWithProviders } from "utils/TestUtils";
import DataStore from "utils/store";
import MockDate from "mockdate";
import useOneTimeForm from "./useOneTimeForm";
import { SUCCESS_CALL, NO_CALL } from "../TransferProvider/hooks/constants";

const mockState = {
  state: {
    from: "",
    to: "",
    when: "",
    amount: ""
  }
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

describe("Testing useOneTimeForm hook", () => {
  beforeEach(() => {
    MockDate.set("2020-01-30T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> onChange is called in the provider for dummy data", async () => {
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
      result.current.handleOnAccountChange(null, { name: "", value: "" });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    await act(async () => {
      result.current.handleAmountChange({
        target: {
          name: "someOtherField",
          value: "123"
        }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(updateExchangeRate).toBeCalled();
  });

  it(">> should properly call onChangeDate for starting", async () => {
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
    // invalid entry validation
    await act(async () => {
      await result.current.onChangeDate("when", "some date");
    });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(result.current.errors.when).toEqual(
      expect.objectContaining({ type: "ensureValidDate" })
    );

    // date is not in the past validation
    await act(async () => {
      await result.current.onChangeDate("when", "Jan 26, 2020");
    });
    expect(result.current.errors.when).toEqual(
      expect.objectContaining({ type: "ensureDateIsNotInThePast" })
    );

    // date is not to far in the future (1 year) validation
    await act(async () => {
      await result.current.onChangeDate("when", "Feb 30, 2021");
    });
    expect(result.current.errors.when).toEqual(
      expect.objectContaining({ type: "ensureDateIsNotTooFarInFuture" })
    );
  });

  it(">> should properly call handleOnAccountChange ", async () => {
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

    // invalid entry validation for from account
    await act(async () => {
      await result.current.handleOnAccountChange(null, {
        name: "to",
        value: ""
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(result.current.getValues().to).toEqual("");
    expect(result.current.errors.to).toEqual(
      expect.objectContaining({ type: "requiredToAccount" })
    );
    await act(async () => {
      await result.current.handleOnAccountChange(null, {
        name: "to",
        value: "some account"
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(result.current.getValues().to).toEqual("some account");
    expect(result.current.errors).toEqual({});

    // invalid entry validation for to account
    await act(async () => {
      await result.current.handleOnAccountChange(null, {
        name: "from",
        value: ""
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(3);
    expect(result.current.getValues().from).toEqual("");
    expect(result.current.errors.from).toEqual(
      expect.objectContaining({ type: "requiredFromAccount" })
    );
    await act(async () => {
      await result.current.handleOnAccountChange(null, {
        name: "from",
        value: "some account"
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(4);
    expect(result.current.getValues().from).toEqual("some account");
    expect.objectContaining({ type: "ensureFutureDatedTransferSupported" });
  });

  it(">> should properly call handleAmountChange", async () => {
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

    // invalid entry validation
    await act(async () => {
      await result.current.handleAmountChange({
        target: { name: "amount", value: "" }
      });
    });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(result.current.getValues().amount).toEqual("");
    expect(result.current.errors.amount).toEqual(
      expect.objectContaining({ type: "requiredAmount" })
    );
    // amount range validation
    await act(async () => {
      await result.current.handleAmountChange({
        target: { name: "amount", value: "$100000.00" }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(result.current.errors.amount).toEqual(
      expect.objectContaining({ type: "requiredMaxAmount" })
    );

    await act(async () => {
      await result.current.handleAmountChange({
        target: { name: "amount", value: "$0.00" }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(3);
    expect(result.current.errors.amount).toEqual(
      expect.objectContaining({ type: "requiredMinAmount" })
    );

    // balance limit validation
    await act(async () => {
      await result.current.handleAmountChange({
        target: { name: "amount", value: "$1500.00" }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(4);
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
              toAccounts: [
                {
                  id: "idTo",
                  currency: "USD"
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
              toAccounts: [
                {
                  id: "idTo",
                  currency: "USD"
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

  it(">> should call onBlurAmountTo on NO_CALL for any value", async () => {
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

  it(">> should still call onChange when updateExchangeRate returns null", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateExchangeRate = jest.fn();
    updateExchangeRate.mockReturnValue(null);
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
      await result.current.handleOnAccountChange(null, {
        name: "to",
        value: "new value"
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toBeCalledWith({ name: "to", value: "new value" });

    await act(async () => {
      await result.current.onBlurAmount({
        target: {
          value: 88.88
        }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(onChangeMock).toBeCalledWith({ name: "amount", value: "$88.88" });

    await act(async () => {
      await result.current.onBlurAmountTo({
        target: {
          value: 66.88
        }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(3);
    expect(onChangeMock).toBeCalledWith({ name: "amountTo", value: "$66.88" });
  });
});
