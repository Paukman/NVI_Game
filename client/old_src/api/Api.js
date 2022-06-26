/* eslint class-methods-use-this: ["error", {"exceptMethods": ["getConfig"]}] */

import axios from "axios";

class Api {
  intercept401ApiResponse = error => {
    if (
      error?.response?.status === 401 &&
      error?.response?.config?.url.startsWith("/api")
    ) {
      window.location = `${window.location.origin}/expired`;
    }
    return Promise.reject(error);
  };

  constructor() {
    this.authenticated = new Promise(resolve => {
      this.authenticatedResolve = resolve;
    });

    axios.interceptors.response.use(
      response => response,
      this.intercept401ApiResponse
    );
  }

  // TODO improve this logic to fix ignored eslint exception on line 1
  getConfig(token) {
    return config => {
      const c = config;
      if (config.url.startsWith("/api")) {
        const timezoneoffset = -60 * new Date().getTimezoneOffset();
        c.headers[
          "x-rebank-user-agent"
        ] = `app:web|osversion:0.0.0|appversion:${window.envConfig.VERSION}|build:1|timezoneoffset:${timezoneoffset}`;

        c.headers.Authorization = `Bearer ${token}`;
      }
      return c;
    };
  }

  setToken(token, challenge) {
    axios.interceptors.request.use(this.getConfig(token));

    if (challenge) {
      this.challenge = challenge;
    }

    this.authenticatedResolve();
  }

  isAuthenticated() {
    return this.authenticated;
  }

  // provide convienence methods below to wait for authentication/token to be set before making network call
  async request(config) {
    await this.isAuthenticated();
    return axios.request(config);
  }

  async get(url, config) {
    await this.isAuthenticated();
    return axios.get(url, config);
  }

  async delete(url, config) {
    await this.isAuthenticated();
    return axios.delete(url, config);
  }

  async deleteWithData(url, data, config) {
    await this.isAuthenticated();
    return axios.delete(url, { ...config, data });
  }

  async head(url, config) {
    await this.isAuthenticated();
    return axios.head(url, config);
  }

  async options(url, config) {
    await this.isAuthenticated();
    return axios.options(url, config);
  }

  async post(url, data, config) {
    await this.isAuthenticated();
    return axios.post(url, data, config);
  }

  async put(url, data, config) {
    await this.isAuthenticated();
    return axios.put(url, data, config);
  }

  async patch(url, data, config) {
    await this.isAuthenticated();
    return axios.patch(url, data, config);
  }

  async getUri(config) {
    await this.isAuthenticated();
    return axios.getUri(config);
  }
}

const api = new Api();
export default api;
