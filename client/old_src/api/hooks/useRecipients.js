import api, { etransfersBaseUrl, queryKeys } from "api";
import { useQuery } from "react-query";

export const useRecipients = (options = {}) => {
  const recipientsData = useQuery(
    [queryKeys.RECIPIENTS],
    async () => {
      const { data } = await api.get(`${etransfersBaseUrl}/recipients`);
      return data;
    },
    {
      ...options,
      onError: error => {
        if (!recipientsData.data && options.onError) {
          options.onError(error);
        }
      }
    }
  );

  return recipientsData;
};
