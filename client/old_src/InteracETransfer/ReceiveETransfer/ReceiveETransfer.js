import React, { useContext } from "react";
import InteracUserProfile from "../../InteracUserProfile";
import AccountSelection from "./AccountSelection";
import ReceiveETransferForm from "./ReceiveETransferForm";
import { ReceiveETransferContext } from "./ReceiveETransferProvider";

const ReceiveETransfer = () => {
  const { receiveETransfer, userProfile } = useContext(ReceiveETransferContext);

  const { profile, goNext } = userProfile;
  const { receiveEState } = receiveETransfer;

  const { authenticated, receiveMoneyData } = receiveEState;

  if (profile.render) {
    return (
      <InteracUserProfile
        next={() => {
          goNext();
        }}
      />
    );
  }

  if (authenticated && receiveMoneyData) {
    return <AccountSelection receiveEState={receiveEState} />;
  }
  return <ReceiveETransferForm />;
};

export default ReceiveETransfer;
