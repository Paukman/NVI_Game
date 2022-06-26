import React from "react";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import { RenderWithProviders } from "utils/TestUtils";
import useAutodepositRules from "./useAutodepositRules";
import { autoDeposits } from "./constants";
import { testAutodeposit } from "../constants";

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

describe("Testing useAutodepositRules", () => {
  const props = {
    rules: ["rule1"],
    profile: { enabled: true },
    setAutoDepositRule: jest.fn(),
    dataLoaded: true,
    error: { type: null },
    showNoProfileAlert: jest.fn()
  };

  it(">> should show no profile modal if no profile enabled on view autodeposit", async () => {
    await act(async () => {
      renderHook(
        () => useAutodepositRules({ ...props, profile: { enabled: false } }),
        {
          wrapper: SnackbarWrapper("/more/interac-preferences/autodeposit/view")
        }
      );
    });
    expect(props.showNoProfileAlert).toBeCalled();
  });

  it(">> should show no profile modal if no profile enabled on default autodeposit", async () => {
    await act(async () => {
      renderHook(
        () => useAutodepositRules({ ...props, profile: { enabled: false } }),
        {
          wrapper: SnackbarWrapper("/more/interac-preferences/autodeposit/")
        }
      );
    });
    expect(props.showNoProfileAlert).toBeCalled();
  });

  it(">> should show no profile modal if no profile enabled on register rule", async () => {
    await act(async () => {
      renderHook(
        () => useAutodepositRules({ ...props, profile: { enabled: false } }),
        {
          wrapper: SnackbarWrapper(
            "/more/interac-preferences/autodeposit/register-rule"
          )
        }
      );
    });
    expect(props.showNoProfileAlert).toBeCalled();
  });

  it(">> should show view screen if rules reached max limit", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useAutodepositRules({ ...props, rules: testAutodeposit.maxRules }),
        {
          wrapper: SnackbarWrapper(
            "/more/interac-preferences/autodeposit/register-rule"
          )
        }
      );
    });
    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/autodeposit/view"
    );
  });
  it(">> should go back to view page from edit rules page", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodepositRules(props), {
        wrapper: SnackbarWrapper(
          "/more/interac-preferences/autodeposit/edit-rule"
        )
      });
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/autodeposit/view"
    );
  });

  it(">> should load view page from default if Rules > 0", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodepositRules(props), {
        wrapper: SnackbarWrapper("/more/interac-preferences/autodeposit/")
      });
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/autodeposit/view"
    );
  });
  it(">> should load no rules registered page from default if Rules == 0", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodepositRules({ ...props, rules: [] }), {
        wrapper: SnackbarWrapper("/more/interac-preferences/autodeposit/")
      });
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/autodeposit/no-rules"
    );
  });
  it(">> should go back to view page from pending rule", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodepositRules(props), {
        wrapper: SnackbarWrapper(
          "/more/interac-preferences/autodeposit/pending"
        )
      });
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/autodeposit/view"
    );
  });
  it(">> should go back to view page from no registered rules", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useAutodepositRules(props), {
        wrapper: SnackbarWrapper(
          "/more/interac-preferences/autodeposit/no-rules"
        )
      });
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/autodeposit/view"
    );
  });
  // it(">> should stay on same page on error from no rules page", async () => {
  //   let hook;
  //   await act(async () => {
  //     hook = renderHook(
  //       () => useAutodepositRules({ ...props, error: { type: "error" } }),
  //       {
  //         wrapper: SnackbarWrapper(
  //           "/more/interac-preferences/autodeposit/no-rules"
  //         )
  //       }
  //     );
  //   });

  //   const { result } = hook;
  //   expect(result.current.history.location.pathname).toEqual(
  //     "/more/interac-preferences/autodeposit/no-rules"
  //   );
  // });
  it(">> should stay on same page on error from view page", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(
        () => useAutodepositRules({ ...props, error: { type: "error" } }),
        {
          wrapper: SnackbarWrapper("/more/interac-preferences/autodeposit/view")
        }
      );
    });

    const { result } = hook;
    expect(result.current.history.location.pathname).toEqual(
      "/more/interac-preferences/autodeposit/view"
    );
  });
  it(">> should stay on pending page", async () => {
    await act(async () => {
      renderHook(() => useAutodepositRules({ ...props, rules: autoDeposits }), {
        wrapper: SnackbarWrapper(
          "/more/interac-preferences/autodeposit/pending?rule=CA1DDthQTMvX33Ng"
        )
      });
    });
    expect(props.setAutoDepositRule).toBeCalled();
  });
  it(">> should stay on edit page", async () => {
    await act(async () => {
      renderHook(() => useAutodepositRules({ ...props, rules: autoDeposits }), {
        wrapper: SnackbarWrapper(
          "/more/interac-preferences/autodeposit/edit-rule?rule=CA1DDtnpG8pFTxr7"
        )
      });
    });
    expect(props.setAutoDepositRule).toBeCalled();
  });
});
