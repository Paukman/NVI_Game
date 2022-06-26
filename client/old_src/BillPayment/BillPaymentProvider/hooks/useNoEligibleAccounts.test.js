import React from "react";
import { billPaymentErrors } from "utils/MessageCatalog";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import { RenderWithProviders } from "utils/TestUtils";
import useNoEligibleAccounts from "./useNoEligibleAccounts";

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

describe("Testing useNoEligibleAccounts", () => {
  it(">> should call show", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    const { result } = renderHook(() => useNoEligibleAccounts(), {
      wrapper: Wrapper("/move-money/bill-payment/one-time#create", hide, show)
    });
    const spy = jest.spyOn(result.current, "show");
    await act(async () => {
      await result.current.showNoEligibleAccountsAlert();
    });

    expect(spy).toBeCalled();
    expect(spy).toBeCalledWith(
      expect.objectContaining({
        content: billPaymentErrors.MSG_RBBP_042
      })
    );
  });
});
