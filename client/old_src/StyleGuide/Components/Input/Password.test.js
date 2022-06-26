import React from "react";
import { render } from "@testing-library/react";
import Password from "./Password";

describe("Password", () => {
  it("should with default large class", () => {
    const { getByTestId } = render(<Password data-testid="test" />);
    const parent = getByTestId("test");
    expect(parent.className).toBe("ant-input ant-input-lg");
  });

  it("can pass extra class", () => {
    const { getByTestId } = render(
      <Password data-testid="test" className="extra" />
    );
    const parent = getByTestId("test");
    expect(parent.parentElement.className).toContain("extra");
  });
  it("can pass extra attr/props", () => {
    const { getByTestId } = render(<Password data-testid="test" />);
    const parent = getByTestId("test");
    expect(parent.hasAttribute("data-testid")).toBe(true);
  });
  it("can pass ref", () => {
    const ref = React.createRef();
    render(<Password ref={ref} />);
    expect(ref.current.props).toMatchObject({
      allowClear: true,
      size: "large",
      className: "ant-input-password lg-close-circle ant-input-password-large",
      type: "password"
    });
  });
});
