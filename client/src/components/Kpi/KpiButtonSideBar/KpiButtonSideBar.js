import React, { memo, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ButtonSideBar } from 'mdo-react-components';
import { useKpi } from '../../../graphql';
import { getText } from '../../../utils/localesHelpers';

const KpiButtonSideBar = memo((props) => {
  const { kpiList, kpiLoading, kpis } = useKpi();
  const { text, iconName, variant, value, id, name, onChange, disabled } = props;

  useEffect(() => {
    setTimeout(() => {
      if (kpis.data.length === 0 && !kpiLoading) {
        kpiList({
          params: {
            // kpiCategoryId: 1,
          },
        });
      }
    }, 200);
  }, [kpis, kpiLoading]);

  const items = useMemo(() => {
    const newItems = [];
    if (kpiLoading) {
      newItems.push({
        primary: getText('generic.loading'),
        value: '',
        disabled: true,
      });
    } else {
      newItems.push(
        ...kpis.data.map((kpi) => {
          return {
            id: kpi.kpiName,
            primary: kpi.kpiName,
            secondary: kpi.kpiDescription,
          };
        }),
      );
    }
    return newItems;
  }, [kpis, kpiLoading]);

  return (
    <ButtonSideBar
      id={id}
      name={name}
      iconName={iconName}
      variant={variant}
      disabled={disabled}
      anchor={'right'}
      text={text}
      title={getText('selectors.kpi.title')}
      items={items}
      value={value}
      onChange={onChange}
    />
  );
});

KpiButtonSideBar.displayName = 'KpiButtonSideBar';

KpiButtonSideBar.propTypes = {
  ...ButtonSideBar.propTypes,
  disabledItems: PropTypes.arrayOf(PropTypes.string),
};

KpiButtonSideBar.defaultProps = {
  disabledItems: [''],
};

export { KpiButtonSideBar };
