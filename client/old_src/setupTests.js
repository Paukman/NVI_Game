/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import React from "react";
import { render, wait, cleanup, fireEvent, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { setLogger } from "react-query";
import "@testing-library/jest-dom";

// TODO - retire enzyme - where is this still used?
import Enzyme, { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as Auth0Hook from "utils/auth0/Auth0Wrapper";

configure({ adapter: new Adapter() });

export { shallow, mount };
export default Enzyme;

jest.mock("api/Api");
jest.mock("utils/auth0/Auth0Wrapper");
jest.mock("mixpanel-browser");

beforeAll(() => {
  // react
  global.React = React;

  // auth0
  Auth0Hook.useAuth0.mockImplementation(() => {
    return {
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
      user: { name: "The Dood" }
    };
  });

  // environment config settings
  global.window.envConfig = {
    VERSION: "0.0.0",
    ENV: "test"
  };

  // RSA library mock values
  global.RSA_DEVICE = "mockDevicePrint";
  global.RSA_GET_GEO_LOCATION = () => {
    return "mockGeoLocation";
  };

  // mock scrollTo
  global.window.scrollTo = jest.fn();
  global.window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }));
  global.window.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: () => null,
    unobserve: () => null
  }));

  global.useAuth0Mock = Auth0Hook.useAuth0;

  // @testing-library/react
  global.render = render;
  global.wait = wait;
  global.cleanup = cleanup;
  global.act = act;
  global.fireEvent = fireEvent;

  // @testing-library/react-hooks
  global.renderHook = renderHook;
});

afterAll(() => {
  cleanup();
});

// silence react-query errors
setLogger({
  // eslint-disable-next-line no-console
  log: console.log,
  // eslint-disable-next-line no-console
  warn: console.warn,
  error: () => {}
});
