import React, { useEffect } from "react";
import PropTypes from "prop-types";
import useErrorModal from "utils/hooks/useErrorModal";
import useAccountDetails from "./useAccountDetails";
import DetailsCard from "./DetailsCard";
import Transactions from "./Transactions";

const AccountDetails = ({ match }) => {
  AccountDetails.propTypes = {
    match: PropTypes.shape({}).isRequired
  };

  const { id = "deposit", type = "deposit" } = match.params;
  const { accountDetails, isError, isLoading } = useAccountDetails({
    id,
    type
  });
  const { showErrorModal } = useErrorModal();

  useEffect(() => {
    if (isError) {
      showErrorModal();
    }
  }, [isError]);

  return (
    <>
      <DetailsCard
        accountDetails={accountDetails}
        accountType={type}
        isLoading={isLoading}
      />
      <Transactions
        // Temp solution to prevent more than 1 modal show up
        // when both detail and transaction fetch failed. Will
        // move transaction fetching out of the component along
        // with antd refactor
        showErrorModal={showErrorModal}
        accountId={id}
        id={`details-${type}-transactions`}
        type={type}
      />
    </>
  );
};

export default AccountDetails;
