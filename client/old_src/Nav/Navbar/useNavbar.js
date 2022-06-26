import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useMouseout from "utils/hooks/useMouseout";
import useResponsive from "utils/hooks/useResponsive";
import useNavTracking from "utils/analytics/useNavTracking";

export const navLinkType = {
  OVERVIEW: "overview",
  MOVE_MONEY: "move-money",
  MORE: "more"
};

const useNavbar = navRef => {
  const location = useLocation();
  const [isMouseout] = useMouseout(navRef, 500); // fine tuning from default 1000ms
  const { updatePrimaryNavPath } = useNavTracking();
  const { screenIsAtMost } = useResponsive();

  const isMobileScreen = screenIsAtMost("sm");

  const getActiveNavLink = useCallback(() => {
    const navLinkPath = location.pathname.split("/")[1];
    if (navLinkPath === "") {
      return navLinkType.OVERVIEW;
    }
    return navLinkPath;
  }, [location.pathname]);

  const [activeNavLink, setActiveNavLink] = useState(getActiveNavLink());
  const [openSubNavMenu, setOpenSubNavMenu] = useState(null);

  const handleNavLinkClick = navLink => {
    updatePrimaryNavPath(navLink);
    setOpenSubNavMenu(navLink);
  };

  const handleSubNavClose = useCallback(() => {
    setOpenSubNavMenu(null);
  }, [setOpenSubNavMenu]);

  const isActiveNavLink = navLink => {
    if (openSubNavMenu) {
      return navLink === openSubNavMenu;
    }
    return navLink === activeNavLink;
  };

  const isOpenSubNav = navLink => {
    if (isMobileScreen) {
      return navLink === openSubNavMenu;
    }
    return isActiveNavLink(navLink);
  };

  useEffect(() => {
    // Set nav state on page change
    const navLink = getActiveNavLink();
    setActiveNavLink(navLink);
    handleSubNavClose();
  }, [getActiveNavLink, handleSubNavClose, setActiveNavLink]);

  useEffect(() => {
    if (isMouseout) {
      handleSubNavClose();
    }
  }, [isMouseout, handleSubNavClose]);

  return {
    handleNavLinkClick,
    handleSubNavClose,
    isActiveNavLink,
    isOpenSubNav
  };
};

export default useNavbar;
