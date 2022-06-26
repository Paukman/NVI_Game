import React, { useEffect } from "react";
import usePathTracking from "utils/analytics/usePathTracking";
import mixpanel from "mixpanel-browser";
import * as analytics from "utils/analytics/analytics";

import { PAGE_TRACKING } from "utils/analytics/utils";

const NavTracker = () => {
  useEffect(() => {
    analytics.init();
    mixpanel.time_event(PAGE_TRACKING);
  }, []);

  usePathTracking();

  return <></>;
};

export default NavTracker;
