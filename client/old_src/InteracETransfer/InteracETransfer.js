import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { Grid } from "antd";
import PromptProvider from "Common/PromptProvider";
import TabMenuSelector from "Common/TabMenuSelector";
import { eTransferErrors } from "utils/MessageCatalog";
import send from "assets/icons/Send/send.svg";
import request from "assets/icons/Request/request.svg";
import scheduledPayments from "assets/icons/Scheduled/etransfer-history.svg";
import ReceiveETransfer from "./ReceiveETransfer";
import SendETransfer from "./SendETransfer";
import RequestETransfer from "./RequestETransfer";
import FulfillERequest from "./FulfillRequest";
import FulfillERequestProvider from "./FulfillRequest/FulfillERequestProvider";
import ETransferHistory from "./ETransferHistory";
import ReceiveETransferProvider from "./ReceiveETransfer/ReceiveETransferProvider";
import ETransferProvider from "./ETransferProvider";
import {
  SEND_MONEY_PATH,
  REQUEST_MONEY_PATH,
  ETRANSFER_HISTORY_PATH
} from "./eTransferConstants";

const SEND_MONEY = "send-money";
const REQUEST_MONEY = "request-money";
const RECEIVE_MONEY = "receive-money";
const FULFILL_MONEY = "fulfill-money";
const ETRANSFER_HISTORY = "etransfer-history";

const InteracETransfer = ({ type = null, id = "" }) => {
  InteracETransfer.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string
  };

  const [currentType, setCurrentType] = useState(type);
  const history = useHistory();

  const screens = Grid.useBreakpoint();

  const actionTitleArray = [
    {
      name: "Send money",
      class: currentType === SEND_MONEY ? "active" : "inactive",
      icon: send
    },
    {
      name: "Request money",
      class: currentType === REQUEST_MONEY ? "active" : "inactive",
      icon: request
    },
    {
      name: screens.xs ? "History" : "Transfer history",
      class: currentType === ETRANSFER_HISTORY ? "active" : "inactive",
      icon: scheduledPayments
    }
  ];

  const handleTabClick = index => {
    if (index === 0) {
      history.push(SEND_MONEY_PATH);
    } else if (index === 1) {
      history.push(REQUEST_MONEY_PATH);
    } else if (index === 2) {
      history.push(ETRANSFER_HISTORY_PATH);
    }
  };

  useEffect(() => {
    const { pathname } = history.location;
    if (pathname === SEND_MONEY_PATH) {
      setCurrentType(SEND_MONEY);
    } else if (pathname === REQUEST_MONEY_PATH) {
      setCurrentType(REQUEST_MONEY);
    } else if (pathname === ETRANSFER_HISTORY_PATH) {
      setCurrentType(ETRANSFER_HISTORY);
    }
  }, [history.location.pathname]);

  return (
    <>
      <div className={`sidebar-container ${currentType}`} id="etransfer">
        <div className="sidebar-tabs">
          <TabMenuSelector
            id="etransfer"
            title="Move money by"
            subTitle={eTransferErrors.eTransfer_Trademark}
            items={actionTitleArray}
            onClick={handleTabClick}
          />
        </div>
        <div className="sidebar-content">
          {currentType === REQUEST_MONEY && (
            <ETransferProvider>
              <RequestETransfer />
            </ETransferProvider>
          )}
          {currentType === SEND_MONEY && (
            <ETransferProvider>
              <SendETransfer />
            </ETransferProvider>
          )}
          {currentType === ETRANSFER_HISTORY && <ETransferHistory />}
          {currentType === FULFILL_MONEY && (
            <PromptProvider>
              <FulfillERequestProvider>
                <FulfillERequest id={id ?? ""} />
              </FulfillERequestProvider>
            </PromptProvider>
          )}
          {currentType === RECEIVE_MONEY && (
            <PromptProvider>
              <ReceiveETransferProvider id={id ?? ""}>
                <ReceiveETransfer />
              </ReceiveETransferProvider>
            </PromptProvider>
          )}
        </div>
      </div>
    </>
  );
};

export default InteracETransfer;
