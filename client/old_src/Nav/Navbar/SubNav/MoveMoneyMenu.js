import React from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import cross from "assets/icons/Cross/cross.svg";
import { eTransferErrors } from "utils/MessageCatalog";
import { Menu, Container, Grid, Divider } from "semantic-ui-react";
import SubNavLink from "./SubNavLink";

const MoveMoneyMenu = ({
  headerId,
  checkPosition,
  handleClose,
  globalTransfersEnabled = false
}) => {
  MoveMoneyMenu.propTypes = {
    headerId: PropTypes.string.isRequired,
    checkPosition: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    globalTransfersEnabled: PropTypes.bool
  };

  const location = useLocation();

  return (
    <header
      id={`${headerId}-secondary-move-money`}
      className={`secondary-header ${checkPosition ? "primary-shrinked" : ""}`}
    >
      <Menu secondary stackable>
        <Container id={`${headerId}-secondary-move-money-container`}>
          <Grid className="mobile-grid">
            <Grid.Column tablet={11} mobile={8}>
              <h4 id={`${headerId}-secondary-move-money-title`}>Move money</h4>
            </Grid.Column>
            <Grid.Column tablet={5} mobile={8}>
              <Menu.Item
                id={`${headerId}-secondary-move-money-menu-item`}
                onClick={() => handleClose("move-money")}
              >
                <img id={`${headerId}-cross-icon`} alt="cross" src={cross} />
              </Menu.Item>
            </Grid.Column>
          </Grid>
          <Divider section />
          <SubNavLink
            url="/move-money/send-money"
            hash="#create"
            content={eTransferErrors.eTransfer_Trademark}
            id={`${headerId}-e-transfer-link`}
            className={`${
              location.pathname === "/move-money/send-money" ||
              location.pathname === "/move-money/request-money" ||
              location.pathname.includes("/move-money/receive-money") ||
              location.pathname === "/move-money/etransfer-history"
                ? "active"
                : ""
            }`}
          />
          <SubNavLink
            url="/move-money/bill-payment/one-time"
            content="Pay a bill"
            id={`${headerId}-bill-payment-link`}
            hash="#create"
            className={`${
              location.pathname.includes("/move-money/bill-payment")
                ? "active"
                : ""
            }`}
          />
          <SubNavLink
            url="/move-money/transfer-between-accounts/one-time"
            hash="#create"
            content="Transfer between accounts"
            id={`${headerId}-transfer-between-accounts-link`}
            className={`${
              location.pathname.includes(
                "/move-money/transfer-between-accounts"
              )
                ? "active"
                : ""
            }`}
          />
          {globalTransfersEnabled && (
            <SubNavLink
              url="/move-money/global-transfers"
              content="Global Transfers"
              id={`${headerId}-global-transfers`}
              className={`${
                location.pathname.includes("/move-money/global-transfers")
                  ? "active"
                  : ""
              }`}
            />
          )}
        </Container>
      </Menu>
    </header>
  );
};

export default MoveMoneyMenu;
