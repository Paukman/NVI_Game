import React, { memo, useEffect, useContext } from 'react';
import { getText } from '../../../utils/localesHelpers';
import { Dropdown, SearchableDropdown, MultiSelectDropdown } from 'mdo-react-components';
import { KpiContext } from 'contexts';
import { useKpi } from '../../../graphql';

const KpiDropdown = memo((props) => {
  const { kpis, kpiList, kpiLoading } = useContext(KpiContext);

  useEffect(() => {
    kpiList({ params: {} });
  }, [kpiList]);

  const items = [];

  if (kpiLoading) {
    items.push({
      label: getText('generic.loading'),
      value: '',
      disabled: true,
    });
  } else {
    items.push(
      ...kpis.data.map((kpi) => {
        return {
          label: kpi.kpiName,
          value: kpi.id,
        };
      }),
    );
  }

  if (kpiLoading || items.length === 0) return null;

  if (props?.multiple) {
    return <MultiSelectDropdown items={items} {...props} />;
  } else {
    return <SearchableDropdown items={items} {...props} />;
  }
});

KpiDropdown.displayName = ' KpiDropdown';

KpiDropdown.propTypes = {
  ...Dropdown.propTypes,
};

export { KpiDropdown };
