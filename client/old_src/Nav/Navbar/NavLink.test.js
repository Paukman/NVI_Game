import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavLink from "./NavLink";

const defaultProps = {
  active: false,
  icon: "icon.svg",
  id: "nav-link"
};

const children = "My Nav Child";

const renderComponent = (props = {}) =>
  render(
    <MemoryRouter>
      <NavLink {...defaultProps} {...props}>
        {children}
      </NavLink>
    </MemoryRouter>
  );

describe("NavLink", () => {
  it(">> Should render passed in children", () => {
    renderComponent();
    const { getByText } = screen;

    expect(getByText(children)).toBeVisible();
  });

  it(">> Should have an active class when active is true", () => {
    renderComponent({ active: true });
    const { getByRole } = screen;

    const button = getByRole("button");
    expect(button).toHaveClass("nav-link--active");
  });

  it(">> Should render as a Link if `to` prop is given", () => {
    renderComponent({ to: "/" });
    const { getByRole } = screen;

    const link = getByRole("link");
    expect(link).toBeVisible();
    expect(link).toHaveTextContent(children);
  });

  it(">> Should have href with `to` value when component is a Link", () => {
    const toPath = "/location/path";
    renderComponent({ to: toPath });
    const { getByRole } = screen;

    const link = getByRole("link");
    expect(link).toHaveAttribute("href", toPath);
  });

  it(">> Should render as a button if `onClick` prop is given", () => {
    const onClick = jest.fn();
    renderComponent({ onClick });
    const { getByRole } = screen;

    const button = getByRole("button");
    expect(button).toBeVisible();
    expect(button).toHaveTextContent(children);
  });

  it(">> Should render a drop arrow icon when component is a button", () => {
    const onClick = jest.fn();
    renderComponent({ onClick });
    const { getByAltText } = screen;

    const arrow = getByAltText("Drop arrow");
    expect(arrow).toBeVisible();
  });

  it(">> Should fire `onClick` prop when clicked and component is a button", () => {
    const onClick = jest.fn();
    renderComponent({ onClick });
    const { getByText } = screen;

    const button = getByText(children);
    fireEvent.click(button);

    expect(onClick).toBeCalledTimes(1);
  });
});
