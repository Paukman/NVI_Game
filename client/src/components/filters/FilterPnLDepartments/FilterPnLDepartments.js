import React, { memo, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';
import { MdoGlCodeContext } from '../../../contexts';
import { getText } from '../../../utils/localesHelpers';
import { useMdoGlCodes } from '../../../graphql';

const FilterPnLDepartments = memo((props) => {
  const { listMdoGlCodes: listMdoGlCodeGql } = useMdoGlCodes();
  const {
    mdoGlCodes: mdoGlCodeFromContext,
    loading: mdoIsLoading,
    listMdoGlCodes: listMdoGlCodeContext,
  } = useContext(MdoGlCodeContext);
  const needToLoad = mdoGlCodeFromContext.length === 0 && !mdoIsLoading;
  const { id, name, value, disabled, onChange, disableAll, label } = props;

  useEffect(() => {
    if (mdoGlCodeFromContext.length === 0 && !mdoIsLoading) {
      listMdoGlCodeGql({});
    }
  }, []);

  useEffect(() => {
    if (needToLoad) {
      listMdoGlCodeGql();
    }
  }, [mdoGlCodeFromContext, needToLoad]);

  const items = useMemo(() => {
    const newItems = [];

    if (mdoIsLoading) {
      newItems.push({
        label: getText('generic.loading'),
        value: '',
        disabled: true,
      });
    } else if (mdoGlCodeFromContext.length > 0 && !mdoIsLoading) {
      newItems.push({
        label: getText('hmgGlCodes.filters.allDepartments'),
        value: 'ALL',
        disabled: disableAll ? disableAll : false,
      });
      newItems.push(
        ...mdoGlCodeFromContext
          .filter((mdoGlCode) => !mdoGlCode.parentId)
          .map((mdoGlCode) => {
            return {
              label: `${mdoGlCode.displayName}`,
              value: mdoGlCode.id,
            };
          }),
      );
      return newItems;
    }
  }, [mdoGlCodeFromContext, mdoIsLoading]);

  return (
    <Dropdown
      label={label ? label : ''}
      value={value || ''}
      id={id}
      name={name}
      onChange={onChange}
      disabled={disabled}
      itemName='label'
      items={typeof items !== 'undefined' ? items : [{ label: getText('generic.loading'), value: '', disabled: true }]}
    />
  );
});

FilterPnLDepartments.displayName = 'FilterPnLDepartments';

FilterPnLDepartments.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
};

export { FilterPnLDepartments };
