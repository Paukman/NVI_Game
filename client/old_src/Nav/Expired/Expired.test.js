import React from "react";
import { render } from "@testing-library/react";
import { useAuth0 } from "utils/auth0/Auth0Wrapper";
import Expired from "./index";

jest.mock("utils/auth0/Auth0Wrapper");

describe("Expired", () => {
  it(">> should logout on load", async () => {
    const logout = jest.fn();
    useAuth0.mockReturnValue({
      logout
    });

    render(<Expired />);

    expect(logout).toHaveBeenCalledWith({
      returnTo: expect.stringContaining("loggedOutMessage=inactive")
    });
  });
});
