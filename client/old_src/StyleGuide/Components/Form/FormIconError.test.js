import React from "react";
import { render } from "@testing-library/react";
import FormIconError from "./FormIconError";

describe("FormIconError", () => {
  it("should render children", () => {
    const { getByText } = render(<FormIconError>Hello world</FormIconError>);
    const parent = getByText("Hello world");
    expect(parent.hasChildNodes()).toBe(true);
  });
  it("should render the parrent with correct class", () => {
    const { getByText } = render(<FormIconError>Text</FormIconError>);
    const parent = getByText("Text");
    expect(parent.className).toBe("error-icon-before");
  });
  it("can pass extra class", () => {
    const { getByText } = render(
      <FormIconError className="extra-class">Text</FormIconError>
    );
    const parent = getByText("Text");
    expect(parent.className).toBe("extra-class error-icon-before");
  });
  it("can pass extra attr/props", () => {
    const { getByText } = render(
      <FormIconError data-testid="test">Text</FormIconError>
    );
    const parent = getByText("Text");
    expect(parent.hasAttribute("data-testid")).toBe(true);
  });

  it("can pass ref", () => {
    const ref = React.createRef();
    render(<FormIconError ref={ref}>Text</FormIconError>);
    expect(ref.current.className).toBe("error-icon-before");
  });
});
