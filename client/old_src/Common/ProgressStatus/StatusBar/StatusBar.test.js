import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import StatusBar from "./index";

describe("Testing ProgressStatus", () => {
  let component = null;
  let props = {
    id: "etransfer-container-status-bar",
    percentage: 33.33
  };

  beforeEach(() => {
    component = document.createElement("div");
    document.body.appendChild(component);

    render(<StatusBar {...props} />, component);
  });

  afterEach(() => {
    unmountComponentAtNode(component);
    component.remove();
    component = null;
  });
  it(">> validate percentage for send state", () => {
    props = {
      id: "etransfer-container-status-bar",
      percentage: 100
    };
    render(<StatusBar {...props} />, component);
    expect(
      component.querySelector("#etransfer-container-status-bar-filler")
        .className
    ).toEqual("filler complete");
  });

  it(">> validate percentage for send state", () => {
    props = {
      id: "etransfer-container-status-bar",
      percentage: 100
    };
    render(<StatusBar {...props} />, component);
    expect(
      component.querySelector("#etransfer-container-status-bar-filler")
        .className
    ).toEqual("filler complete");
  });
});
