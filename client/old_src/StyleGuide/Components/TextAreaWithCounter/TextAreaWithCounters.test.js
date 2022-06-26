import React from "react";
import { render, fireEvent } from "@testing-library/react";
import TextAreaWithCounter from "./TextAreaWithCounter";

describe("TextAreaWithCounter", () => {
  it("should render TextAreaWithCounter with attribute", () => {
    const { getByText } = render(
      <TextAreaWithCounter defaultValue="defaultValue" />
    );
    expect(getByText("defaultValue")).toBeTruthy();
  });

  it("should call onChange", () => {
    const form = {
      setFieldsValue: jest.fn()
    };
    const onChange = jest.fn();
    const updateText = jest.fn();
    const { getByText } = render(
      <TextAreaWithCounter
        form={form}
        onChange={onChange}
        defaultValue="defaultValue"
        updateText={updateText}
      />
    );
    expect(onChange).toBeCalledTimes(0);
    const textArea = getByText("defaultValue");
    fireEvent.change(textArea, {
      target: { value: "123" }
    });
    expect(onChange).toBeCalledTimes(1);
  });

  it("should call updateText", () => {
    const form = {
      setFieldsValue: jest.fn()
    };
    const updateText = jest.fn();
    const { getByText } = render(
      <TextAreaWithCounter
        maxLength={15}
        form={form}
        defaultValue="defaultValue"
        updateText={updateText}
      />
    );
    expect(updateText).toBeCalledTimes(0);
    let textArea = getByText("defaultValue");
    fireEvent.change(textArea, {
      target: { value: "123" }
    });
    expect(updateText).toBeCalledWith("");
    textArea = getByText("123");
    fireEvent.change(textArea, {
      target: { value: "123456789012345" }
    });
    expect(updateText).toBeCalledWith("Max character count reached.");
  });
});
