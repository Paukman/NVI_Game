import React, { memo, useEffect, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { getText } from '../../../utils/localesHelpers';
import { Dropdown } from 'mdo-react-components';
import { useGSSReports } from '../../../graphql';
import { HotelContext, GlobalFilterContext } from '../../../contexts';
import dayjs from 'dayjs';

const GssAssignedPrioritiesDropdown = memo((props) => {
  const { hotelId, year } = props;
  const { gssHotelPriorityList, gssHotelPriorities, loadingGssHotelPriorityList } = useGSSReports();
  const { portfolio } = useContext(GlobalFilterContext);
  const { getPortfolioHotelIds } = useContext(HotelContext);

  useEffect(() => {
    gssHotelPriorityList({
      params: {
        hotelId: hotelId ?? getPortfolioHotelIds(portfolio)?.[0],
        year: year ?? dayjs(portfolio?.primaryDashboardDate ?? new Date().setDate(new Date().getDate() - 1)).year(),
      },
    });
  }, [gssHotelPriorityList, hotelId, year]);

  const items = [];

  if (loadingGssHotelPriorityList) {
    items.push({
      label: getText('generic.loading'),
      value: '',
      disabled: true,
    });
  } else {
    items.push(
      ...gssHotelPriorities.data.map((item) => {
        return {
          label: `${item.priority} - ${item.priorityName}`,
          value: item.priority,
        };
      }),
    );
  }

  return <Dropdown items={items} {...props} />;
});

GssAssignedPrioritiesDropdown.displayName = ' GssAssignedPrioritiesDropdown';

GssAssignedPrioritiesDropdown.propTypes = {
  ...Dropdown.propTypes,
  hotelId: PropTypes.number,
  year: PropTypes.number,
};

export { GssAssignedPrioritiesDropdown };
