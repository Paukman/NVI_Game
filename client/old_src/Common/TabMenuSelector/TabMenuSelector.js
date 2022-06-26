import React, { Fragment, useState } from "react";
import { Divider } from "semantic-ui-react";
import PropTypes from "prop-types";
import useWindowDimensions from "utils/hooks/useWindowDimensions";
import "./styles.scss";

const TabMenuSelector = ({
  id,
  title,
  subTitle,
  items,
  onClick,
  className
}) => {
  TabMenuSelector.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
      .isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        icon: PropTypes.string
      })
    ).isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string
  };

  TabMenuSelector.defaultProps = {
    id: "",
    className: ""
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowDimensions();

  const setTabString = string => {
    if (width < 768) {
      const spaceIndex = string.indexOf(" ");
      if (spaceIndex < 0) return string;
      return string.slice(0, spaceIndex);
    }
    return string;
  };

  const displayIcon = width > 355;

  const getActiveClass = (item, index) => {
    let activeClass = "active tab-menu-item";
    if (item.class !== undefined && item.class === "inactive") {
      activeClass = "tab-menu-item";
    }
    if (item.class === undefined && activeIndex !== index) {
      activeClass = "tab-menu-item";
    }

    const activeCustomClass = className
      ? `${activeClass} ${className}`
      : `${activeClass}`;

    return activeCustomClass;
  };

  /* eslint-disable jsx-a11y/anchor-is-valid */
  const renderMenuItems = () => {
    return items.map((item, index) => (
      <div
        key={item.name.replace(/\s/g, "")}
        className={`${getActiveClass(item, index)} ${
          width < 768 ? "column" : "row"
        }`}
      >
        <a
          href="#!"
          id={`${id}-tab-menu-item-${index}`}
          data-testid={`Tab-${item.name.replace(/\s/g, "")}`}
          key={item.name.replace(/\s/g, "")}
          onClick={e => {
            e.preventDefault();
            if (e.detail > 0) {
              setActiveIndex(index);
              onClick(index, false);
            } else {
              setActiveIndex(index);
              onClick(index, true);
            }
          }}
        >
          {item.icon && displayIcon && (
            <img src={item.icon} alt={item.icon} className={`${item.name}`} />
          )}
          <span>{setTabString(item.name)}</span>
        </a>
      </div>
    ));
  };

  return (
    <Fragment>
      <div className="sidebar-tabs-header">
        <span id="sidebar-tabs-title">{title}</span>
        <h3 id="sidebar-tabs-sub-title">{subTitle}</h3>
        <Divider id="sidebar-tabs-divider" />
      </div>
      <div className="sidebar-tabs-items ui equal width grid" key="foo">
        {renderMenuItems()}
      </div>
    </Fragment>
  );
};

export default TabMenuSelector;
