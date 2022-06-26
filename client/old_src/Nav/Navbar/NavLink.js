import React from "react";
import classNames from "classnames";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import dropArrow from "assets/icons/Menu/drop-arrow.svg";

const NavLink = ({ active, children, icon, id, to, onClick }) => {
  NavLink.propTypes = {
    active: propTypes.bool.isRequired,
    children: propTypes.node.isRequired,
    icon: propTypes.string.isRequired,
    id: propTypes.string.isRequired,
    to: propTypes.string,
    onClick: propTypes.func
  };

  const Component = to ? Link : "button";

  const props = {
    className: classNames("nav-link", { "nav-link--active": active }),
    ...(to && { to }),
    ...(onClick && { onClick }),
    ...(Component === "button" && { type: "button" })
  };

  return (
    <Component {...props} id={id}>
      <img className="nav-link__icon" src={icon} alt={children} />
      <span className="nav__text" id={`${id}-text`}>
        {children}
      </span>
      {onClick && (
        <img
          className="nav__drop-arrow"
          src={dropArrow}
          alt="Drop arrow"
          id={`${id}-drop-arrow`}
        />
      )}
    </Component>
  );
};

export default NavLink;
