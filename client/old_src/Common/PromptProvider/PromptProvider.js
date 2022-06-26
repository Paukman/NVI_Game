import React, { createContext } from "react";
import PropTypes from "prop-types";
import usePrompt from "./usePrompt";

export const PromptContext = createContext();

const PromptProvider = props => {
  const {
    blockLocation,
    blockClosingBrowser,
    onCommit,
    nextLocation,
    promptState,
    onCancel
  } = usePrompt();
  PromptProvider.propTypes = {
    children: PropTypes.node.isRequired
  };
  const { children } = props;

  return (
    <PromptContext.Provider
      value={{
        promptState,
        onCommit,
        blockLocation,
        blockClosingBrowser,
        nextLocation,
        onCancel
      }}
    >
      {children}
    </PromptContext.Provider>
  );
};

export default PromptProvider;
