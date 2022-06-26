import React, { Fragment } from "react";
import { render, fireEvent } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import AlertModal from "./AlertModal2";

const renderTemp = () => {
  return <Fragment>Error Message</Fragment>;
};
const id = "etransfer";
const alertMessage = {
  title: "Error Title",
  errorMessage: renderTemp(),
  id: "test",
  buttons: [
    { buttonName: "Cancel", url: "" },
    { buttonName: "Create profile", url: "/abc" }
  ]
};

describe("Testing Alert Modal 2", () => {
  it(">> it should display elements", () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <AlertModal
          id={id}
          alertMessage={alertMessage}
          isShowing
          setIsShowing={() => {}}
        />
      </Router>,
      document.body
    );

    expect(
      document.body.querySelector("#etransfer-modal-test-title").textContent
    ).toEqual("Error Title");
    expect(
      document.body.querySelector("#etransfer-modal-test-error-message")
        .textContent
    ).toEqual("Error Message");
    expect(
      document.body.querySelector("#etransfer-modal-test-button-0").textContent
    ).toEqual("Cancel");
    expect(
      document.body.querySelector("#etransfer-modal-test-button-0")
        .getAttributeNames
    ).not.toContain("href");
    expect(
      document.body.querySelector("#etransfer-modal-test-button-1").textContent
    ).toEqual("Create profile");
    expect(
      document.body
        .querySelector("#etransfer-modal-test-button-1")
        .getAttribute("href")
    ).toEqual("/abc");
  });

  it(">> test onclick event for button with url", () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <AlertModal
          id={id}
          alertMessage={alertMessage}
          isShowing
          setIsShowing={() => {}}
        />
      </Router>,
      document.body
    );

    fireEvent.click(
      document.body.querySelector("#etransfer-modal-test-button-1")
    );

    expect(history.location.pathname).toBe("/abc");
  });
});
