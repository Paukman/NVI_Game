// default props will be depricated with the use of es6 defaults
/* eslint-disable react/require-default-props */
import React, { createContext } from "react";
import PropTypes from "prop-types";
import useShowMessage from "./useShowMessage";

export const MessageContext = createContext();

const MessageProvider = ({ children }) => {
  MessageProvider.propTypes = {
    children: PropTypes.node
  };
  const { show, close, api, contextHolder } = useShowMessage();

  return (
    <MessageContext.Provider value={{ messageAPI: api, show, close }}>
      {children}
      <div
        role="button"
        tabIndex="0"
        className="outline-none"
        onKeyPress={close}
        onClick={close}
      >
        {contextHolder}
      </div>
    </MessageContext.Provider>
  );
};

export default MessageProvider;
