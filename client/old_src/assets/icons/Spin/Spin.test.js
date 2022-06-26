import React from "react";
import { render } from "@testing-library/react";
import Spin from "./index";

describe("Spin", () => {
  it("should render spin markup", () => {
    const { getByTestId } = render(
      <Spin data-testid="spin" className="extra class" />
    );
    const div = getByTestId("spin");
    expect(div.className).toEqual("extra class");
  });
});
