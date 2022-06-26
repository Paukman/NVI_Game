import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import * as Jotai from "jotai";
import { accountsBaseUrl, featureToggleBaseUrl } from "api";
import { useAuth0 } from "utils/auth0/Auth0Wrapper";
import DataStore from "utils/store";
import { mockApiData } from "utils/TestUtils";
import Navbar from "./Navbar";

jest.mock("utils/auth0/Auth0Wrapper");

const renderComponent = (history = createMemoryHistory()) =>
  act(async () =>
    render(
      <Router history={history}>
        <Navbar />
      </Router>
    )
  );

describe("Navbar", () => {
  beforeEach(() => {
    DataStore.flush();
  });

  it(">> Should render navbar", async () => {
    await renderComponent();
    const { getByAltText, getByText } = screen;

    expect(getByAltText("ATB Logo")).toBeVisible();
    expect(getByText("Overview")).toBeVisible();
    expect(getByText("Move Money")).toBeVisible();
    expect(getByText("More")).toBeVisible();
    expect(getByAltText("Notification icon")).toBeVisible();
    expect(getByText("Log out")).toBeVisible();
  });

  it(">> Should go to `/` path when ATB logo is clicked", async () => {
    const history = createMemoryHistory({ initialEntries: ["/test-path"] });

    await renderComponent(history);

    const { getByAltText } = screen;

    expect(history.location.pathname).toBe("/test-path");

    const logoLink = getByAltText("ATB Logo");
    fireEvent.click(logoLink);

    expect(history.location.pathname).toBe("/");
  });
  it(">> Should go to `/` path when Overview is clicked", async () => {
    const history = createMemoryHistory({ initialEntries: ["/test-path"] });

    await renderComponent(history);

    const { getByText } = screen;

    expect(history.location.pathname).toBe("/test-path");

    const overviewLink = getByText("Overview");
    fireEvent.click(overviewLink);

    expect(history.location.pathname).toBe("/");
  });

  it(">> Should show Move Money SubNav when Move Money button is clicked", async () => {
    await renderComponent();
    const { getByText, getByRole } = screen;

    const moveMoneyButton = getByText("Move Money");
    fireEvent.click(moveMoneyButton);

    const eTransferLink = getByRole("link", { name: /Interac e-Transfer ®/ });

    expect(eTransferLink).toBeVisible();
    expect(getByText("Pay a bill")).toBeVisible();
    expect(getByText("Transfer between accounts")).toBeVisible();
  });

  it(">> Should show More SubNav when More button is clicked", async () => {
    await renderComponent();
    const { getByText, getByRole } = screen;

    const moreButton = getByText("More");
    fireEvent.click(moreButton);

    const interactPreferenceLink = getByRole("link", {
      name: /Interac ® preferences/
    });

    expect(getByText("Manage contacts")).toBeVisible();
    expect(interactPreferenceLink).toBeVisible();
    expect(getByText("Contact us")).toBeVisible();
    expect(getByText("Privacy & security")).toBeVisible();
  });

  it(">> Should display the version number when feature flagged is enabled", async () => {
    mockApiData([
      {
        url: `${featureToggleBaseUrl}/dev-rebank-web-version-toggle`,
        results: {
          status: true
        }
      }
    ]);

    await renderComponent();
    const { findByText } = screen;

    const appVersion = await findByText("0.0.0");
    expect(appVersion).toBeVisible();
  });

  it(">> Should not display the version number when feature flagged is disabled", async () => {
    mockApiData([
      {
        url: `${featureToggleBaseUrl}/dev-rebank-web-version-toggle`,
        results: {
          status: false
        }
      }
    ]);
    await renderComponent();
    const { queryByText } = screen;

    const appVersion = queryByText("0.0.0");
    expect(appVersion).not.toBeInTheDocument();
  });

  it(">> Should display the account holder's name", async () => {
    mockApiData([
      {
        url: `${accountsBaseUrl}/accountHolderName`,
        results: {
          retailName: { firstName: "Sam", lastName: "Wilson" }
        }
      }
    ]);
    await renderComponent();
    const { findByText } = screen;

    const holderName = await findByText("Sam");
    expect(holderName).toBeVisible();
  });

  it(">> Should open notification draw when notification bell is clicked", async () => {
    const setDrawerVisible = jest.fn();
    jest.spyOn(Jotai, "useAtom").mockReturnValue([null, setDrawerVisible]);

    await renderComponent();
    const { findByAltText } = screen;

    const notificationBell = await findByAltText("Notification icon");
    fireEvent.click(notificationBell);

    expect(setDrawerVisible).toBeCalledWith(true);
  });

  it(">> Should show number of notifications draw on bell", async () => {
    jest.spyOn(Jotai, "useAtom").mockReturnValue(["9"]);

    await renderComponent();
    const { findByText } = screen;

    const unreadCount = await findByText("9");
    expect(unreadCount).toBeVisible();
  });

  it(">> Should log out user when log out button is clicked", async () => {
    const logout = jest.fn();
    useAuth0.mockReturnValue({
      logout
    });

    await renderComponent();
    const { getByText } = screen;

    const logoutButton = getByText("Log out");
    fireEvent.click(logoutButton);

    expect(logout).toBeCalledWith({
      returnTo: `${window.location.origin}/logout?loggedOutMessage=manual`
    });
  });
});
