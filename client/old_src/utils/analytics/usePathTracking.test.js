import React from "react";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";

import { RenderWithProviders } from "utils/TestUtils";
import usePathTracking from "./usePathTracking";

import * as Utils from "./utils";

const Wrapper = location => {
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

describe("Testing useNavTracking hook", () => {
  it(">> should call startTrackingNewLocation", async () => {
    const startTrackingNewLocation = jest.spyOn(
      Utils,
      "startTrackingNewLocation"
    );

    await act(async () => {
      renderHook(() => usePathTracking(), {
        wrapper: Wrapper("/overview")
      });
    });

    expect(startTrackingNewLocation).toBeCalledTimes(1);
  });
});
