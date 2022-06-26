import api from "api";
import DataStore from "utils/store";

/**
 * @deprecated Replace with `react-query`, which automatically caches and refreshes server data.
 * This will replace our own `DataStore`
 */
export const manualApiSend = async ({
  // TODO - rename to method to match api util
  verb = "POST",
  url = null,
  data = {},
  config = {},
  keys = []
}) => {
  if (!url) {
    throw new Error("URL is required argument");
  }
  if (Array.isArray(keys)) {
    keys.forEach(key => {
      DataStore.del(key);
    });
  }
  if (!Array.isArray(keys) && keys && keys.length) {
    DataStore.del(keys);
  }
  try {
    switch (verb) {
      case "POST": {
        const result = await api.post(url, data, config);
        return result;
      }
      case "PUT": {
        const result = await api.put(url, data, config);
        return result;
      }
      case "PATCH": {
        const result = await api.patch(url, data, config);
        return result;
      }
      case "DELETE": {
        const result = await api.delete(url, config);
        return result;
      }
      case "DELETEWITHDATA": {
        const result = await api.deleteWithData(url, data, config);
        return result;
      }
      default: {
        const result = await api.post(url, data, config);
        return result;
      }
    }
  } catch (error) {
    throw error;
  }
};
