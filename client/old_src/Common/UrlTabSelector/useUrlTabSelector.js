import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import useIsMounted from "utils/hooks/useIsMounted";

const useUrlTabSelector = items => {
  const [tabs, setTabs] = useState(items); // items is just a seed(static) to local state, used only once
  const location = useLocation();
  const isMounted = useIsMounted();
  const setActiveState = useCallback(
    tabItems => {
      if (
        // if current location does not include current paths, just return default
        tabItems.filter(item => location.pathname.includes(item.url)).length ===
        0
      ) {
        return tabItems;
      }
      return tabItems.map(item => {
        if (!location.pathname.includes(item.url)) {
          return {
            ...item,
            class: "inactive"
          };
        }
        return {
          ...item,
          class: "active"
        };
      });
    },
    [location]
  );

  useEffect(() => {
    if (isMounted()) {
      setTabs(tabItems => setActiveState(tabItems));
    }
  }, [location, setActiveState, isMounted]);

  return {
    tabs,
    location,
    setActiveState
  };
};

export default useUrlTabSelector;
