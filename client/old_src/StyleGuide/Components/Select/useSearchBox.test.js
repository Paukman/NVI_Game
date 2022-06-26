/* eslint-disable no-unused-vars */
import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";

import { windowMatchMediaMock } from "utils/TestUtils";
import { LoadingOutlined } from "@ant-design/icons";
import useSearchBox from "./useSearchBox";

import { Search } from "../Icons";

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

describe("Testing useSearchBox", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> should handle minimum characters", async () => {
    const hook = renderHook(() =>
      useSearchBox({
        data: dataOptions,
        minCharsSearch: 3,
        SearchIcon: Search,
        LoadingIcon: LoadingOutlined
      })
    );

    const { result } = hook;
    const handleSearch = result.current[0];

    await act(async () => handleSearch(""));
    expect(result.current[2].formattedResults).toEqual([]);
    expect(result.current[2].suffixIcon).not.toEqual("");
  });

  it(">> should filter results properly", async () => {
    const hook = renderHook(() =>
      useSearchBox({
        data: dataOptions,
        minCharsSearch: 3,
        SearchIcon: Search,
        LoadingIcon: LoadingOutlined
      })
    );

    const { result } = hook;

    const handleSearch = result.current[0];

    await act(async () => handleSearch("OLD"));
    expect(result.current[2].formattedResults).toHaveLength(7);
    expect(result.current[2].suffixIcon).toEqual("");

    await act(async () => handleSearch(""));
    expect(result.current[2].formattedResults).toHaveLength(0);
    expect(result.current[2].suffixIcon).not.toEqual("");

    await act(async () => handleSearch("old"));
    expect(result.current[2].formattedResults).toHaveLength(7);
    expect(result.current[2].suffixIcon).toEqual("");

    await act(async () => handleSearch("Freddie Mercury"));
    expect(result.current[2].formattedResults).toHaveLength(0);
    expect(result.current[2].suffixIcon).not.toEqual("");
  });

  it(">> should retunr nothing if data is not available", async () => {
    const hook = renderHook(() =>
      useSearchBox({
        data: [],
        minCharsSearch: 3,
        SearchIcon: Search,
        LoadingIcon: LoadingOutlined
      })
    );

    const { result } = hook;

    const handleSearch = result.current[0];

    await act(async () => handleSearch("OLD"));
    expect(result.current[2].formattedResults).toHaveLength(0);
    expect(result.current[2].suffixIcon).not.toEqual("");
  });

  it(">> should handle selected properly", async () => {
    const hook = renderHook(() =>
      useSearchBox({
        data: dataOptions,
        minCharsSearch: 3,
        SearchIcon: Search,
        LoadingIcon: LoadingOutlined
      })
    );

    const { result } = hook;

    const handleSearch = result.current[0];
    const handleSelected = result.current[1];

    await act(async () => handleSearch("OLD"));
    expect(result.current[2].formattedResults).toHaveLength(7);
    expect(result.current[2].suffixIcon).toEqual("");

    await act(async () => handleSelected());
    expect(result.current[2].formattedResults).toHaveLength(0);
    expect(result.current[2].suffixIcon).toEqual("");
  });

  it(">> should form results properly", async () => {
    const hook = renderHook(() =>
      useSearchBox({
        data: dataOptions,
        minCharsSearch: 3,
        SearchIcon: Search,
        LoadingIcon: LoadingOutlined
      })
    );

    const { result } = hook;

    const formatResults = result.current[3];
    let formattedData;
    await act(async () => {
      formattedData = formatResults("REA", ["ONE DREAM"]);
    });
    expect(formattedData).toMatchInlineSnapshot(`
      Array [
        Object {
          "key": "ONE DREAM",
          "value": <React.Fragment>
            <span
              className="font-weight-normal"
            >
              ONE D
            </span>
            <span
              className="search-box-highlight"
            >
              REA
            </span>
            <span
              className="font-weight-normal"
            >
              M
            </span>
          </React.Fragment>,
        },
      ]
    `);
  });
});
