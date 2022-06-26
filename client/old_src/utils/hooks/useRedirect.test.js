import React from "react";
import PropTypes from "prop-types";
import { renderHook } from "@testing-library/react-hooks";
import { RenderWithProviders } from "utils/TestUtils";
import useRedirect from "./useRedirect";

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

describe("Testing useRedirect", () => {
  it(">> Should redirect page", async () => {
    const { result, rerender } = renderHook(
      ({ to, condition }) => useRedirect(to, condition),
      {
        initialProps: { to: "#create", condition: false },
        wrapper: Wrapper("recurring#review")
      }
    );

    expect(result.current.history.location.hash).toEqual("#review");

    rerender({ to: "#create", condition: true });
    expect(result.current.history.location.hash).toEqual("#create");
  });
});
