import { useEffect } from "react";
import { useQuery } from "react-query";
import api, { globalTransfersUrl } from "api";

import { queryKeys } from "api/queryKeys";
import useErrorModal from "utils/hooks/useErrorModal";
import { getFormattedAccounts } from "utils/formatAccounts";
import useAccountList, { accountFeatureTypes } from "api/hooks/useAccountList";
import { getAccountCurrencies } from "../utils";

export const useGetRecipientList = () => {
  const recipientsUrl = `${globalTransfersUrl}/recipients`;

  const getRecipientList = async () => {
    const { data } = await api.get(recipientsUrl);
    return data.recipients;
  };

  const { data: recipientList = [], isError, isLoading } = useQuery(
    queryKeys.GLOBAL_TRANSFERS_RECIPIENTS,
    getRecipientList
  );

  return { recipientList, isError, isLoading };
};

const useGetUserAddress = () => {
  const userInfoUrl = `${globalTransfersUrl}/user`;

  const getUserAddress = async () => {
    const { data } = await api.get(userInfoUrl);
    return data.address;
  };

  const { data: address, isError, isLoading } = useQuery(
    queryKeys.GLOBAL_TRANSFERS_USERINFO,
    getUserAddress
  );

  return { address, isError, isLoading };
};

const formatUserAddress = address => {
  if (!address) return "";

  let addressString = "";
  addressString += address.houseNumber ? `${address.houseNumber} ` : "";
  addressString += address.street ? `${address.street}, ` : "";
  addressString += address.city ? `${address.city} ` : "";
  addressString += address.region ? `${address.region}, ` : "";
  addressString += address.postalCode ? `${address.postalCode}` : "";

  return addressString;
};

const useGetGlobalTransfersInfo = () => {
  const {
    recipientList,
    isError: recipientsError,
    isLoading: isLoadingRecipients
  } = useGetRecipientList();

  const {
    data: accountList = [],
    isError: accountListError,
    isLoading: isLoadingAccounts
  } = useAccountList(accountFeatureTypes.GLOBAL_TRANSFERS);

  const {
    address,
    isError: userAddressError,
    isLoading: isLoadingUserAddress
  } = useGetUserAddress();
  const userAddress = formatUserAddress(address);

  const error = recipientsError || accountListError || userAddressError;
  const loading =
    isLoadingRecipients || isLoadingAccounts || isLoadingUserAddress;
  const { showErrorModal } = useErrorModal();

  useEffect(() => {
    if (error) {
      showErrorModal();
    }
  }, [error]);

  return {
    isError: error,
    recipientList: recipientList || [],
    accountList: getFormattedAccounts(accountList),
    accountListCurrencies: getAccountCurrencies(accountList),
    userAddress,
    isLoading: loading
  };
};

export default useGetGlobalTransfersInfo;
