import React from "react";
import { render, screen } from "@testing-library/react";
import Icon from "./Icon";

describe("Icon component", () => {
  it("should render with a React component", () => {
    const TestComponent = () => <svg data-testid="test-svg" />;

    render(<Icon component={TestComponent} />);

    expect(screen.getByTestId("test-svg")).toBeVisible();
  });

  it("should have a wrapper that accepts props passed in", () => {
    const TestComponent = () => <svg data-testid="test-svg" />;

    render(<Icon component={TestComponent} data-testid="test-wrapper" />);

    expect(screen.getByTestId("test-wrapper")).toBeVisible();
  });
});
