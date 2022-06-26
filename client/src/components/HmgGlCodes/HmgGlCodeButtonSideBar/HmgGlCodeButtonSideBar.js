import React, { memo, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ButtonSideBar } from 'mdo-react-components';
import { HmgGlCodeContext } from '../../../contexts';
import { getText } from '../../../utils/localesHelpers';

const HmgGlCodeButtonSideBar = memo((props) => {
  const { listHmgGlCodes, hmgGlCodes, loading } = useContext(HmgGlCodeContext);
  const { text, iconName, variant, value, id, name, onChange, disabledItems, disabled, hotelId } = props;

  useEffect(() => {
    setTimeout(() => {
      if (hmgGlCodes.length === 0 && !loading) {
        listHmgGlCodes({
          params: {
            hotelId,
          },
        });
      }
    }, 200);
  }, [hmgGlCodes]);

  const items = useMemo(() => {
    const newItems = [];
    if (loading) {
      newItems.push({
        primary: getText('generic.loading'),
        value: '',
        disabled: true,
      });
    } else {
      newItems.push(
        ...hmgGlCodes.map((hmgGlCode) => {
          return {
            id: hmgGlCode.hmgGlCode,
            primary: hmgGlCode.hmgGlCode,
            secondary: hmgGlCode.displayName,
          };
        }),
      );
    }
    return newItems;
  }, [hmgGlCodes, loading, disabledItems]);

  return (
    <ButtonSideBar
      id={id}
      name={name}
      conName={iconName}
      variant={variant}
      disabled={disabled}
      anchor={'right'}
      text={text}
      title={getText('selectors.hmgGlCode.title')}
      items={items}
      value={value}
      onChange={onChange}
    />
  );
});

HmgGlCodeButtonSideBar.displayName = 'HmgGlCodeButtonSideBar';

HmgGlCodeButtonSideBar.propTypes = {
  ...ButtonSideBar.propTypes,
  hotelId: PropTypes.number,
  disabledItems: PropTypes.arrayOf(PropTypes.string),
};

HmgGlCodeButtonSideBar.defaultProps = {
  disabledItems: [''],
};

export { HmgGlCodeButtonSideBar };
