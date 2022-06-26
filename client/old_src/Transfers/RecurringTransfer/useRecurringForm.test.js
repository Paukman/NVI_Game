import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import PropTypes from "prop-types";
import { RenderWithProviders } from "utils/TestUtils";
import MockDate from "mockdate";
import useRecurringForm from "./useRecurringForm";
import { endingOptions } from "../constants";

const mockState = {
  state: {
    from: "",
    to: "",
    amount: "",
    frequency: "",
    ending: "",
    starting: "",
    numberOfTransfers: "",
    endingOption: "",
    note: ""
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

describe("Testing useRecurringForm hook", () => {
  beforeEach(() => {
    MockDate.set("2020-01-30T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> should properly call onChangeDate for starting", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateRecurringMessage = jest.fn();
    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateEndDateNoOfTransfersMessage }) =>
          useRecurringForm(onChange, state, updateEndDateNoOfTransfersMessage),
        {
          initialProps: {
            onChange: onChangeMock,
            state: mockState,
            updateEndDateNoOfTransfersMessage: updateRecurringMessage
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;
    // invalid entry validation
    await act(async () => {
      await result.current.onChangeDate("starting", "some date");
    });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(updateRecurringMessage).toHaveBeenCalledTimes(1);
    expect(result.current.errors.starting).toEqual(
      expect.objectContaining({ type: "ensureValidDate" })
    );

    // date is not in the past validation
    await act(async () => {
      await result.current.onChangeDate("starting", "Jan 26, 2020");
    });
    expect(result.current.errors.starting).toEqual(
      expect.objectContaining({ type: "ensureDateIsNotInThePast" })
    );

    // date is not to far in the future (1 year) validation
    await act(async () => {
      await result.current.onChangeDate("starting", "Feb 30, 2021");
    });
    expect(result.current.errors.starting).toEqual(
      expect.objectContaining({ type: "ensureDateIsNotTooFarInFuture" })
    );

    // date is not after the end date validation
    result.current.setValue("ending", "Apr 23, 2020");
    result.current.setValue("endingOption", endingOptions.endDate);
    await act(async () => {
      await result.current.onChangeDate("starting", "Apr 26, 2020");
    });
    expect(result.current.errors.starting).toEqual(
      expect.objectContaining({ type: "ensureDateIsNotAfterEndDate" })
    );
    await act(async () => {
      await result.current.onChangeDate("starting", "Apr 21, 2020");
    });
    expect(onChangeMock).toHaveBeenCalledTimes(5);
    expect(updateRecurringMessage).toHaveBeenCalledTimes(5);
    expect(result.current.errors).toEqual({});
  });

  it(">> should properly call onChangeDate for ending", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateRecurringMessage = jest.fn();
    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateEndDateNoOfTransfersMessage }) =>
          useRecurringForm(onChange, state, updateEndDateNoOfTransfersMessage),
        {
          initialProps: {
            onChange: onChangeMock,
            state: mockState,
            updateEndDateNoOfTransfersMessage: updateRecurringMessage
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;
    // invalid entry validation
    await act(async () => {
      await result.current.onChangeDate("ending", "some date");
    });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(updateRecurringMessage).toHaveBeenCalledTimes(1);
    expect(result.current.errors.ending).toEqual(
      expect.objectContaining({ type: "ensureValidDate" })
    );
    // not in the past validation
    await act(async () => {
      await result.current.onChangeDate("ending", "Jan 26, 2020");
    });
    expect(result.current.errors.ending).toEqual(
      expect.objectContaining({ type: "ensureDateIsNotInThePast" })
    );

    // not before the start date validation
    result.current.setValue("starting", "Apr 26, 2020");
    await act(async () => {
      await result.current.onChangeDate("ending", "Apr 23, 2020");
    });
    expect(result.current.errors.ending).toEqual(
      expect.objectContaining({ type: "ensureDateIsNotBeforeStartDate" })
    );

    // not beyond 999 payments for weekly (to far out) validation
    result.current.setValue("frequency", "weekly");
    await act(async () => {
      await result.current.onChangeDate("ending", "Jun 18, 2039");
    });
    expect(result.current.errors.ending).toEqual(
      expect.objectContaining({ type: "ensureRecurringDateIsNotTooFarOut" })
    );

    await act(async () => {
      await result.current.onChangeDate("ending", "Jun 17, 2039");
    });
    expect(onChangeMock).toHaveBeenCalledTimes(5);
    expect(updateRecurringMessage).toHaveBeenCalledTimes(5);
    expect(result.current.errors).toEqual({});
  });

  it(">> should properly call handleOnChange ", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateRecurringMessage = jest.fn();
    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateEndDateNoOfTransfersMessage }) =>
          useRecurringForm(onChange, state, updateEndDateNoOfTransfersMessage),
        {
          initialProps: {
            onChange: onChangeMock,
            state: mockState,
            updateEndDateNoOfTransfersMessage: updateRecurringMessage
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;

    // invalid entry validation for from account
    await act(async () => {
      await result.current.handleOnChange(null, { name: "to", value: "" });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(result.current.getValues().to).toEqual("");
    expect(result.current.errors.to).toEqual(
      expect.objectContaining({ type: "requiredToAccount" })
    );
    await act(async () => {
      await result.current.handleOnChange(null, {
        name: "to",
        value: "some account"
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(result.current.getValues().to).toEqual("some account");
    expect(result.current.errors).toEqual({});

    // invalid entry validation for to account
    await act(async () => {
      await result.current.handleOnChange(null, { name: "from", value: "" });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(3);
    expect(result.current.getValues().from).toEqual("");
    expect(result.current.errors.from).toEqual(
      expect.objectContaining({ type: "requiredFromAccount" })
    );
    await act(async () => {
      await result.current.handleOnChange(null, {
        name: "from",
        value: "some account"
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(4);
    expect(result.current.getValues().from).toEqual("some account");
    expect(result.current.errors.from).toEqual(
      expect.objectContaining({ type: "ensureRecurringTransferSupported" })
    );
  });

  it(">> should properly call handleOnFrequencyChange ", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateRecurringMessage = jest.fn();
    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateEndDateNoOfTransfersMessage }) =>
          useRecurringForm(onChange, state, updateEndDateNoOfTransfersMessage),
        {
          initialProps: {
            onChange: onChangeMock,
            state: mockState,
            updateEndDateNoOfTransfersMessage: updateRecurringMessage
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;

    // invalid entry validation
    await act(async () => {
      await result.current.handleOnFrequencyChange(null, {
        name: "frequency",
        value: ""
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(updateRecurringMessage).toHaveBeenCalledTimes(1);
    expect(result.current.getValues().frequency).toEqual("");
    expect(result.current.errors.frequency).toEqual(
      expect.objectContaining({ type: "requiredFrequency" })
    );
    await act(async () => {
      await result.current.handleOnFrequencyChange(null, {
        name: "frequency",
        value: "monthly"
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(updateRecurringMessage).toHaveBeenCalledTimes(2);
    expect(result.current.getValues().frequency).toEqual("monthly");
    expect(result.current.errors).toEqual({});

    // should trigger end date validation if present
    result.current.setValue("ending", "2020-01-18");
    result.current.setValue("endingOption", endingOptions.endDate);
    await act(async () => {
      await result.current.handleOnFrequencyChange(null, {
        name: "frequency",
        value: "weekly"
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(3);
    expect(updateRecurringMessage).toHaveBeenCalledTimes(3);
    expect(result.current.getValues().frequency).toEqual("weekly");
    expect(result.current.errors.ending).toEqual(
      expect.objectContaining({ type: "ensureDateIsNotInThePast" })
    );
  });

  it(">> should properly call handleInputChange", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateRecurringMessage = jest.fn();

    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateEndDateNoOfTransfersMessage }) =>
          useRecurringForm(onChange, state, updateEndDateNoOfTransfersMessage),
        {
          initialProps: {
            onChange: onChangeMock,
            state: { ...mockState, from: "someAccount" },
            updateEndDateNoOfTransfersMessage: updateRecurringMessage
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;

    // invalid entry validation
    await act(async () => {
      await result.current.handleInputChange({
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
      await result.current.handleInputChange({
        target: { name: "amount", value: "$100000.00" }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(result.current.errors.amount).toEqual(
      expect.objectContaining({ type: "requiredMaxAmount" })
    );

    await act(async () => {
      await result.current.handleInputChange({
        target: { name: "amount", value: "$0.00" }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(3);
    expect(result.current.errors.amount).toEqual(
      expect.objectContaining({ type: "requiredMinAmount" })
    );

    // balance limit validation
    await act(async () => {
      await result.current.handleInputChange({
        target: { name: "amount", value: "$1500.00" }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(4);
    expect(result.current.errors.amount).toEqual(
      expect.objectContaining({ type: "balanceLimit" })
    );
  });

  it(">> should call onBlurAmount and onFocusAmount properly", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateRecurringMessage = jest.fn();
    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateEndDateNoOfTransfersMessage }) =>
          useRecurringForm(onChange, state, updateEndDateNoOfTransfersMessage),
        {
          initialProps: {
            onChange: onChangeMock,
            state: mockState,
            updateEndDateNoOfTransfersMessage: updateRecurringMessage
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

  it(">> should properly call onChangeEndingOption", async () => {
    const testState = {
      ...mockState,
      starting: "2020-02-05", // if "Feb 05, 2020" we get deprecation warning
      ending: "2020-01-25",
      endingOptions: endingOptions.never
    };

    let hook;
    const onChangeMock = jest.fn();
    const updateRecurringMessage = jest.fn();
    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateEndDateNoOfTransfersMessage }) =>
          useRecurringForm(onChange, state, updateEndDateNoOfTransfersMessage),
        {
          initialProps: {
            onChange: onChangeMock,
            state: testState,
            updateEndDateNoOfTransfersMessage: updateRecurringMessage
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;
    result.current.setValue("endingOption", endingOptions.never);

    // invalid entry validation
    await act(async () => {
      await result.current.onChangeEndingOption(
        "endingOption",
        endingOptions.never
      );
    });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(updateRecurringMessage).toHaveBeenCalledTimes(1);
    expect(result.current.errors.ending).toBeUndefined();

    await act(async () => {
      await result.current.onChangeEndingOption(
        "endingOption",
        endingOptions.endDate
      );
    });
    // validate ending date if ending option is endDate
    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(updateRecurringMessage).toHaveBeenCalledTimes(2);
    expect(result.current.errors.ending).toEqual(
      expect.objectContaining({ type: "ensureDateIsNotInThePast" })
    );
    expect(result.current.errors.starting).toEqual(
      expect.objectContaining({ type: "ensureDateIsNotAfterEndDate" })
    );

    // starting is validated again, but now there is no error
    await act(async () => {
      await result.current.onChangeEndingOption(
        "endingOption",
        endingOptions.numberOfTransfers
      );
    });

    expect(result.current.errors.starting).toBeUndefined();
    expect(onChangeMock).toHaveBeenCalledTimes(3);
    expect(updateRecurringMessage).toHaveBeenCalledTimes(3);
  });

  it(">> should properly call onChangeNoOfTansfers ", async () => {
    let hook;
    const onChangeMock = jest.fn();
    const updateRecurringMessage = jest.fn();
    await act(async () => {
      hook = renderHook(
        ({ onChange, state, updateEndDateNoOfTransfersMessage }) =>
          useRecurringForm(onChange, state, updateEndDateNoOfTransfersMessage),
        {
          initialProps: {
            onChange: onChangeMock,
            state: mockState,
            updateEndDateNoOfTransfersMessage: updateRecurringMessage
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;

    // invalid entry validation
    await act(async () => {
      await result.current.onChangeNoOfTansfers({
        target: { name: "numberOfTransfers", value: "" }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(updateRecurringMessage).toHaveBeenCalledTimes(1);
    expect(result.current.errors.numberOfTransfers).toEqual(
      expect.objectContaining({ type: "requiredNoOfTransfers" })
    );
    await act(async () => {
      await result.current.onChangeNoOfTansfers({
        target: { name: "numberOfTransfers", value: "100" }
      });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(updateRecurringMessage).toHaveBeenCalledTimes(2);
    expect(result.current.errors).toEqual({});
  });
});
