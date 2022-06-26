import React, { memo } from 'react';
import { BaseListImpl } from './BaseListImpl';

/**
 * This is a publicly available component that just does `items` verification and then
 * calls BaseListImpl
 */
const BaseList = memo((props) => {
  const { items } = props;

  if (!Array.isArray(items)) {
    console.error(`The 'BaseList' expected to get array of items but got `, items);
    return null;
  }

  return <BaseListImpl {...props} level={1} />;
});

BaseList.displayName = 'BaseList';

BaseList.propTypes = {
  ...BaseListImpl.propTypes,
};

BaseList.defaultProps = {
  dense: false,
  disablePadding: false,
  disableGutters: false,
};

export { BaseList };
