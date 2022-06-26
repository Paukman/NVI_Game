import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import PropTypes from "prop-types";
import { RenderWithProviders } from "utils/TestUtils";
import useAutodepositForm from "./useAutodepositForm";

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

describe("useAutodepositForm hook", () => {
  it(">> onChange is called in the useAutodepositForm", async () => {
    let hook;
    const onInputChangeMock = jest.fn();
    await act(async () => {
      hook = renderHook(
        ({ onInputChange }) => useAutodepositForm(onInputChange),
        {
          initialProps: {
            onInputChange: onInputChangeMock
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result } = hook;
    const event = {
      target: {
        name: "account",
        value: ""
      }
    };
    await act(async () => {
      await result.current.onChange(event);
    });

    expect(onInputChangeMock).toHaveBeenCalledTimes(1);
  });
});
