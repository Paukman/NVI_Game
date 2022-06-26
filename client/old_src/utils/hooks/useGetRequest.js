import { useEffect, useState } from "react";
import useIsMounted from "utils/hooks/useIsMounted";
import api from "api";
import DataStore, { DEFAULT_TTL } from "utils/store";

/**
 * @deprecated use utils/api class instead
 */
const useGetRequest = (url, key, ttl = DEFAULT_TTL) => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
    data: null,
    fromCache: false
  });
  const isMounted = useIsMounted();

  useEffect(() => {
    const getData = async () => {
      if (!key || key === url) {
        throw new Error(
          "Key is required argument and cannot be the same as the URL argument"
        );
      }
      const cachedData = DataStore.get(key);
      if (cachedData) {
        setResponse(state => {
          return {
            ...state,
            data: cachedData,
            fromCache: true
          };
        });
        return;
      }
      if (isMounted()) {
        setResponse(state => {
          return {
            ...state,
            loading: true
          };
        });
      }
      try {
        const res = await api.get(url);
        if (isMounted()) {
          DataStore.put(key, res.data, ttl);
          const cache = DataStore.get(key);
          setResponse(state => {
            return {
              ...state,
              data: cache,
              loading: false
            };
          });
        }
      } catch (error) {
        if (isMounted()) {
          setResponse(state => {
            return {
              ...state,
              error
            };
          });
        }
      }
    };
    getData();
  }, [url, key, ttl, isMounted]);
  return { response };
};

export default useGetRequest;
