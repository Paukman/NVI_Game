import React from "react";
import { billPaymentErrors } from "utils/MessageCatalog";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import { RenderWithProviders } from "utils/TestUtils";
import useNoPayees from "./useNoPayees";

const Wrapper = (location, hide, show) => {
  const Component = props => {
    const { children } = props;
    return (
      <RenderWithProviders location={location} hide={hide} show={show}>
        {children}
      </RenderWithProviders>
    );
  };
  Component.propTypes = {
    children: PropTypes.element.isRequired
  };
  return Component;
};

describe("Testing useNoPayees", () => {
  it(">> should update history", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    const { result } = renderHook(() => useNoPayees(), {
      wrapper: Wrapper("/move-money/bill-payment/one-time#create", hide, show)
    });
    expect(result.current.history.location.pathname).toEqual(
      "/move-money/bill-payment/one-time"
    );
    expect(result.current.history.location.hash).toEqual("#create");

    result.current.onAddPayee();

    expect(result.current.history.location.pathname).toEqual(
      "/move-money/bill-payment/"
    );
    expect(result.current.history.location.hash).toEqual("#addPayee");
  });
  it(">> should call hide", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    const { result } = renderHook(() => useNoPayees(), {
      wrapper: Wrapper("/move-money/bill-payment/one-time#create", hide, show)
    });
    const spy = jest.spyOn(result.current, "hide");
    await act(async () => {
      await result.current.onAddPayee();
    });

    await act(async () => {
      await result.current.onCancel();
    });

    expect(spy).toBeCalledTimes(2);
  });
  it(">> should call show", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    const { result } = renderHook(() => useNoPayees(), {
      wrapper: Wrapper("/move-money/bill-payment/one-time#create", hide, show)
    });
    const spy = jest.spyOn(result.current, "show");
    await act(async () => {
      await result.current.showNoPayeesAlert();
    });
    expect(spy).toBeCalled();
    expect(spy).toBeCalledWith({
      content: billPaymentErrors.MSG_RBBP_037B(),
      actions: (
        <>
          <button
            type="button"
            className="ui button basic"
            onClick={result.current.onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ui button basic"
            onClick={result.current.onAddPayee}
          >
            Add payee
          </button>
        </>
      )
    });
  });
});
