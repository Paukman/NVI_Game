import React from "react";
import { getNodeText } from "@testing-library/dom";
import CalendarIcon from "./CalendarIcon";

describe("CalendarIcon", () => {
  it("should render children", () => {
    const { getByText } = render(<CalendarIcon>Hello world</CalendarIcon>);
    const iconHolder = getByText("Hello world");
    expect(iconHolder.hasChildNodes()).toBe(true);
    const text = getNodeText(iconHolder);
    expect(text).toBe("Hello world");
  });
  it("should render default classes", () => {
    const { getByText } = render(<CalendarIcon>Default Icon</CalendarIcon>);
    const container = getByText("Default Icon");
    expect(container.parentElement.className).toBe("date-picker-icon-grid");
    expect(container.parentElement.children["0"].className).toBe(
      "date-picker-icon-grid-icon"
    );
    expect(container.className).toBe("date-picker-icon-grid-picker");
  });
  it("should add extra classes", () => {
    const { getByText } = render(
      <CalendarIcon
        classNameGrid="one"
        classNameIcon="two"
        classNamePicker="three"
      >
        Icon
      </CalendarIcon>
    );
    const container = getByText("Icon");
    expect(container.parentElement.className).toBe("date-picker-icon-grid one");
    expect(container.parentElement.children["0"].className).toBe(
      "date-picker-icon-grid-icon two"
    );
    expect(container.className).toBe("date-picker-icon-grid-picker three");
  });
});
