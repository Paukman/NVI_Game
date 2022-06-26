import React from "react";
import { render, fireEvent } from "@testing-library/react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { windowMatchMediaMock } from "utils/TestUtils";
import DatePicker from "./DatePicker";

dayjs.extend(customParseFormat);

describe("DatePicker", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });
  it("should render the default formatted date", () => {
    const date = dayjs("01-08-2020", "MM-DD-YYYY");
    const { getByPlaceholderText } = render(<DatePicker value={date} />);
    const datePicker = getByPlaceholderText("Select date");
    expect(datePicker.value).toBe("Jan 08, 2020");
  });
  it("should render the custom formatted date", () => {
    const date = dayjs("01-08-2020", "MM-DD-YYYY");
    const { getByPlaceholderText } = render(
      <DatePicker value={date} format="MM-DD-YYYY" />
    );
    const datePicker = getByPlaceholderText("Select date");
    expect(datePicker.value).toBe("01-08-2020");
  });
  it("should be able to disabled the picker", () => {
    const date = dayjs("01-08-2020", "MM-DD-YYYY");
    const { getByPlaceholderText } = render(
      <DatePicker value={date} disabled />
    );
    const datePicker = getByPlaceholderText("Select date");
    expect(datePicker.disabled).toBe(true);
  });
  it("should be able to set error css class when error", () => {
    const date = dayjs("01-08-2020", "MM-DD-YYYY");
    const { container } = render(<DatePicker value={date} error />);
    expect(container.childNodes[0]).toHaveClass(
      "ant-picker ant-picker-error ant-picker-large"
    );
  });
  it("should be able to set custom css class", () => {
    const date = dayjs("01-08-2020", "MM-DD-YYYY");
    const { container } = render(<DatePicker value={date} className="test" />);
    expect(container.childNodes[0]).toHaveClass(
      "ant-picker test ant-picker-large"
    );
  });
  it("should be able pass attributes", () => {
    const date = dayjs("01-08-2020", "MM-DD-YYYY");
    const { getByPlaceholderText } = render(
      <DatePicker value={date} data-testid="test" />
    );

    const datePicker = getByPlaceholderText("Select date");
    expect(datePicker.hasAttribute("data-testid")).toBe(true);
  });
  it("should able to call onChange", () => {
    const onChange = jest.fn();
    const date = dayjs("01-08-2020", "MM-DD-YYYY");
    const { getByPlaceholderText } = render(
      <DatePicker value={date} onChange={onChange} />
    );
    const datePicker = getByPlaceholderText("Select date");
    fireEvent.change(datePicker, { target: { value: "Jan 08, 2020" } });
    expect(datePicker.value).toBe("Jan 08, 2020");
    expect(onChange).not.toHaveBeenCalled();
  });
  it("can pass ref", () => {
    const ref = React.createRef();
    render(<DatePicker ref={ref} />);
    expect(ref.current.pickerRef.current.props.format).toEqual("MMM DD, YYYY");
    expect(ref.current.pickerRef.current.props.onChange()).toEqual(null);
  });
  it("should render footer", () => {
    const { container } = render(<DatePicker footer />);
    expect(container.childNodes[1].className).toEqual("");
  });
});
