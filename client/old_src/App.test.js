import React, { Suspense } from "react";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { render, waitFor } from "@testing-library/react";
import { AntModalContext } from "StyleGuide/Components/Modal";
import { mockApiData, windowMatchMediaMock } from "utils/TestUtils";
import PageNotFound from "Nav/PageNotFound";
import App, { Header } from "./App";

describe("App", () => {
  let wrapper = null;
  window.scrollTo = jest.fn();

  beforeEach(async () => {
    windowMatchMediaMock();

    mockApiData([
      {
        url:
          "/api/atb-rebank-api-feature-toggle/isEnabled/dev-rebank-web-version-toggle",
        results: {
          status: true
        }
      }
    ]);
    await act(async () => {
      wrapper = render(
        <Suspense fallback="Loading">
          <MemoryRouter initialEntries={["overview"]}>
            <AntModalContext.Provider
              value={{ close: () => null, show: () => null, antModal: null }}
            >
              <App />
            </AntModalContext.Provider>
          </MemoryRouter>
        </Suspense>
      );
    });
  });

  afterEach(() => {
    wrapper = null;
    jest.clearAllMocks();
  });

  it(">> should loginWithRedirect when not authenticated", async () => {
    const loginWithRedirect = jest.fn();
    global.useAuth0Mock.mockImplementation(() => {
      return {
        isAuthenticated: false,
        loginWithRedirect,
        logout: jest.fn()
      };
    });

    await act(async () => {
      render(<App />, wrapper);
    });

    expect(loginWithRedirect.mock.calls.length).toBe(1);
  });

  it(">> should render PageNotFound for unknown route", () => {
    render(<PageNotFound />, wrapper);

    expect(wrapper.container.querySelector(".message").textContent).toEqual(
      "This Page Not Found"
    );
  });

  it(">> should render Header by default if authenticated", async () => {
    const { container } = render(<Header isAuth match={{ url: "/" }} />, {
      wrapper: MemoryRouter
    });

    await waitFor(() =>
      expect(container.querySelector(".main-nav")).toBeInTheDocument()
    );
  });

  it(">> should not render Header if not authenticated", async () => {
    const { container } = render(
      <Header isAuth={false} match={{ url: "/" }} />,
      { wrapper: MemoryRouter }
    );

    await waitFor(() =>
      expect(container.querySelector(".main-nav")).not.toBeInTheDocument()
    );
  });

  it(">> should not render Header for /loginChallenge route", async () => {
    const { container } = render(
      <Header isAuth match={{ url: "/loginChallenge" }} />,
      { wrapper: MemoryRouter }
    );

    await waitFor(() =>
      expect(container.querySelector(".main-nav")).not.toBeInTheDocument()
    );
  });

  // TODO need a test for the AccountsOverview route
});
