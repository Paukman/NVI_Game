import React from "react";
import PropTypes from "prop-types";

import { Menu } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import useNavTracking from "utils/analytics/useNavTracking";

import "./styles.scss";

/**
 * @deprecated
 */
const SubNavLink = ({ url, hash, id, content, img, className }) => {
  const location = useLocation();
  SubNavLink.propTypes = {
    url: PropTypes.string.isRequired,
    hash: PropTypes.string,
    id: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})])
      .isRequired,
    img: PropTypes.string,
    className: PropTypes.string.isRequired
  };

  SubNavLink.defaultProps = {
    img: null,
    hash: ""
  };

  const { updateSecondaryNavPath } = useNavTracking();

  return (
    <Menu.Menu
      onClick={() => {
        updateSecondaryNavPath(content, url);
      }}
      as={Link}
      to={{
        hash,
        pathname: url,
        state: { from: location.pathname }
      }}
    >
      {img && (
        <img id={`${id}-icon`} alt={content} src={img} className={className} />
      )}
      <Menu.Item className="menu title" id={id}>
        <span id={`${id}-text`} className={className}>
          {content}
        </span>
      </Menu.Item>
    </Menu.Menu>
  );
};

export default SubNavLink;
