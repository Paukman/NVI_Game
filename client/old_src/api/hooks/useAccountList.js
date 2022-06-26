import { useQuery } from "react-query";
import api, { accountsBaseUrl, queryKeys } from "api";

export const accountFeatureTypes = {
  GLOBAL_TRANSFERS: "GlobalTransfers"
};

const useAccountList = (feature, options = {}) => {
  const accountListUrl = `${accountsBaseUrl}/sortedEligibleAccounts${feature &&
    `?feature=${feature}`}`;

  const getAccountList = async () => {
    const { data } = await api.get(accountListUrl);
    return data;
  };

  const query = useQuery([queryKeys.ACCOUNT, feature], getAccountList, {
    ...options,
    onError: error => {
      if (!query.data && options.onError) {
        options.onError(error);
      }
    }
  });

  return query;
};

export default useAccountList;
