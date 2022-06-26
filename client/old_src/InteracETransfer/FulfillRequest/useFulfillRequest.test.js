import React from "react";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import mockApi from "api";
import { RenderWithProviders } from "utils/TestUtils";
import * as utils from "../SendETransfer/utils";
import useFulfillRequest from "./useFulfillRequest";
import {
  fulfillRequest as mockFulfillRequest,
  requestFulfilled as mockRequestFulfilled
} from "./constants";

const WrapperWithArgs = (
  location,
  show,
  hide,
  openSnackbar,
  modalComponent
) => {
  const Component = props => {
    const { children } = props;
    return (
      <RenderWithProviders
        location={location}
        showMessage={show}
        hide={hide}
        show={show}
        openSnackbar={openSnackbar}
        modalComponent={modalComponent}
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

describe("useFulfillRequest hook", () => {
  beforeAll(() => {
    jest
      .spyOn(utils, "fetchValidationWithoutModal")
      .mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return appropriate state when fulfill request resolves", async () => {
    let renderHookResult;
    mockApi.get = jest.fn(async () => {
      return Promise.resolve({
        data: mockFulfillRequest
      });
    });

    await act(async () => {
      renderHookResult = renderHook(() => useFulfillRequest(), {
        wrapper: WrapperWithArgs(
          "/",
          () => null,
          () => null,
          () => null,
          () => null
        )
      });
    });

    const { result } = renderHookResult;

    expect(result.current.fulfillRequest).toEqual({
      data: { value: mockFulfillRequest }
    });
    expect(utils.fetchValidationWithoutModal).toBeCalled();
  });

  it("should not call fetchValidationWithoutModal if money request has already been fulfilled", async () => {
    let renderHookResult;
    mockApi.get = jest.fn(async () => {
      return Promise.resolve({
        data: mockRequestFulfilled
      });
    });

    await act(async () => {
      renderHookResult = renderHook(() => useFulfillRequest(), {
        wrapper: WrapperWithArgs(
          "/",
          () => null,
          () => null,
          () => null,
          () => null
        )
      });
    });

    const { result } = renderHookResult;

    expect(result.current.fulfillRequest).toEqual({
      data: { value: mockRequestFulfilled }
    });
    expect(utils.fetchValidationWithoutModal).not.toBeCalled();
  });

  it("should return error in fulfillRequest object if request fetch failed", async () => {
    let renderHookResult;
    mockApi.get = jest.fn(async () => {
      return Promise.reject(new Error("some error message"));
    });

    await act(async () => {
      renderHookResult = renderHook(() => useFulfillRequest(), {
        wrapper: WrapperWithArgs(
          "/",
          () => null,
          () => null,
          () => null,
          () => null
        )
      });
    });

    const { result } = renderHookResult;

    expect(result.current.fulfillRequest).toBeNull();
    expect(utils.fetchValidationWithoutModal).not.toBeCalled();
  });
});
