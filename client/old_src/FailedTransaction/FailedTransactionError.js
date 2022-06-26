import React from "react";
import { Typography } from "antd";
import { func } from "prop-types";
import { Button } from "StyleGuide/Components";
import { eTransferErrors, SYSTEM_ERROR } from "utils/MessageCatalog";

const { Title, Text } = Typography;

const FailedTransactionError = ({ onClick }) => (
  <div className="failed-transaction-error">
    <Title level={3} className="failed-transaction-error__title">
      {SYSTEM_ERROR}
    </Title>
    <Text className="failed-transaction-error__text">
      {eTransferErrors.MSG_REBAS_000_CONTENT}
    </Text>
    <Button onClick={onClick} link>
      OK
    </Button>
  </div>
);

FailedTransactionError.propTypes = {
  onClick: func.isRequired
};

export default FailedTransactionError;
