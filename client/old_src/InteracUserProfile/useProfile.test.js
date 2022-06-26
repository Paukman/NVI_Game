import React from "react";
import PropTypes from "prop-types";
import mixpanel from "mixpanel-browser";
import { renderHook, act } from "@testing-library/react-hooks";
import { RenderWithProviders, mockApiData } from "utils/TestUtils";
import DataStore from "utils/store";
import useProfile, { profileURL } from "./useProfile";

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

jest.mock("mixpanel-browser");

describe("useProfile hook", () => {
  let mixpanelMock;

  beforeEach(() => {
    DataStore.flush();
    mixpanelMock = jest.spyOn(mixpanel, "track").mockImplementation();
  });
  afterEach(() => {
    jest.clearAllMocks();
    DataStore.flush();
  });

  it(">> should set proper state when fetches user profile on success ", async () => {
    mockApiData([
      {
        url: profileURL,
        results: {
          enabled: true
        }
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useProfile(), {
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
    expect(result.current.profile).toEqual({
      render: false,
      error: null,
      loading: false,
      saving: false
    });
  });
  it(">> user profile with server error ", async () => {
    mockApiData([
      {
        url: profileURL,
        results: [],
        error: "Server Error"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useProfile(), {
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
    expect(result.current.profile).toEqual({
      render: false,
      error: "Server Error",
      loading: false,
      saving: false
    });
  });
  it(">> should set proper state when fetches user with no profile ", async () => {
    mockApiData([
      {
        url: profileURL,
        results: null
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useProfile(), {
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
    expect(result.current.profile).toEqual({
      render: true,
      error: null,
      loading: false,
      saving: false
    });
  });
  it(">> call create profile with success ", async () => {
    mockApiData([
      {
        url: profileURL,
        results: [],
        status: 200,
        method: "POST"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useProfile(), {
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
    const { createProfile } = result.current;
    let error;
    await act(async () => {
      error = await createProfile({
        name: "Boby",
        email: "Boby@boby.com"
      });
      return error;
    });
    expect(error).toEqual(null);
    expect(result.current.profile).toEqual({
      render: false,
      error: null,
      loading: false,
      saving: false
    });
    expect(mixpanelMock).toBeCalledTimes(1);
  });
  it(">> call create profile with failure ", async () => {
    mockApiData([
      {
        url: profileURL,
        error: "Server Error",
        status: 200,
        method: "POST"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useProfile(), {
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
    const { createProfile } = result.current;
    await act(async () => {
      await createProfile({
        name: "Boby",
        email: "Boby@boby.com"
      });
    });

    expect(result.current.profile).toEqual({
      render: true,
      error: "Server Error",
      loading: false,
      saving: false
    });
    expect(mixpanelMock).toBeCalledTimes(0);
  });
});
