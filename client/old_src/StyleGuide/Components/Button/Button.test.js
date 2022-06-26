import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { getNodeText } from "@testing-library/dom";
import Button from "./Button";

describe("Button", () => {
  it("should render children", () => {
    const { getByText } = render(<Button>Hello world</Button>);
    const button = getByText("Hello world");
    expect(button.hasChildNodes()).toBe(true);
    const text = getNodeText(button);
    expect(text).toBe("Hello world");
  });
  it("should render buttons with shape", () => {
    const { getByText } = render(<Button primary>Default Button</Button>);
    const button = getByText("Default Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-primary ant-btn-round ant-btn-lg"
    );
  });
  it("should render block", () => {
    const { getByText } = render(
      <Button block primary>
        Primary Button
      </Button>
    );
    const button = getByText("Primary Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-primary ant-btn-round ant-btn-lg ant-btn-block"
    );
  });
  it("should render primary button", () => {
    const { getByText } = render(<Button primary>Primary Button</Button>);
    const button = getByText("Primary Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-primary ant-btn-round ant-btn-lg"
    );
  });
  it("should render secondary button", () => {
    const { getByText } = render(<Button secondary>Button</Button>);
    const button = getByText("Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-secondary ant-btn-round ant-btn-lg"
    );
  });
  it("should render text button", () => {
    const { getByText } = render(<Button text>Text Button</Button>);
    const button = getByText("Text Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-text ant-btn-round ant-btn-lg"
    );
  });
  it("should render default link button", () => {
    const { getByText } = render(<Button link>Link Button</Button>);
    const button = getByText("Link Button");
    expect(button.parentElement).toHaveClass("ant-btn md-link ant-btn-link");
  });
  it("should render small link button", () => {
    const { getByText } = render(
      <Button size="sm-link" link>
        Link Button
      </Button>
    );
    const button = getByText("Link Button");
    expect(button.parentElement).toHaveClass("ant-btn sm-link ant-btn-link");
  });
  it("should render large link button", () => {
    const { getByText } = render(
      <Button size="lg-link" link>
        Link Button
      </Button>
    );
    const button = getByText("Link Button");
    expect(button.parentElement).toHaveClass("ant-btn lg-link ant-btn-link");
  });
  it("should render round by default", () => {
    const { getByText } = render(<Button>Button</Button>);
    const button = getByText("Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-round ant-btn-lg"
    );
  });
  it("should render square shape", () => {
    const { getByText } = render(<Button square>Button</Button>);
    const button = getByText("Button");
    expect(button.parentElement).toHaveClass("ant-btn ant-btn-lg");
  });
  it("should render circle shape", () => {
    const { getByText } = render(<Button circle>Button</Button>);
    const button = getByText("Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-circle ant-btn-lg"
    );
  });
  it("should render size prop", () => {
    const { getByText } = render(<Button size="large">Button</Button>);
    const button = getByText("Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-round ant-btn-lg"
    );
  });
  it("can add attributes", () => {
    const { getByText } = render(<Button data-testid="test">Button</Button>);
    const button = getByText("Button");
    expect(button.parentElement.hasAttribute("data-testid")).toBe(true);
  });
  it("should render additional class names", () => {
    const { getByText } = render(<Button className="extra">Button</Button>);
    const button = getByText("Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn extra ant-btn-round ant-btn-lg"
    );
  });
  it("calls props.onClick if it exists", () => {
    const onClick = jest.fn();
    const { container, getByText } = render(
      <Button onClick={onClick}>Testing Click</Button>
    );
    fireEvent.click(getByText("Testing Click"), container);
    expect(onClick).toHaveBeenCalled();
  });
  it("click is not called when disabled", () => {
    const onClick = jest.fn();
    const { container, getByText } = render(
      <Button disabled>Testing Click</Button>
    );
    fireEvent.click(getByText("Testing Click"), container);
    expect(onClick).not.toHaveBeenCalled();
  });
  it("click is not called when loading", () => {
    const onClick = jest.fn();
    const { container, getByTestId } = render(
      <Button loading data-testid="test">
        Testing Click
      </Button>
    );
    fireEvent.click(getByTestId("test"), container);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("should render primary unclickable button", () => {
    const { getByText } = render(
      <Button unclickable primary>
        Primary Button
      </Button>
    );
    const button = getByText("Primary Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-primary-unclickable ant-btn-primary ant-btn-round ant-btn-lg"
    );
  });
  it("should render secondary unclickable button", () => {
    const { getByText } = render(
      <Button unclickable secondary>
        Button
      </Button>
    );
    const button = getByText("Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-secondary ant-btn-secondary-unclickable ant-btn-round ant-btn-lg"
    );
  });
  it("should render text unclickable button ", () => {
    const { getByText } = render(
      <Button unclickable text>
        Text Button
      </Button>
    );
    const button = getByText("Text Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn ant-btn-text-unclickable ant-btn-text ant-btn-round ant-btn-lg"
    );
  });
  it("should render default link unclickable button", () => {
    const { getByText } = render(
      <Button unclickable link>
        Link Button
      </Button>
    );
    const button = getByText("Link Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn md-link ant-btn-link-unclickable ant-btn-link"
    );
  });
  it("should render small link unclickable button", () => {
    const { getByText } = render(
      <Button unclickable size="sm-link" link>
        Link Button
      </Button>
    );
    const button = getByText("Link Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn sm-link ant-btn-link-unclickable ant-btn-link"
    );
  });
  it("should render large link button unclickable", () => {
    const { getByText } = render(
      <Button unclickable size="lg-link" link>
        Link Button
      </Button>
    );
    const button = getByText("Link Button");
    expect(button.parentElement).toHaveClass(
      "ant-btn lg-link ant-btn-link-unclickable ant-btn-link"
    );
  });
  it("click is not called when is unclickable", () => {
    const onClick = jest.fn();
    const { container, getByTestId } = render(
      <Button unclickable data-testid="test">
        Testing Click
      </Button>
    );
    fireEvent.click(getByTestId("test"), container);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("can pass ref", () => {
    const ref = React.createRef();
    const spy = jest.fn();
    ref.current = "hello";
    render(
      <Button ref={ref} onClick={spy}>
        Button
      </Button>
    );
    fireEvent.click(ref.current);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
