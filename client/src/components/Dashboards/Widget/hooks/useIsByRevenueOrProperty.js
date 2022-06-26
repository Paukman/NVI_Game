import { useState } from 'react';

export const useIsByRevenueOrProperty = (castedArray, isRevenueSelected) => {
  // castedArray[1] will only defined when the `by revenue` tab is selected
  const [active, setActive] = useState({
    idx: isRevenueSelected ? 1 : 0,
    dashboardWidget: isRevenueSelected ? castedArray[1] ?? castedArray[0] : castedArray[0],
  });
  return { active, setActive };
};
