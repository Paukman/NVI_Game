import React from "react";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import { RenderWithProviders } from "utils/TestUtils";
import useProfileRules from "./useProfileRules";

const SnackbarWrapper = location => {
  const Component = props => {
    const { children } = props;
    return (
      <RenderWithProviders location={location}>{children}</RenderWithProviders>
    );
  };
  Component.propTypes = {
    children: PropTypes.element.isRequired
  };
  return Component;
};
describe("Testing useProfileRules", () => {
  const props = {
    profile: {},
    enabled: false,
    dataLoaded: true,
    error: { type: null }
  };

  it(">> should load no profile page", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useProfileRules(props), {
        wrapper: SnackbarWrapper("/more/interac-preferences/profile/")
      });
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/profile/no-profile"
    );
  });
  it(">> should go back to no profile from edit profile page", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useProfileRules(props), {
        wrapper: SnackbarWrapper(
          "/more/interac-preferences/profile/edit-profile"
        )
      });
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/profile/no-profile"
    );
  });
  it(">> should go back to no profile from view profile page", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useProfileRules(props), {
        wrapper: SnackbarWrapper(
          "/more/interac-preferences/profile/view-profile"
        )
      });
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/profile/no-profile"
    );
  });
  it(">> should stay on view page if profile enabled and error exists", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useProfileRules({
            ...props,
            enabled: true,
            profile: { name: "Random email", email: "random@atb.com" },
            error: { type: "Profile Loading Error" }
          }),
        {
          wrapper: SnackbarWrapper(
            "/more/interac-preferences/profile/view-profile"
          )
        }
      );
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/profile/view-profile"
    );
  });

  it(">> should load view profile page", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useProfileRules({
            ...props,
            enabled: true,
            profile: { name: "Random email", email: "random@atb.com" }
          }),
        {
          wrapper: SnackbarWrapper("/more/interac-preferences/profile/")
        }
      );
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/profile/view-profile"
    );
  });
  it(">> should go back to view profile from no profile if profile already exists", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useProfileRules({
            ...props,
            enabled: true,
            profile: { name: "Random email", email: "random@atb.com" }
          }),
        {
          wrapper: SnackbarWrapper(
            "/more/interac-preferences/profile/no-profile"
          )
        }
      );
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/profile/view-profile"
    );
  });

  it(">> should stay on no profile if profile is not enabled and error exists", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useProfileRules({
            ...props,
            error: { type: "Profile loading error" }
          }),
        {
          wrapper: SnackbarWrapper(
            "/more/interac-preferences/profile/no-profile"
          )
        }
      );
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/profile/no-profile"
    );
  });
  it(">> should go back to view profile from create profile if profile already exists", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useProfileRules({
            ...props,
            enabled: true,
            profile: { name: "Random email", email: "random@atb.com" }
          }),
        {
          wrapper: SnackbarWrapper(
            "/more/interac-preferences/profile/create-profile"
          )
        }
      );
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/profile/view-profile"
    );
  });
  it(">> should stay on edit page if error", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useProfileRules({
            ...props,
            error: { type: "Random Error" }
          }),
        {
          wrapper: SnackbarWrapper(
            "/more/interac-preferences/profile/edit-profile"
          )
        }
      );
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/profile/edit-profile"
    );
  });
  it(">> should stay on create page if error", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useProfileRules({
            ...props,
            error: { type: "Random Error" }
          }),
        {
          wrapper: SnackbarWrapper(
            "/more/interac-preferences/profile/create-profile"
          )
        }
      );
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/profile/create-profile"
    );
  });
});
