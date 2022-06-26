import api from "api";
import DataStore, { DEFAULT_TTL } from "utils/store";

/**
 * @deprecated Replace with `react-query`, which automatically caches and refreshes server data.
 * This will replace our own `DataStore`
 */
export const manualApiFetch = async (url, key, ttl = DEFAULT_TTL) => {
  if (!key || key === url) {
    throw new Error(
      "Key is required argument and cannot be the same as the URL argument"
    );
  }
  const cachedData = DataStore.get(key);
  if (cachedData) {
    return cachedData;
  }

  try {
    const res = await api.get(url);
    if (res && res.data) {
      DataStore.put(key, res.data, ttl);
      const cache = DataStore.get(key);
      return cache;
    }
    return null;
  } catch (error) {
    throw error;
  }
};
