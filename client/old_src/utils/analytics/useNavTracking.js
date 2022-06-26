import { useCallback } from "react";
import { useAtom } from "jotai";

import { prevLocationAtom, secondaryNavLocationAtom } from "./usePathTracking";
import { startTrackingNewLocation, getSecondaryMenuTag } from "./utils";

const useNavTracking = () => {
  const [prevLocation, setPrevLocation] = useAtom(prevLocationAtom);
  const [, setNavLocation] = useAtom(secondaryNavLocationAtom);

  const updateSecondaryNavPath = useCallback(
    (content, url) => {
      const path = getSecondaryMenuTag(content, url);
      setNavLocation(path);
    },
    [setNavLocation]
  );

  const updatePrimaryNavPath = useCallback(
    path => {
      if (path === prevLocation) {
        return;
      }
      startTrackingNewLocation({
        locationPathname: path,
        prevLocation,
        setPrevLocation
      });
    },
    [prevLocation, setPrevLocation]
  );

  return { updatePrimaryNavPath, updateSecondaryNavPath };
};

export default useNavTracking;
