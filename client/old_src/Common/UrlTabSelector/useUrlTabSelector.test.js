import React from "react";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import { RenderWithProviders } from "utils/TestUtils";
import useUrlTabSelector from "./useUrlTabSelector";

const items = [
  {
    url: "/more/interac-preferences/profile/view-profile",
    class: "active",
    name: "Profile",
    icon: "icon_one"
  },
  {
    url: "/more/interac-preferences/autodeposit/view",
    class: "inactive",
    name: "Autodeposit",
    icon: "icon_two"
  }
];

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

describe("Testing useUrlTabSelector", () => {
  it(">> should return default setting", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useUrlTabSelector(items), {
        wrapper: SnackbarWrapper("/more/interac-preferences//no-profile")
      });
    });
    const { result } = hook;
    expect(result.current.tabs).toEqual(items);
  });
});
