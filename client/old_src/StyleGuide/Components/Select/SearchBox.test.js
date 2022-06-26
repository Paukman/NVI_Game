import React from "react";
import { act, render } from "@testing-library/react";
import { getNodeText } from "@testing-library/dom";
import { Select as AntSelect } from "antd";
import SearchBox from "./SearchBox";

const { Option } = AntSelect;

export const dataOptions = [
  "12 MILE STORAGE",
  "123 TREE PLANTING",
  "18 WHEELER PARTS N SERVICE LTD",
  "1ST CHOICE TRUCK AND CAR WASH",
  "3225941 MANITOBA LTD",
  "361025 ALBERTA LTD",
  "39 NIAGARA RENTALS",
  "3T SYSTEMS LTD",
  "4 REFUEL CANADA LP",
  "4/15/2020",
  "411 CA",
  "OKANAGAN FALLS IRRIGATION DISTRICT",
  "OKANAGAN RESIDENT PLUS PHARMACY ORPP",
  "OKANAGAN TREE FRUIT COOPERATIVE",
  "OKOTOKS HOME HARDWARE BUILDING CENTRE",
  "OLD DUTCH FOODS ATLANTIC",
  "OLD DUTCH FOODS ONTARIO QUEBEC",
  "OLD DUTCH WEST",
  "OLD OAK PROPERTIES INC",
  "OLD VICTORIA WATER COMPANY",
  "OLDFIELD KIRBY ESAU INC",
  "OLDS COLLEGE"
];

describe("Select", () => {
  it("should render children", () => {
    const { getByText } = render(
      <SearchBox>
        <Option value="1">1</Option>
      </SearchBox>
    );
    const placeholder = getByText("Enter payee");
    expect(placeholder.hasChildNodes()).toBe(true);
    const text = getNodeText(placeholder);
    expect(text).toBe("Enter payee");
  });

  it("should be able to add attributes", () => {
    const { getByText } = render(
      <SearchBox data={dataOptions} data-testid="test" />
    );
    const placeholder = getByText("Enter payee");
    expect(
      placeholder.parentElement.parentElement.hasAttribute("data-testid")
    ).toBe(true);
  });

  it("should render additional class names", () => {
    const { getByText } = render(<SearchBox className="extra" />);
    const placeholder = getByText("Enter payee");
    expect(placeholder.parentElement.parentElement).toHaveClass(
      "ant-select ant-select-lg extra block ant-select-single ant-select-show-arrow ant-select-show-search"
    );
  });

  it("should handle search and show options", async () => {
    const { getAllByText, getByRole } = render(
      <SearchBox data={dataOptions} data-testid="test" />
    );
    const select = await getByRole("combobox");
    await act(async () => {
      fireEvent.mouseDown(select);
      fireEvent.change(select, {
        target: { value: "OLD" }
      });
    });
    const selection = getAllByText("OLD");
    expect(selection).toHaveLength(7);
  });
});
