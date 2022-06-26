import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import InteracStatusIndicator from "./InteracStatusIndicator";

let component = null;
describe("Test InteracStatusIndicator", () => {
  beforeEach(() => {
    component = document.createElement("div");
    document.body.appendChild(component);
  });
  afterEach(() => {
    unmountComponentAtNode(component);
    component.remove();
    component = null;
  });

  it(">> Should render active", () => {
    const props = {
      interacStatus: 1
    };
    render(<InteracStatusIndicator {...props} />, component);
    const matches = component.getElementsByClassName(
      "interacStatusIndicator active"
    );
    expect(matches[0]).not.toBeUndefined();
  });

  it(">> Should render pending", () => {
    const props = {
      interacStatus: 0
    };
    render(<InteracStatusIndicator {...props} />, component);
    const matches = component.getElementsByClassName(
      "interacStatusIndicator pending"
    );
    expect(matches[0]).not.toBeUndefined();
  });
});
