import { useState } from "react";

const useCounter = ({ maxChars, form, fieldName, helperText, updateText }) => {
  const [text, setText] = useState("");
  const updateCounter = message => {
    if (!message) {
      return;
    }
    const messageLength = message.length;
    form.setFieldsValue({
      [fieldName]: `${messageLength}/${maxChars}`
    });
    if (messageLength >= maxChars) {
      setText(helperText);
      updateText(helperText);
    } else {
      setText("");
      updateText("");
    }
  };

  return [updateCounter, text];
};

export default useCounter;
