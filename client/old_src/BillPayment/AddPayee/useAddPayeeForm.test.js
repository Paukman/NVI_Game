import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import PropTypes from "prop-types";
import { RenderWithProviders } from "utils/TestUtils";
import useAddPayeeForm from "./useAddPayeeForm";

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

describe("useAddPayeeForm hook", () => {
  it(">> onChange is called in the useAddPayeeForm", async () => {
    let hook;
    const onInputChangeMock = jest.fn();
    const handleResultSelectMock = jest.fn();
    const handleSearchChangeMock = jest.fn();
    await act(async () => {
      hook = renderHook(
        ({ onInputChange, handleResultSelect, handleSearchChange }) =>
          useAddPayeeForm(
            onInputChange,
            handleResultSelect,
            handleSearchChange,
            { approvedCreditors: [] }
          ),
        {
          initialProps: {
            onInputChange: onInputChangeMock,
            handleResultSelect: handleResultSelectMock,
            handleSearchChange: handleSearchChangeMock
          },
          wrapper: ProvidersWrapper()
        }
      );
    });
    const { result, waitForNextUpdate } = hook;
    const event = {
      target: {
        name: "account",
        value: ""
      }
    };
    result.current.onChange(event);
    expect(onInputChangeMock).toHaveBeenCalledTimes(1);
    const search = {
      name: "abc"
    };
    expect(onInputChangeMock).toHaveBeenCalledTimes(1);
    result.current.onSelectResult(null, { result: search });
    expect(handleResultSelectMock).toHaveBeenCalledTimes(1);
    result.current.onSearch("ddd");
    expect(handleSearchChangeMock).toHaveBeenCalledTimes(1);
    result.current.onChange(event);
    await waitForNextUpdate();
    expect(result.current.errors.account.ref.name).toEqual("account");
    result.current.onBlurPayee(null, { value: "Payee" });
    expect(handleResultSelectMock).toHaveBeenCalledTimes(2);
    expect(handleResultSelectMock).toHaveBeenCalledWith({ name: "Payee" });
  });
});
