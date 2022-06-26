import React, { useRef } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { Badge } from "antd";
import { Container } from "semantic-ui-react";
import { useAtom } from "jotai";
import logo from "assets/logo/atb-jewel.svg";
import home from "assets/icons/Home/home.svg";
import moveMoney from "assets/icons/MoveMoney/movemoney.svg";
import more from "assets/icons/More/more.svg";
import notificationIcon from "assets/icons/Notifications/notifications.svg";
import RequireToggle from "Common/RequireToggle";
import {
  drawerVisibleAtom,
  unreadCountAtom
} from "FailedTransaction/failedTransactionAtoms";
import { useAuth0 } from "utils/auth0/Auth0Wrapper";
import useAccountHolderName from "utils/hooks/useAccountHolderName";

import NavLink from "./NavLink";
import NavItem from "./NavItem";
import SubNav from "./SubNav";
import useAtPageTop from "./useAtPageTop";
import useNavbar, { navLinkType } from "./useNavbar";
import "./Navbar.less";

const Navbar = () => {
  const navId = "secure-header";

  const { logout } = useAuth0();
  const navRef = useRef();
  const {
    handleNavLinkClick,
    handleSubNavClose,
    isActiveNavLink,
    isOpenSubNav
  } = useNavbar(navRef);
  const { atPageTop } = useAtPageTop(navRef);

  const { accountHolderFirstName } = useAccountHolderName();

  const [unreadCount] = useAtom(unreadCountAtom);
  const [, setDrawerVisible] = useAtom(drawerVisibleAtom);

  return (
    <header
      ref={navRef}
      className={classNames("navbar", { "navbar--stuck": !atPageTop })}
    >
      <Container as="nav" className="main-nav">
        <Link to="/" className="main-nav__logo">
          <img id={`${navId}-atb-logo-computer`} alt="ATB Logo" src={logo} />
        </Link>
        <div className="main-nav__links">
          <NavLink
            to="/"
            icon={home}
            active={isActiveNavLink(navLinkType.OVERVIEW)}
            id={`${navId}-link-overview`}
          >
            Overview
          </NavLink>
          <NavLink
            icon={moveMoney}
            onClick={() => {
              handleNavLinkClick(navLinkType.MOVE_MONEY);
            }}
            active={isActiveNavLink(navLinkType.MOVE_MONEY)}
            id={`${navId}-link-move-money`}
          >
            Move Money
          </NavLink>
          <NavLink
            icon={more}
            onClick={() => {
              handleNavLinkClick(navLinkType.MORE);
            }}
            active={isActiveNavLink(navLinkType.MORE)}
            id={`${navId}-more-link`}
          >
            More
          </NavLink>
        </div>
        <div className="main-nav__account">
          {accountHolderFirstName && (
            <span className="nav__text">{accountHolderFirstName}</span>
          )}

          <NavItem
            className="notification-icon"
            onClick={() => {
              setDrawerVisible(true);
            }}
            id={`${navId}-notifications`}
          >
            <Badge offset={[-5, 0]} showZero={false} count={unreadCount}>
              <img
                src={notificationIcon}
                alt="Notification icon"
                id="notification_icon"
              />
            </Badge>
          </NavItem>

          <div className="vertical-line" />

          <NavItem
            onClick={() =>
              logout({
                returnTo: `${window.location.origin}/logout?loggedOutMessage=manual`
              })
            }
            id={`${navId}-logout-link`}
          >
            Log out
          </NavItem>

          <RequireToggle toggle="dev-rebank-web-version-toggle">
            <div id="product-version" className="nav__version-toggle">
              <span>{window.envConfig.VERSION || "No version set"}</span>
            </div>
          </RequireToggle>
        </div>
      </Container>
      <SubNav
        atPageTop={atPageTop}
        handleClose={handleSubNavClose}
        navId={navId}
        isOpenSubNav={isOpenSubNav}
      />
    </header>
  );
};

export default Navbar;
