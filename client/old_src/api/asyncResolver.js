export const MISSING_ARGUMENTS_ERROR = `asyncResolver accepts array of
functions(fn) and optional arguments args
[{
    fn:someFunction,
    args: "some args"
   }]
`;
export const NO_KEYS_ERROR = `the key fn must be a function`;

const isAsyncFunction = fn => {
  return fn.constructor.name === "AsyncFunction";
};
const isFunction = fn => {
  return typeof fn === "function";
};

const isArray = funcs => {
  if (!Array.isArray(funcs)) {
    throw MISSING_ARGUMENTS_ERROR;
  }
};

/**
 * @deprecated Replace with multiple `react-query` calls, which automatically handles multiple
 * async calls simultaneously out of the box.
 */
export const asyncResolver = async funcs => {
  const promises = {};
  const results = {};
  isArray(funcs);
  funcs.forEach(items => {
    const { fn, key } = items;
    if (!isFunction(items.fn)) {
      throw NO_KEYS_ERROR;
    }
    const args = items.args ? items.args : null;
    const isAsync = isAsyncFunction(fn);
    if (isAsync) {
      promises[key] = fn(args).catch(err => {
        results[key] = {
          result: null,
          error: err
        };
      });
    }
    if (!isAsync) {
      try {
        promises[key] = fn(args);
      } catch (E) {
        results[key] = {
          result: null,
          error: E
        };
      }
    }
  });
  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < Object.keys(promises).length; i += 1) {
    const promise = Object.keys(promises)[i];
    if (!results[promise]) {
      results[promise] = {
        result: null,
        error: null
      };
      try {
        results[promise].result = await promises[promise];
      } catch (error) {
        results[promise] = {
          result: null,
          error
        };
      }
    }
  }
  return results;
};
