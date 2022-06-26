import React from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import cross from "assets/icons/Cross/cross.svg";
import { eTransferErrors } from "utils/MessageCatalog";
import { Menu, Container, Grid, Divider } from "semantic-ui-react";
import SubNavLink from "./SubNavLink";

const MoreMenu = ({ headerId, checkPosition, handleClose }) => {
  MoreMenu.propTypes = {
    headerId: PropTypes.string.isRequired,
    checkPosition: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
  };
  const location = useLocation();

  return (
    <header
      id={`${headerId}-secondary-more`}
      className={`secondary-header ${checkPosition ? "primary-shrinked" : ""}`}
    >
      <Menu secondary stackable>
        <Container id={`${headerId}-secondary-more-container`}>
          <Grid className="mobile-grid">
            <Grid.Column tablet={11} mobile={8}>
              <h4 id={`${headerId}-secondary-more-title`}>More</h4>
            </Grid.Column>
            <Grid.Column tablet={5} mobile={8}>
              <Menu.Item
                id={`${headerId}-secondary-more-menu-item`}
                onClick={() => handleClose("more")}
              >
                <img id={`${headerId}-cross-icon`} alt="cross" src={cross} />
              </Menu.Item>
            </Grid.Column>
          </Grid>
          <Divider section />
          <SubNavLink
            url="/more/manage-contacts/recipients"
            content="Manage contacts"
            id={`${headerId}-manage-contacts-link`}
            className={`${
              location.pathname.includes("/more/manage-contacts")
                ? "active"
                : ""
            }`}
          />
          <SubNavLink
            url="/more/interac-preferences/profile/view-profile"
            content={eTransferErrors.preferences_Trademark}
            id={`${headerId}-interac-preferences`}
            className={`${
              location.pathname.includes("/more/interac-preferences")
                ? "active"
                : ""
            }`}
          />
          <SubNavLink
            url="/more/contact-us"
            content="Contact us"
            id={`${headerId}-contact-us`}
            className={`${
              location.pathname.includes("/more/contact-us") ? "active" : ""
            }`}
          />
          <SubNavLink
            url="/more/privacy-and-security"
            content="Privacy & security"
            id={`${headerId}-privacy-and-security`}
            className={`${
              location.pathname.includes("/more/privacy-and-security")
                ? "active"
                : ""
            }`}
          />
        </Container>
      </Menu>
    </header>
  );
};

export default MoreMenu;
