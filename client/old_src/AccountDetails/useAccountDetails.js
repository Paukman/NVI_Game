import api, { accountsBaseUrl, queryKeys } from "api";
import { useQuery } from "react-query";
import { mapAccountDetails } from "./mapAccountDetails";

const useAccountDetails = ({ id, type }) => {
  const accountDetailsUrl = `${accountsBaseUrl}/${type}s/${id}?quickActions=true`;

  const getAccountDetails = async () => {
    const { data } = await api.get(accountDetailsUrl);
    return data;
  };

  const { data: accountDetails, isError, isLoading } = useQuery(
    [queryKeys.ACCOUNT_DETAILS, type, id],
    getAccountDetails,
    {
      select: mapAccountDetails
    }
  );

  return {
    accountDetails,
    isError,
    isLoading
  };
};

export default useAccountDetails;
