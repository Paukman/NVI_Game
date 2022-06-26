import React, { useState } from "react";

import TabMenuSelector from "Common/TabMenuSelector/TabMenuSelector";
import CreateTransfer from "./CreateTransfer/CreateTransfer";
import "./GlobalTransfers.less";

const MENU_OPTION_CREATE_TRANSFER = 0;

const GlobalTransfers = () => {
  const [tabSelected, setTabSelected] = useState(MENU_OPTION_CREATE_TRANSFER);

  const tabOptions = [
    {
      name: "Create new transfer",
      class: tabSelected === MENU_OPTION_CREATE_TRANSFER ? "active" : "inactive"
    }
  ];

  return (
    <div className="sidebar-container" id="global-transfers-container">
      <div className="sidebar-tabs">
        <TabMenuSelector
          id="global-transfers-tab-menu"
          title="Move money"
          subTitle="Global Transfers"
          items={tabOptions}
          onClick={index => {
            setTabSelected(index);
          }}
        />
      </div>
      <div className="sidebar-content">
        <div className="manage-contacts-form-container">
          {tabSelected === MENU_OPTION_CREATE_TRANSFER && <CreateTransfer />}
        </div>
      </div>
    </div>
  );
};

export default GlobalTransfers;
