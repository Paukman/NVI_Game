import React from "react";
import PropTypes from "prop-types";
import { Skeleton as SkeletonLoader } from "StyleGuide/Components";
import { generateId } from "utils";
import useWindowDimensions from "utils/hooks/useWindowDimensions";

import "./styles.scss";

const Skeleton = () => (
  <SkeletonLoader loading paragraph={{ rows: 1, width: ["100%"] }} />
);

const ColumnList = ({ columnData, loading, defaultHeaders }) => {
  const { width } = useWindowDimensions();
  const mapColumns = (columns, headers) => {
    return columns.map((column, index) => {
      const colClassName = column.width.tablet
        ? `${column.width.widescreen} wide large screen ${column.width.desktop} wide computer ${column.width.tablet} wide tablet column ${column.width.mobile} wide mobile`
        : `${column.width.desktop} wide column`;
      return (
        <div
          className={`${colClassName}-${columnData.className}-${index}`}
          key={`${column.data}-${generateId()}`}
          data-testid={
            headers &&
            headers[index] &&
            headers[index].header === "Amount" &&
            column.data.replace
              ? `column-list-${column.data.replace("$", "").replace(".", "")}`
              : ""
          }
        >
          {width < 768 && (
            <span className={`${columnData.className}-mobile-header`}>
              {column.header}
            </span>
          )}
          <div className="column-content">
            <span className="text-content">{column.data}</span>
          </div>
        </div>
      );
    });
  };

  const mapHeaders = headers => {
    return headers.map(header => {
      const colClassName = header.width.tablet
        ? `${header.width.widescreen} wide large screen ${header.width.desktop} wide computer ${header.width.tablet} wide tablet column`
        : `${header.width.desktop} wide column`;

      return (
        <span className={colClassName} key={header.header}>
          {header.header}
        </span>
      );
    });
  };

  return (
    <>
      <div className="row column-headers">{mapHeaders(defaultHeaders)}</div>
      {!loading ? (
        columnData.columns.map(column => (
          <div
            role="button"
            tabIndex={0}
            key={`column-list-row-${generateId()}`}
            className="column-list row"
            onClick={e => {
              e.stopPropagation();
              columnData.handleClick(column[column.length - 1].id);
            }}
            onKeyDown={e => {
              e.stopPropagation();
              columnData.handleClick(column[column.length - 1].id);
            }}
          >
            {mapColumns(column, defaultHeaders)}
            <hr className="column-divider" />
          </div>
        ))
      ) : (
        <div className="skeleton-loaders">
          <div
            className="column-list row skeleton"
            data-testid="column-list-skeleton"
          >
            <Skeleton />
            <hr className="column-divider" />
          </div>
          <div className="column-list row skeleton">
            <Skeleton />
            <hr className="column-divider" />
          </div>
          <div className="column-list row skeleton">
            <Skeleton />
            <hr className="column-divider" />
          </div>
          <div className="column-list row skeleton">
            <Skeleton />
            <hr className="column-divider" />
          </div>
        </div>
      )}
    </>
  );
};

ColumnList.propTypes = {
  columnData: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  defaultHeaders: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      width: PropTypes.shape({
        desktop: PropTypes.string,
        tablet: PropTypes.string
      }).isRequired
    })
  ).isRequired
};

export default ColumnList;
