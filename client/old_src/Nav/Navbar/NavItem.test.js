import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import NavItem from "./NavItem";

const defaultProps = {
  id: "nav-item",
  onClick: jest.fn()
};

const children = "My Nav Child";

const renderComponent = (props = {}) =>
  render(
    <NavItem {...defaultProps} {...props}>
      {children}
    </NavItem>
  );

describe("NavItem", () => {
  it(">> Should render passed in children", () => {
    renderComponent();
    const { getByText } = screen;

    expect(getByText(children)).toBeVisible();
  });

  it(">> Should fire `onClick` prop when clicked", () => {
    const onClick = jest.fn();
    renderComponent({ onClick });
    const { getByText } = screen;

    const button = getByText(children);
    fireEvent.click(button);

    expect(onClick).toBeCalledTimes(1);
  });

  it(">> Should have all passed in classes", () => {
    const className = "passed-in-class-name";
    renderComponent({ className });
    const { getByRole } = screen;

    const button = getByRole("button");
    expect(button).toHaveClass(className);
  });
});
