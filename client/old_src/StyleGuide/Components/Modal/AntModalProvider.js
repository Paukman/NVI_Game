import React, { createContext } from "react";
import PropTypes from "prop-types";
import useShowModal from "./useShowModal";

export const AntModalContext = createContext();

const AntModalProvider = ({ children }) => {
  AntModalProvider.propTypes = {
    children: PropTypes.node
  };
  const { show, close, modal, contextHolder } = useShowModal();

  return (
    <AntModalContext.Provider value={{ antModal: modal, show, close }}>
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
    </AntModalContext.Provider>
  );
};

export default AntModalProvider;
