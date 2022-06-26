import React from "react";
import PropTypes from "prop-types";
import mixpanel from "mixpanel-browser";
import { renderHook, act } from "@testing-library/react-hooks";
import {
  RenderWithProviders,
  mockApiData,
  windowMatchMediaMock
} from "utils/TestUtils";
import DataStore from "utils/store";
import useProfile, { profileURL } from "./useProfile";

import { dataWithProfile, dataWithNoProfile } from "./constants";

const SnackbarWrapper = () => {
  const Component = props => {
    const { children } = props;
    return <RenderWithProviders location="/">{children}</RenderWithProviders>;
  };
  Component.propTypes = {
    children: PropTypes.element.isRequired
  };
  return Component;
};

const WrapperWithArgs = (
  location,
  show,
  hide,
  openSnackbar,
  modalComponent,
  showMessage = null
) => {
  const Component = props => {
    const { children } = props;
    return (
      <RenderWithProviders
        location={location}
        show={show}
        hide={hide}
        openSnackbar={openSnackbar}
        modalComponent={modalComponent}
        showMessage={showMessage}
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
    windowMatchMediaMock();
    DataStore.flush();
    if (mixpanelMock) {
      mixpanelMock.mockClear();
    }
    mixpanelMock = jest.spyOn(mixpanel, "track").mockImplementation();
  });
  afterEach(() => {
    DataStore.flush();
  });

  it(">> should set proper state when fetches user profile on success ", async () => {
    mockApiData([
      {
        url: profileURL,
        results: dataWithProfile
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useProfile(), {
        wrapper: SnackbarWrapper()
      });
    });
    const { result } = hook;
    expect(result.current.profileState).toEqual({
      name: "James Bond",
      email: "james_bond@saveworld.com",
      enabled: true,
      success: false,
      loading: false,
      saving: false,
      error: { type: null },
      editing: false,
      profileUpdated: false,
      dataLoaded: true,
      editProfile: { name: "James Bond", email: "james_bond@saveworld.com" }
    });
  });
  it(">> should set proper state when fetches user profile on bad request ", async () => {
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
        wrapper: SnackbarWrapper()
      });
    });
    const { result } = hook;
    expect(result.current.profileState).toEqual({
      name: "",
      email: "",
      enabled: false,
      success: false,
      loading: true,
      saving: false,
      error: { type: null },
      editing: false,
      profileUpdated: false,
      dataLoaded: false,
      editProfile: { name: "", email: "" }
    });
  });
  it(">> should set proper state when fetches user with no profile ", async () => {
    mockApiData([
      {
        url: profileURL,
        results: dataWithNoProfile
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useProfile(), {
        wrapper: SnackbarWrapper()
      });
    });
    const { result } = hook;
    expect(result.current.profileState).toEqual({
      name: "",
      email: "",
      enabled: false,
      success: false,
      loading: false,
      saving: false,
      error: { type: null },
      editing: false,
      profileUpdated: false,
      dataLoaded: true,
      editProfile: { name: "", email: "" }
    });
  });
  it(">> call update profile with success ", async () => {
    mockApiData([
      {
        url: profileURL,
        results: [],
        status: 200,
        method: "put"
      }
    ]);
    let hook;
    const showMessage = jest.fn();
    await act(async () => {
      hook = renderHook(() => useProfile(), {
        wrapper: WrapperWithArgs(
          "/",
          () => null,
          () => null,
          () => null,
          () => null,
          showMessage
        )
      });
    });

    const { result } = hook;
    const { updateProfile } = result.current;
    await act(async () =>
      updateProfile({
        name: " Boby",
        email: "Boby@boby.com"
      })
    );
    expect(result.current.showMessage).toBeCalled();
    expect(result.current.profileState).toEqual({
      name: "Boby",
      email: "Boby@boby.com",
      enabled: true,
      success: false,
      loading: false,
      saving: false,
      error: { type: null },
      editing: false,
      profileUpdated: true,
      dataLoaded: true,
      editProfile: { name: "Boby", email: "Boby@boby.com" }
    });
    expect(mixpanelMock).toBeCalledTimes(1);
  });
  it(">> call update profile with failure ", async () => {
    mockApiData([
      {
        url: profileURL,
        results: [],
        error: "Server Error"
      }
    ]);
    let hook;
    const hide = jest.fn();
    const show = jest.fn();
    await act(async () => {
      hook = renderHook(() => useProfile(), {
        wrapper: WrapperWithArgs(
          "/",
          show,
          hide,
          () => null,
          () => null
        )
      });
    });
    const { result } = hook;
    const { updateProfile } = result.current;
    const modal = jest.spyOn(result.current, "show");
    await act(async () =>
      updateProfile({
        name: "Boby",
        email: "Boby@boby.com"
      })
    );

    expect(modal).toBeCalled();
    expect(result.current.profileState).toEqual({
      name: "",
      email: "",
      enabled: false,
      success: false,
      loading: true,
      saving: false,
      error: { type: true },
      editing: false,
      profileUpdated: false,
      dataLoaded: false,
      editProfile: { name: "", email: "" }
    });
  });

  it(">> call createProfile profile with success ", async () => {
    mockApiData([
      {
        url: profileURL,
        results: [],
        status: 200,
        method: "post"
      }
    ]);
    const showMessage = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useProfile(), {
        wrapper: WrapperWithArgs(
          "/",
          () => null,
          () => null,
          () => null,
          () => null,
          showMessage
        )
      });
    });
    const { result } = hook;
    const { createProfile } = result.current;
    await act(async () =>
      createProfile({
        name: "Boby",
        email: "Boby@boby.com"
      })
    );
    expect(result.current.showMessage).toBeCalled();
    expect(result.current.profileState).toEqual({
      name: "Boby",
      email: "Boby@boby.com",
      enabled: true,
      success: false,
      loading: false,
      saving: false,
      error: { type: null },
      editing: false,
      profileUpdated: true,
      dataLoaded: true,
      editProfile: { name: "Boby", email: "Boby@boby.com" }
    });
    expect(mixpanelMock).toBeCalledTimes(1);
  });
  it(">> call create profile with failure ", async () => {
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
        wrapper: SnackbarWrapper()
      });
    });
    const { result } = hook;
    const { createProfile } = result.current;
    await act(async () =>
      createProfile({
        name: "Boby",
        email: "Boby@boby.com"
      })
    );
    expect(result.current.profileState).toEqual({
      name: "",
      email: "",
      enabled: false,
      success: false,
      loading: true,
      saving: false,
      error: { type: true },
      editing: false,
      profileUpdated: false,
      dataLoaded: false,
      editProfile: { name: "", email: "" }
    });
  });
  it(">> should set proper state when profile value changes ", async () => {
    mockApiData([
      {
        url: profileURL,
        results: dataWithProfile
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useProfile(), {
        wrapper: SnackbarWrapper()
      });
    });
    const { result } = hook;
    expect(result.current.profileState).toEqual({
      name: "James Bond",
      email: "james_bond@saveworld.com",
      enabled: true,
      success: false,
      loading: false,
      saving: false,
      error: { type: null },
      editing: false,
      profileUpdated: false,
      dataLoaded: true,
      editProfile: { name: "James Bond", email: "james_bond@saveworld.com" }
    });
    await act(async () => {
      result.current.onProfileChange({
        target: {
          name: "email",
          value: "test@atb.com"
        }
      });
    });
    expect(result.current.profileState.editProfile.email).toEqual(
      "test@atb.com"
    );
  });
});
