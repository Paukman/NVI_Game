import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { atom, useAtom } from "jotai";

import {
  startTrackingNewLocation,
  trackSecondaryToTertiaryLocation
} from "./utils";

// will hold previous location for all hooks to use it
export const prevLocationAtom = atom("/");

// will hold secondary navigation location
export const secondaryNavLocationAtom = atom(null);

const usePathTracking = () => {
  const location = useLocation();

  // this is previous location from both navigation menu and changing paths
  const [prevLocation, setPrevLocation] = useAtom(prevLocationAtom);
  // this is navigation from navigation menu eg. menu, move-money...
  const [navLocation, setNavLocation] = useAtom(secondaryNavLocationAtom);

  // this will keep previous location from url path
  const [prevPathLocation, setPrevPathLocation] = useState("/");

  useEffect(() => {
    if (
      prevLocation === location.pathname ||
      prevLocation === navLocation ||
      prevPathLocation === location.pathname
    ) {
      return;
    }

    if (navLocation) {
      trackSecondaryToTertiaryLocation({
        locationPathname: location.pathname,
        navLocation,
        prevLocation,
        setPrevLocation
      });
    } else {
      startTrackingNewLocation({
        locationPathname: location.pathname,
        prevLocation,
        setPrevLocation,
        type: location.type
      });
    }
    setPrevPathLocation(location.pathname);
  }, [
    location,
    navLocation,
    prevLocation,
    setPrevLocation,
    setNavLocation,
    prevPathLocation
  ]);
};

export default usePathTracking;
