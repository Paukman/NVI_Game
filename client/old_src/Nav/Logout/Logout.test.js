import React from "react";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";
import { useAuth0 } from "utils/auth0/Auth0Wrapper";
import Logout from "./index";

jest.mock("utils/auth0/Auth0Wrapper");

let component = null;

describe("Logout", () => {
  beforeEach(() => {
    component = document.createElement("div");
    document.body.appendChild(component);

    render(<Logout />, component);
  });

  afterEach(() => {
    unmountComponentAtNode(component);
    component.remove();
    component = null;
  });

  it(">> should wait for auth0 to be ready", async () => {
    const loginWithRedirect = jest.fn();
    useAuth0.mockReturnValue({
      loading: true,
      loginWithRedirect
    });

    await act(async () => {
      render(<Logout />, component);
    });

    expect(loginWithRedirect).not.toHaveBeenCalled();
  });

  it(">> should redirect on load", async () => {
    const loginWithRedirect = jest.fn();
    useAuth0.mockReturnValue({
      loading: false,
      loginWithRedirect
    });

    await act(async () => {
      render(<Logout />, component);
    });

    expect(loginWithRedirect).toHaveBeenCalled();
  });
});
