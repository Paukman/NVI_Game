import React from "react";
import { manageContactMessage } from "utils/MessageCatalog";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import { RenderWithProviders } from "utils/TestUtils";
import useNonExistingPayee from "./useNonExistingPayee";

const defaultWrapperProps = {
  location: "/move-money/bill-payment/one-time#create",
  hide: jest.fn(),
  show: jest.fn()
};
const Wrapper = (props = {}) => {
  const Component = ({ children }) => (
    <RenderWithProviders {...defaultWrapperProps} {...props}>
      {children}
    </RenderWithProviders>
  );

  Component.propTypes = {
    children: PropTypes.node.isRequired
  };
  return Component;
};

describe("Testing useNonExistingPayee", () => {
  const mockedPayee = {
    accountNumber: "mocked-payee-here",
    currency: "CAD"
  };

  it(">> should show modal when showNonExistingPayee is called", async () => {
    const show = jest.fn();
    const hide = jest.fn();

    const { result } = renderHook(() => useNonExistingPayee(), {
      wrapper: Wrapper({ show, hide })
    });

    await act(async () => {
      await result.current.showNonExistingPayeeAlert(mockedPayee);
    });

    expect(show).toBeCalledTimes(1);
    expect(show).toBeCalledWith({
      content: manageContactMessage.MSG_RBBP_037C,
      actions: (
        <>
          <button type="button" className="ui button basic" onClick={hide}>
            Cancel
          </button>
          <button
            type="button"
            className="ui button basic"
            onClick={expect.any(Function)}
            id="addPayee"
          >
            Add payee
          </button>
        </>
      )
    });
  });
});
