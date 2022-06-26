import React, { memo, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';
import { getText } from '../../../utils/localesHelpers';
import { useMdoGlCodes } from '../../../graphql';

const MdoDepartmentSelector = memo((props) => {
  const { listMdoGlCodeDepartment, mdoGlCodeDepartmentsLoading, mdoGlCodeDepartments } = useMdoGlCodes();
  const { id, name, value, disabled, onChange, label, error, helperText } = props;
  const { data } = mdoGlCodeDepartments;

  useEffect(() => {
    listMdoGlCodeDepartment();
  }, []);

  const items = useMemo(() => {
    const newItems = [];
    if (mdoGlCodeDepartmentsLoading) {
      newItems.push({
        label: getText('generic.loading'),
        value: '',
        disabled: true,
      });
    } else if (data?.length > 0 && !mdoGlCodeDepartmentsLoading) {
      newItems.push(
        ...data.map((mdoGlCode) => {
          return {
            label: `${mdoGlCode.departmentName}`,
            value: `${mdoGlCode.id}`,
          };
        }),
      );
      return newItems;
    }
  }, [mdoGlCodeDepartments, mdoGlCodeDepartmentsLoading]);

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
      error={error}
      helperText={helperText}
    />
  );
});

MdoDepartmentSelector.displayName = 'MdoDepartmentSelector';

MdoDepartmentSelector.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
};

export { MdoDepartmentSelector };
