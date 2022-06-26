// https://www.npmjs.com/package/node-cache
const NodeCache = require('node-cache');

// each cache key lives for a max of 30 minutes with this config
const cache = new NodeCache({ stdTTL: 1800 });
export default cache;
