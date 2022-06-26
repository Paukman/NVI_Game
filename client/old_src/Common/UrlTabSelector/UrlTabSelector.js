import React from "react";
import PropTypes from "prop-types";
import TabMenuSelector from "Common/TabMenuSelector";
import useUrlTabSelector from "./useUrlTabSelector";

const UrlTabSelector = props => {
  UrlTabSelector.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
      .isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        class: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        icon: PropTypes.string
      })
    ).isRequired,
    onClick: PropTypes.func.isRequired
  };

  UrlTabSelector.defaultProps = {
    title: ""
  };

  const { title, subTitle, items, onClick } = props;
  const { tabs } = useUrlTabSelector(items);

  return (
    <TabMenuSelector
      title={title}
      subTitle={subTitle}
      items={tabs}
      onClick={onClick}
    />
  );
};

export default UrlTabSelector;
