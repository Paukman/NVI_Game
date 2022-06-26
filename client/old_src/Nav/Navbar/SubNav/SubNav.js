import React from "react";
import PropTypes from "prop-types";
import useFeatureToggle from "utils/hooks/useFeatureToggle";
import MoveMoneyMenu from "./MoveMoneyMenu";
import MoreMenu from "./MoreMenu";
import { navLinkType } from "../useNavbar";
import "./styles.scss";

const SubNavbar = ({ handleClose, atPageTop, navId, isOpenSubNav }) => {
  SubNavbar.propTypes = {
    atPageTop: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    navId: PropTypes.string.isRequired,
    isOpenSubNav: PropTypes.func.isRequired
  };

  const [globalTransfersEnabled] = useFeatureToggle(
    "rebank-global-transfers-enabled"
  );

  if (isOpenSubNav(navLinkType.MOVE_MONEY)) {
    return (
      <MoveMoneyMenu
        headerId={navId}
        checkPosition={!atPageTop}
        handleClose={handleClose}
        globalTransfersEnabled={globalTransfersEnabled}
      />
    );
  }
  if (isOpenSubNav(navLinkType.MORE)) {
    return (
      <MoreMenu
        headerId={navId}
        checkPosition={!atPageTop}
        handleClose={handleClose}
      />
    );
  }
  return null;
};

export default SubNavbar;
