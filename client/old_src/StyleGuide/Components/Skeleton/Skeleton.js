import React from "react";
import PropTypes from "prop-types";
import { Skeleton } from "antd";

export const largeParagraph = {
  rows: 7,
  width: ["100%", "100%", "100%", "100%", "100%", "100%", "100%"]
};

export const largeParagraphTitle = { width: "25%" };

export const mediumParagraph = {
  rows: 4,
  width: ["100%", "100%", "100%", "100%"]
};

export const smallParagraph = {
  rows: 2,
  width: ["100%", "100%"]
};

const SkeletonComponent = ({
  children = null,
  active = true,
  title = false,
  round = true,
  loading = false,
  sizeLarge = false,
  sizeMedium = false,
  sizeSmall = false,
  paragraph = null,
  avatar = false,
  "data-testid": dataTestid = "style-guide-skeleton",
  ...attributes
}) => {
  SkeletonComponent.propTypes = {
    children: PropTypes.node,
    title: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({})]),
    active: PropTypes.bool,
    round: PropTypes.bool,
    loading: PropTypes.bool,
    sizeLarge: PropTypes.bool,
    sizeMedium: PropTypes.bool,
    sizeSmall: PropTypes.bool,
    paragraph: PropTypes.shape({}),
    avatar: PropTypes.bool,
    "data-testid": PropTypes.string
  };
  let paragraphSize = paragraph;
  if (sizeLarge && !paragraph) {
    paragraphSize = largeParagraph;
    title = largeParagraphTitle;
  }
  if (sizeMedium && !paragraph) {
    paragraphSize = mediumParagraph;
  }
  if (sizeSmall && !paragraph) {
    paragraphSize = smallParagraph;
  }
  // none are passed as props
  if (!sizeLarge && !sizeMedium && !sizeSmall && !paragraph) {
    paragraphSize = {
      rows: 4
    };
  }
  return (
    <div data-testid={`${loading ? dataTestid : ""}`}>
      <Skeleton
        active={active}
        loading={loading}
        round={round}
        title={title}
        avatar={avatar}
        paragraph={paragraphSize}
        {...attributes}
      >
        {children}
      </Skeleton>
    </div>
  );
};

export default SkeletonComponent;
