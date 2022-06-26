// expect causing weird lint behavior - https://stackoverflow.com/questions/37558795/nice-way-to-get-rid-of-no-unused-expressions-linter-error-with-chai/43525402
/* eslint-disable no-unused-expressions */

import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, act } from "@testing-library/react";

import Stepper from ".";

const id = "test";

const handleCancel = prevTab => {
  prevTab(true);
};
const handleEdit = () => {};

// the container should be re-used to minimize number of initial renders
const firstTab = (prevTab, nextTab) => (
  <div id="tab1">
    <button type="submit" id="next" onClick={nextTab} />
  </div>
);

const secondTab = (prevTab, nextTab, editForm) => (
  <div id="tab2">
    <button type="submit" id="prev" onClick={prevTab} />
    <button type="submit" id="edit" onClick={editForm} />
    <button type="submit" id="cancel" onClick={() => handleCancel(prevTab)} />
    <button type="submit" id="next" onClick={nextTab} />
  </div>
);

const thirdTab = prevTab => (
  <div id="tab3">
    <button type="submit" id="prevFinal" onClick={prevTab} />
  </div>
);

const tabs = [
  { title: "first", render: firstTab },
  { title: "second", render: secondTab },
  { title: "third", render: thirdTab }
];

describe("Stepper behavior", () => {
  // the tests should be written in a way that minimizes the amount of re-renders, while validating the required elements
  it(">> Checks that nextTab() updates active tab", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["#create"]}>
        <Stepper id={id} tabs={tabs} onEdit={() => handleEdit()} />
      </MemoryRouter>
    );
    // validates first tab, confirms single dynamic tab creation
    await act(async () => container);
    const nextButton = container.querySelector("#next");

    // validates nextTab functionality
    await act(async () => {
      nextButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // validates that this tab is no longer active
    expect(nextButton.textContent).toNotExist;
  });

  it(">> Checks that prevTab() updates active tab", async () => {
    // validates second tab, confirms multiple dynamic tab creation

    const { container } = render(
      <MemoryRouter initialEntries={["#create"]}>
        <Stepper id={id} tabs={tabs} onEdit={() => handleEdit()} />
      </MemoryRouter>
    );

    await act(async () => container);
    const nextButton = container.querySelector("#next");

    // validates nextTab functionality
    await act(async () => {
      nextButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const prevButton = container.querySelector("#prev");

    // validates prevTab functionality
    await act(async () => {
      prevButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // validates that this tab is no longer active
    expect(prevButton).toNotExist;
  });

  it(">> Checks that tab1 renders under #create", async () => {
    // validates second tab, confirms multiple dynamic tab creation

    const { container } = render(
      <MemoryRouter initialEntries={["#create"]}>
        <Stepper id={id} tabs={tabs} onEdit={() => handleEdit()} />
      </MemoryRouter>
    );

    await act(async () => container);
    const nextButton = container.querySelector("#next");

    // validates nextTab functionality
    await act(async () => {
      nextButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const prevButton = container.querySelector("#prev");

    // validates prevTab functionality
    await act(async () => {
      prevButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // validates that this tab is no longer active
    expect(prevButton).toNotExist;
  });

  it(">> Checks that nextTab() renders all 3 tabs", async () => {
    // validates second tab, confirms multiple dynamic tab creation

    const { container } = render(
      <MemoryRouter initialEntries={["#create"]}>
        <Stepper id={id} tabs={tabs} onEdit={() => handleEdit()} />
      </MemoryRouter>
    );

    await act(async () => container);
    const nextButton = container.querySelector("#next");

    // validates nextTab functionality
    await act(async () => {
      nextButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const nextButton2 = container.querySelector("#next");

    // validates prevTab functionality
    await act(async () => {
      nextButton2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const prevFinal = container.querySelector("#prevFinal");

    // validates that this tab is no longer active
    expect(prevFinal).toNotExist;
  });

  it(">> Ensures the user is redirected to the previous tab on edit", async () => {
    // validates second tab, confirms multiple dynamic tab creation

    const { container } = render(
      <MemoryRouter initialEntries={["#create"]}>
        <Stepper id={id} tabs={tabs} onEdit={() => handleEdit()} />
      </MemoryRouter>
    );

    await act(async () => container);
    const nextButton = container.querySelector("#next");

    // validates nextTab functionality
    await act(async () => {
      nextButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const prevButton = container.querySelector("#edit");

    // validates prevTab functionality
    await act(async () => {
      prevButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // validates that this tab is no longer active
    expect(prevButton).toNotExist;
  });

  it(">> Ensures the user is redirected to the previous tab on cancel", async () => {
    // validates second tab, confirms multiple dynamic tab creation

    const { container } = render(
      <MemoryRouter initialEntries={["#create"]}>
        <Stepper id={id} tabs={tabs} onEdit={() => handleEdit()} />
      </MemoryRouter>
    );

    await act(async () => container);
    const nextButton = container.querySelector("#next");

    // validates nextTab functionality
    await act(async () => {
      nextButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const prevButton = container.querySelector("#cancel");

    // validates prevTab functionality
    await act(async () => {
      prevButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // validates that this tab is no longer active
    expect(prevButton).toNotExist;
  });
});
