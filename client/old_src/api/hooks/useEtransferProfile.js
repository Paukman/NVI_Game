import api, { etransfersBaseUrl, queryKeys } from "api";
import { useQuery } from "react-query";

export const useEtransferProfile = (options = {}) => {
  const profileData = useQuery(
    [queryKeys.ETRANSFER_PROFILE],
    async () => {
      const { data } = await api.get(`${etransfersBaseUrl}/profile`);
      return data;
    },
    {
      ...options,
      onError: error => {
        if (!profileData.data && options.onError) {
          options.onError(error);
        }
      }
    }
  );

  return profileData;
};
