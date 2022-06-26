import React from "react";
import propTypes from "prop-types";

const NavItem = ({ children, className = "", id, onClick }) => {
  NavItem.propTypes = {
    children: propTypes.node.isRequired,
    className: propTypes.string,
    id: propTypes.string.isRequired,
    onClick: propTypes.func.isRequired
  };

  return (
    <button
      onClick={onClick}
      className={`nav-item ${className}`}
      type="button"
      id={id}
    >
      <span className="nav__text">{children}</span>
    </button>
  );
};

export default NavItem;
