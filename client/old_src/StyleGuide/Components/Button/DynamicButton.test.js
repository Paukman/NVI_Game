import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import { windowMatchMediaMock } from "utils/TestUtils";
import * as useResponsive from "utils/hooks/useResponsive";
import DynamicButton from "./DynamicButton";

const mockedUseResponsive = jest.spyOn(useResponsive, "default");

let screenSize;

const setScreenSize = size => {
  screenSize = {
    isXS: size === "xs",
    isSM: size === "sm",
    isMD: size === "md",
    isLG: size === "lg",
    isXL: size === "xl",
    isXXL: size === "xxl"
  };
};

const screenIsAtMost = () =>
  screenSize.isXS || screenSize.isSM || screenSize.isMD;

describe("DynamicButton", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> Should render children", async () => {
    await act(async () =>
      render(<DynamicButton>My button text</DynamicButton>)
    );
    const { getByText } = screen;

    expect(getByText("My button text")).toBeVisible();
  });

  it(">> Should render an icon when passed", async () => {
    await act(async () =>
      render(
        <DynamicButton icon={<span data-testid="mock-icon" />}>
          My button text
        </DynamicButton>
      )
    );
    const { getByTestId } = screen;
    expect(getByTestId("mock-icon")).toBeVisible();
  });

  it(">> Should display a spinner with no children or icon when loading", async () => {
    await act(async () =>
      render(
        <DynamicButton loading icon={<span data-testid="mock-icon" />}>
          My loading button
        </DynamicButton>
      )
    );
    const { getByText, getByTestId } = screen;

    const spinner = getByTestId("dynamic-button-spinner");
    const text = getByText("My loading button");
    const iconWrapper = getByTestId("mock-icon").parentElement;

    expect(spinner).toBeVisible();
    expect(text).toHaveClass("dynamic-button--hidden");
    expect(iconWrapper).toHaveClass(
      "dynamic-button__icon dynamic-button--hidden"
    );
  });

  it(">> Should render block if block prop is true", async () => {
    await act(async () =>
      render(<DynamicButton block>My block button</DynamicButton>)
    );
    const { getByText } = screen;

    const button = getByText("My block button");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-block dynamic-button"
    );
  });

  it(">> Should render block button if screen width is less than blockBreakpoint", async () => {
    setScreenSize("sm");
    mockedUseResponsive.mockReturnValue({ screenIsAtMost });

    await act(async () =>
      render(
        <DynamicButton blockBreakpoint="md">My block button</DynamicButton>
      )
    );
    const { getByText } = screen;

    const button = getByText("My block button");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-block dynamic-button"
    );
  });

  it(">> Should render block button if screen width is the same as blockBreakpoint", async () => {
    setScreenSize("md");
    mockedUseResponsive.mockReturnValue({ screenIsAtMost });

    await act(async () =>
      render(
        <DynamicButton blockBreakpoint="md">My block button</DynamicButton>
      )
    );
    const { getByText } = screen;

    const button = getByText("My block button");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-block dynamic-button"
    );
  });

  it(">> Should render inline button if screen width larger than blockBreakpoint", async () => {
    setScreenSize("lg");
    mockedUseResponsive.mockReturnValue({ screenIsAtMost });
    await act(async () =>
      render(
        <DynamicButton blockBreakpoint="md">My block button</DynamicButton>
      )
    );
    const { getByText } = screen;

    const button = getByText("My block button");
    expect(button.parentElement).not.toHaveClass("ant-btn-block");
  });

  it(">> Should render additional class names", async () => {
    await act(async () =>
      render(
        <DynamicButton block className="new-extra-test-class">
          My extra class
        </DynamicButton>
      )
    );
    const { getByText } = screen;

    const button = getByText("My extra class");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-block dynamic-button new-extra-test-class"
    );
  });

  it(">> Should accept a ref", async () => {
    const ref = React.createRef();
    const spy = jest.fn();
    ref.current = "hello";
    await act(async () =>
      render(
        <DynamicButton ref={ref} onClick={spy}>
          Button
        </DynamicButton>
      )
    );
    fireEvent.click(ref.current);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
