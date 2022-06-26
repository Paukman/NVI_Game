import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { notification, Typography } from "antd";
import errorIcon from "assets/icons/error.svg";
import closeIcon from "assets/icons/Cross/cross.svg";
import { Button } from "StyleGuide/Components";
import { failedTransactionMessages } from "utils/MessageCatalog";
import {
  drawerVisibleAtom,
  notificationTriggerAtom
} from "./failedTransactionAtoms";

const NOTIFICATION_KEY = "FAILED_TRANSACTION_NOTIFICATION";

const useShowNotification = (
  failedTransactions,
  unreadCount,
  onClick = () => {}
) => {
  const [drawerVisible] = useAtom(drawerVisibleAtom);
  const [notificationTrigger, setNotificationTrigger] = useAtom(
    notificationTriggerAtom
  );

  const { Title } = Typography;

  const getNotificationDetails = () => {
    if (unreadCount === 1) {
      const txn = Object.values(failedTransactions)
        .flat()
        .find(t => !t.isAcknowledged);

      return { desc: txn.desc, txn };
    }

    return { desc: failedTransactionMessages.MSG_RBFTA_000(unreadCount) };
  };

  useEffect(() => {
    if (!notificationTrigger || unreadCount <= 0 || drawerVisible) return;

    const { desc, txn } = getNotificationDetails();

    notification.open({
      icon: <img alt="Error icon" src={errorIcon} />,
      closeIcon: (
        <img
          alt="Close icon"
          id="list_failed_transactions_close"
          src={closeIcon}
        />
      ),
      message: (
        <Title className="padding-top-2" level={5}>
          {failedTransactionMessages.COMMON_TITLE}
        </Title>
      ),
      key: NOTIFICATION_KEY,
      duration: 0,
      description: desc,
      btn: (
        <Button
          onClick={() => {
            notification.close(NOTIFICATION_KEY);
            onClick(txn);
          }}
          className="ant-btn-link md-link"
          id="failed_transactions_review"
        >
          Review
        </Button>
      )
    });
    setNotificationTrigger(false);
  }, [notificationTrigger, getNotificationDetails]);
};

export default useShowNotification;
