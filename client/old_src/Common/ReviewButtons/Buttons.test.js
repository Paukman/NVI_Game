import React from "react";
import { render, act, fireEvent } from "@testing-library/react";
import Buttons from "Common/ReviewButtons/index";

describe("ReviewButtons Tests", () => {
  const id = "button-container";
  const response = { isLoading: false };

  it(">> verify cancel button's functionality", async () => {
    const prevTab = jest.fn();
    const editButton = jest.fn();
    const handleSubmit = jest.fn();
    const { container } = render(
      <Buttons
        id={id}
        type="review"
        response={response}
        prevTab={prevTab}
        editButton={editButton}
        handleSubmit={handleSubmit}
      />
    );

    const prevButton = container.querySelector(".text-button button span");

    await act(async () => {
      fireEvent.click(prevButton);
    });

    expect(prevTab).toHaveBeenCalledTimes(1);
  });

  it(">> verify edit button's functionality", async () => {
    const prevTab = jest.fn();
    const editButton = jest.fn();
    const handleSubmit = jest.fn();
    const { container } = render(
      <Buttons
        id={id}
        type="review"
        response={response}
        prevTab={prevTab}
        editButton={editButton}
        handleSubmit={handleSubmit}
      />
    );

    const edit = container.querySelector(".bordered-button button span");

    await act(async () => {
      fireEvent.click(edit);
    });

    expect(editButton).toHaveBeenCalledTimes(1);
  });

  it(">> verify send button's functionality", async () => {
    const prevTab = jest.fn();
    const editButton = jest.fn();
    const handleSubmit = jest.fn();
    const { container } = render(
      <Buttons
        id={id}
        type="review"
        response={response}
        prevTab={prevTab}
        editButton={editButton}
        handleSubmit={handleSubmit}
      />
    );

    const sendButton = container.querySelector(".primary-button button span");

    await act(async () => {
      fireEvent.click(sendButton);
    });

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it(">> verify send another transfer button's functionality", async () => {
    const prevTab = jest.fn();
    const editButton = jest.fn();
    const handleSubmit = jest.fn();
    const { container } = render(
      <Buttons
        id={id}
        type="complete"
        response={response}
        prevTab={prevTab}
        editButton={editButton}
        handleSubmit={handleSubmit}
      />
    );

    const prevButton = container.querySelector(
      "#button-container-send-another-transfer"
    );

    await act(async () => {
      fireEvent.click(prevButton);
    });

    expect(prevTab).toHaveBeenCalledTimes(1);
  });
});
