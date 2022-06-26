/* eslint-disable react/prop-types */
import React from "react";
import { Input } from "antd";
import useCounter from "./useCounter";

const { TextArea } = Input;

const TextAreaWithCounter = ({
  updateText = () => null,
  rows = 4,
  maxLength = 400,
  classNameCountMemo = "font-size-16 resize-none",
  fieldName = "count",
  helperText = "Max character count reached.",
  form,
  onChange = () => null,
  ...attributes
}) => {
  const [updateCounter] = useCounter({
    maxChars: maxLength,
    form,
    fieldName,
    helperText,
    updateText
  });

  const handleOnChange = e => {
    updateCounter(e.target.value);
    onChange(e);
  };

  return (
    <>
      <TextArea
        {...attributes}
        rows={rows}
        maxLength={maxLength}
        style={{
          lineHeight: "24px",
          padding: "7px 9px"
        }}
        className={classNameCountMemo}
        onChange={handleOnChange}
      />
    </>
  );
};
export default TextAreaWithCounter;
