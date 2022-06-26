import React from "react";
import { render } from "@testing-library/react";
import Input from "./Input";

describe("Input", () => {
  it("should with default large class", () => {
    const { getByTestId } = render(<Input data-testid="test" />);
    const parent = getByTestId("test");
    expect(parent.className).toBe("ant-input ant-input-lg");
  });
  it("should render with static input class", () => {
    const { getByTestId } = render(<Input data-testid="test" staticInput />);
    const parent = getByTestId("test");
    expect(parent.className).toBe("ant-input ant-input-lg ant-static-input");
  });
  it("can pass extra class", () => {
    const { getByTestId } = render(
      <Input data-testid="test" staticInput className="extra" />
    );
    const parent = getByTestId("test");
    expect(parent.className).toBe(
      "ant-input ant-input-lg extra ant-static-input"
    );
  });
  it("can pass extra attr/props", () => {
    const { getByTestId } = render(<Input data-testid="test" />);
    const parent = getByTestId("test");
    expect(parent.hasAttribute("data-testid")).toBe(true);
  });
  it("can pass ref", () => {
    const ref = React.createRef();
    render(<Input ref={ref} />);
    expect(ref.current.props).toMatchObject({
      allowClear: true,
      size: "large",
      className: "lg-close-circle",
      type: "text"
    });
  });
});
