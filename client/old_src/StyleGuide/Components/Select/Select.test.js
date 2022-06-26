import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { getNodeText } from "@testing-library/dom";
import { Select as AntSelect } from "antd";
import Select from "./Select";

const { Option } = AntSelect;

const options = [
  { value: "No-Fee All-In Account (7679) - $89,499.46" },
  { value: "Springboard Savings Account (1479) - $39,593.01" },
  { value: "Simple" }
];

describe("Select", () => {
  it("should render children", async () => {
    await act(async () => {
      render(
        <Select>
          <Option value="1">1</Option>
        </Select>
      );
    });
    const { getByText } = screen;
    const placeholder = getByText("Please select");
    expect(placeholder.hasChildNodes()).toBe(true);
    const text = getNodeText(placeholder);
    expect(text).toBe("Please select");
  });

  it("should render options with options attribute", async () => {
    const { getByText, container } = render(<Select options={options} />);
    await act(async () => {
      fireEvent.mouseDown(getByText("Please select"), container);
    });
    expect(getByText("Simple")).toBeTruthy();
  });

  it("should render block as true by default", () => {
    const { getByText } = render(<Select options={options} />);
    const placeholder = getByText("Please select");
    expect(placeholder.parentElement.parentElement).toHaveClass(
      "ant-select ant-select-lg block ant-select-single ant-select-show-arrow ant-select-show-search"
    );
  });

  it("should render size prop large by default", () => {
    const { getByText } = render(<Select options={options} />);
    const placeholder = getByText("Please select");
    expect(placeholder.parentElement.parentElement).toHaveClass(
      "ant-select ant-select-lg block ant-select-single ant-select-show-arrow ant-select-show-search"
    );
  });

  it("should be able to add attributes", () => {
    const { getByText } = render(
      <Select options={options} data-testid="test" />
    );
    const placeholder = getByText("Please select");
    expect(
      placeholder.parentElement.parentElement.hasAttribute("data-testid")
    ).toBe(true);
  });

  it("should render additional class names", () => {
    const { getByText } = render(<Select className="extra" />);
    const placeholder = getByText("Please select");
    expect(placeholder.parentElement.parentElement).toHaveClass(
      "ant-select ant-select-lg extra block ant-select-single ant-select-show-arrow ant-select-show-search"
    );
  });

  it("should pass ref", async () => {
    const ref = React.createRef();
    const spy = jest.fn();
    ref.current = "hello";
    const { getByText, container } = render(
      <Select ref={ref} onDropdownVisibleChange={spy} />
    );
    await act(async () => {
      fireEvent.mouseDown(getByText("Please select"), container);
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
