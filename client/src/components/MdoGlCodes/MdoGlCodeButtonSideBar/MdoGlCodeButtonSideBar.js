import React, { memo, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ButtonSideBar, arrayToMap } from 'mdo-react-components';
import { MdoGlCodeContext } from '../../../contexts';
import { getText } from '../../../utils/localesHelpers';

const MdoGlCodeButtonSideBar = memo((props) => {
  const { mdoGlCodes, lowestMdoGlCodes, loading, listMdoGlCodes } = useContext(MdoGlCodeContext);
  const { text, iconName, variant, value, id, name, onChange, skipAllParents, disabledItems, disabled } = props;
  const needToLoad = mdoGlCodes.length === 0 && !loading;

  useEffect(() => {
    if (needToLoad) {
      listMdoGlCodes({});
    }
  }, [listMdoGlCodes]); // eslint-disable-line

  const items = useMemo(() => {
    const newItems = [];
    if (loading) {
      newItems.push({
        primary: getText('generic.loading'),
        secondary: '',
        id: '',
        disabled: true,
      });
    } else {
      let disabledMap = {};
      let processItems = skipAllParents ? lowestMdoGlCodes : mdoGlCodes;

      if (Array.isArray(disabledItems)) {
        disabledMap = arrayToMap(disabledItems);
      }

      newItems.push(
        ...processItems.map((mdoGlCode) => {
          return {
            id: mdoGlCode.id,
            primary: mdoGlCode.id,
            secondary: mdoGlCode.displayName,
            disabled: disabledMap[mdoGlCode.id] !== undefined,
          };
        }),
      );
    }
    return newItems.filter((item) => item.id !== 'NOTFOUND');
  }, [mdoGlCodes, loading, disabledItems, lowestMdoGlCodes, skipAllParents]);

  return (
    <ButtonSideBar
      id={id}
      name={name}
      iconName={iconName}
      variant={variant}
      disabled={disabled}
      anchor={'right'}
      text={text}
      title={getText('selectors.mdoGlCode.title')}
      items={items}
      value={value}
      onChange={onChange}
    />
  );
});

MdoGlCodeButtonSideBar.displayName = 'MdoGlCodeButtonSideBar';

MdoGlCodeButtonSideBar.propTypes = {
  ...ButtonSideBar.propTypes,
  skipAllParents: PropTypes.bool,
  disabledItems: PropTypes.arrayOf(PropTypes.string),
};

MdoGlCodeButtonSideBar.defaultProps = {
  disabledItems: [''],
};

export { MdoGlCodeButtonSideBar };
