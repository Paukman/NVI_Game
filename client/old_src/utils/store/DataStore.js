export const DEFAULT_TTL = 3600 * 1000; // default expiry is set to one hour

/**
 * @deprecated Replace with `react-query`, which automatically caches and refreshes server data.
 */
const InMemoryCache = () => {
  let state = {};

  const get = key => {
    const now = new Date();
    const data = state[key];
    if (!data) {
      return null;
    }
    if (now.getTime() > data.expiry) {
      delete state[key];
      return null;
    }
    return data;
  };
  const del = key => delete state[key];

  const put = (key, value, ttl = DEFAULT_TTL) => {
    state[key] = value;
    const date = new Date();
    if (date.getTime() > state[key].expiry) {
      del(key);
      return null;
    }
    const withTTL = {
      value,
      expiry: date.getTime() + ttl
    };
    state[key] = withTTL;
    return state;
  };

  const getAll = () => state;
  const flush = () => {
    state = {};
  };

  return {
    get,
    put,
    del,
    getAll,
    flush
  };
};

/**
 * @deprecated Replace with `react-query`, which automatically caches and refreshes server data.
 */
export default InMemoryCache();
