import React, { useRef } from "react";
import { useAtom } from "jotai";
import { Drawer, Row, Col, Typography } from "antd";
import useResponsive from "utils/hooks/useResponsive";

import closeIcon from "assets/icons/Cross/cross.svg";
import chevronBackIcon from "assets/icons/chevron-back-blue.svg";

import { drawerVisibleAtom } from "./failedTransactionAtoms";
import FailedTransactionList from "./FailedTransactionList";
import FailedTransactionDetails from "./FailedTransactionDetails";
import FailedTransactionError from "./FailedTransactionError";
import useFailedTransactionData from "./useFailedTransactionData";
import useDetailsTransition from "./useDetailsTransition";
import useShowNotification from "./useShowNotification";

import "./styles.less";

const FailedTransactionDrawer = () => {
  const { Title } = Typography;

  const {
    failedTransactions,
    error,
    markTransactionAsRead,
    unreadCount
  } = useFailedTransactionData();

  const { isXS } = useResponsive();
  const drawerWidth = isXS ? 320 : 415;
  const drawerContainer = useRef();
  const [drawerVisible, setDrawerVisible] = useAtom(drawerVisibleAtom);

  const {
    selectedTransaction,
    selectTransaction,
    unselectTransaction
  } = useDetailsTransition(drawerContainer);

  const handleTransactionClick = txn => {
    markTransactionAsRead(txn);
    selectTransaction(txn);
  };

  const handleNotificationClick = txn => {
    setDrawerVisible(true);
    if (txn) handleTransactionClick(txn);
  };

  const handleDrawerClose = () => {
    unselectTransaction();
    setDrawerVisible(false);
  };

  const handleBackToList = () => {
    unselectTransaction();
  };

  useShowNotification(failedTransactions, unreadCount, handleNotificationClick);

  return (
    <Drawer
      maskClosable
      className="failed-transaction-drawer"
      closeIcon={
        <img className="drawer-close-icon" alt="Close icon" src={closeIcon} />
      }
      width={drawerWidth}
      placement="right"
      visible={drawerVisible}
      onClose={handleDrawerClose}
      data-testid={`unread-count-${unreadCount}`} // for testing a computed atom, issues testing it like other atoms
    >
      <Row align="middle" className="failed-transaction-drawer-header">
        <Col span={selectedTransaction ? 3 : 2}>
          {selectedTransaction && (
            <button
              type="button"
              onClick={handleBackToList}
              className="drawer-back-button"
              id="failed-transactions-back-button"
            >
              <img src={chevronBackIcon} alt="Back icon" />
            </button>
          )}
        </Col>
        <Col span={18}>
          <Title
            onClick={handleBackToList}
            className={`drawer-title ${
              selectedTransaction ? "details-title" : "list-title"
            }`}
            level={2}
          >
            Notifications
          </Title>
        </Col>
      </Row>

      {error ? (
        <FailedTransactionError onClick={handleDrawerClose} />
      ) : (
        <div
          ref={drawerContainer}
          className={`failed-transaction-drawer-body ${
            selectedTransaction ? "show-details-section" : ""
          }`}
        >
          <div
            className="drawer-section drawer-section__list"
            data-testid="drawer-list"
          >
            <FailedTransactionList
              onClick={handleTransactionClick}
              failedTransactions={failedTransactions}
            />
          </div>
          <div className="drawer-section" data-testid="drawer-details">
            {selectedTransaction && (
              <FailedTransactionDetails transaction={selectedTransaction} />
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default FailedTransactionDrawer;
