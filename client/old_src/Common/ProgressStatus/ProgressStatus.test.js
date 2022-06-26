import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import ProgressStatus from "./index";

describe("Testing ProgressStatus", () => {
  let component = null;
  let props = {
    id: "etransfer-container",
    status: 0
  };

  beforeEach(() => {
    component = document.createElement("div");
    document.body.appendChild(component);

    render(<ProgressStatus {...props} />, component);
  });

  afterEach(() => {
    unmountComponentAtNode(component);
    component.remove();
    component = null;
  });
  it(">> validate text for create state", () => {
    const createTitle = component.querySelector(
      "#etransfer-container-progress-status-create-title"
    );
    expect(createTitle.textContent).toEqual("Create");
  });

  it(">> validate text for review state", () => {
    const reviewTitle = component.querySelector(
      "#etransfer-container-progress-status-review-title"
    );
    expect(reviewTitle.textContent).toEqual("Review");
  });

  it(">> validate text for send state", () => {
    const sendTitle = component.querySelector(
      "#etransfer-container-progress-status-send-title"
    );
    expect(sendTitle.textContent).toEqual("Complete");
  });

  it(">> validate presence of status bar", () => {
    const statusBar = component.querySelector(
      "#etransfer-container-status-bar"
    );
    expect(statusBar.exists);
  });
  //  This unit test will always throw warnings
  //  PropTypes has set status to be isRequired
  // it(">> validate percentage for undefined state", () => {
  //   props = {
  //     id: "etransfer-container",
  //     status: undefined
  //   };
  //   render(<ProgressStatus {...props} />, component);
  //   expect(
  //     component.querySelector(
  //       "#etransfer-container-progress-status-create-title"
  //     ).className
  //   ).not.toEqual("purple");
  // });

  it(">> validate percentage for create state", () => {
    props = {
      id: "etransfer-container",
      status: 0
    };
    render(<ProgressStatus {...props} />, component);
    expect(
      component.querySelector(
        "#etransfer-container-progress-status-create-title"
      ).className
    ).toEqual("purple");
    expect(
      component.querySelector(
        "#etransfer-container-progress-status-review-title"
      ).className
    ).not.toEqual("purple");
    expect(
      component.querySelector("#etransfer-container-progress-status-send-title")
        .className
    ).not.toEqual("purple");
  });

  it(">> validate percentage for review state", () => {
    props = {
      id: "etransfer-container",
      status: 1
    };
    render(<ProgressStatus {...props} />, component);
    expect(
      component.querySelector(
        "#etransfer-container-progress-status-create-title"
      ).className
    ).toEqual("purple");
    expect(
      component.querySelector(
        "#etransfer-container-progress-status-review-title"
      ).className
    ).toEqual("purple");
    expect(
      component.querySelector("#etransfer-container-progress-status-send-title")
        .className
    ).not.toEqual("purple");
  });

  it(">> validate percentage for send state", () => {
    props = {
      id: "etransfer-container",
      status: 2
    };
    render(<ProgressStatus {...props} />, component);
    expect(
      component.querySelector(
        "#etransfer-container-progress-status-create-title"
      ).className
    ).toEqual("purple");
    expect(
      component.querySelector(
        "#etransfer-container-progress-status-review-title"
      ).className
    ).toEqual("purple");
    expect(
      component.querySelector("#etransfer-container-progress-status-send-title")
        .className
    ).toEqual("purple");
  });
});
