// This dev configuration file for running locally, should be ignored for lint/coverage
/* istanbul ignore file */
/* eslint-disable */

const proxy = require("http-proxy-middleware");
let debug = true;

module.exports = function setupProxy(app) {
  const getTarget = (endpoint, target) => {
    //The feature toggle API has an optional flag to let it know
    //this request is coming from our "local" environment vs a preprod request
    //this allows feature flags to be separate for "local", "preprod" and "prod"
    if (endpoint === "atb-rebank-api-feature-toggle") {
      target += "/local";
    }

    return target;
  };

  const preprod = endpoint => {
    return getTarget(endpoint, `https://${endpoint}.rebank.gcp.atb.com`);
  };

  const local = port => {
    port = port ? port : 3001;

    return endpoint => {
      return getTarget(endpoint, `http://localhost:${port}`);
    };
  };

  const review = tag => {
    return endpoint => {
      return getTarget(
        endpoint,
        `https://${endpoint}-${tag}-review.rebank.gcp.atb.com`
      );
    };
  };

  // Define all the endpoints and the environment that they proxy to
  // by default everything goes to `qa`, to use local apis `local(port)`
  //
  // For example, if you want use your local accounts-ts running on port 3001:
  //   "atb-rebank-api-accounts-ts": local(3001),
  //
  // To use a gitlab review environment use `review("tag")` the tag can be found on
  // the review step within the API's pipeline review step, example:
  // "atb-rebank-api-feature-toggle": review("2566d151")
  const apis = {
    "atb-rebank-api-accounts-ts": preprod, // local(3001)
    "atb-rebank-api-billpayments": preprod,
    "atb-rebank-api-etransfers": preprod,
    "atb-rebank-api-failedtransactions": preprod,
    "atb-rebank-api-feature-toggle": preprod,
    "atb-rebank-api-mfa": preprod,
    "atb-rebank-api-preferences": preprod,
    "atb-rebank-api-transfers": preprod,
    "atb-rebank-api-userprofiles": preprod,
    "atb-rebank-api-globaltransfers": preprod
  };

  // Setup a proxy rewrite url for each api that will rewrite as follows:
  // ${accountsBaseUrl}/someEndpoint -> https:/${accountsBaseUrl}.qa.retail.atb.com/someEndpoint
  const endpoints = Object.keys(apis);
  endpoints.forEach(endpoint => {
    const path = `/api/${endpoint}`;
    const target = apis[endpoint](endpoint);
    const rewritePattern = `^/api/${endpoint}`;
    const pathRewrite = {};
    pathRewrite[rewritePattern] = "";

    const proxyOptions = {
      target,
      pathRewrite,
      changeOrigin: true,
      secure: false,
      logLevel: "info",
      onError: (err, req, res) => {
        if (debug) {
          console.log("err is:", err);
        }
      },
      onProxyRes: function onProxyRes(proxyRes, req, res) {
        // Log outbound request to remote target
        if (debug) {
          console.log(
            "-->  ",
            req.method,
            req.path,
            "--> ",
            proxyRes.statusCode,
            ": ",
            proxyRes.statusMessage
          );
          //this will output the full payload
          //TODO: detect gzip and uncompress vs spitting out noise
          // let body = "";
          // proxyRes.on("data", data => {
          //   data = data.toString("utf-8");
          //   body += data;
          // });
          // proxyRes.on("end", () => {
          //   console.log("body:", body);
          // });
        }
      }
    };

    app.use(proxy(path, proxyOptions));
  });
};
