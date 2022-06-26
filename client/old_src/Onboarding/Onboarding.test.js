import { act, fireEvent, render, screen } from "@testing-library/react";
import { mockApiData, renderWithAtom, resetAtoms } from "utils/TestUtils";
import Api, { preferencesUrl } from "api";
import { resetAllWhenMocks } from "jest-when";
import React from "react";

import Onboarding from "./Onboarding";

import {
  showOnboardingAtom,
  hasFetchedOnboardingAtom
} from "./useToggleOnboarding";

const renderComponent = () => act(async () => render(<Onboarding />));

describe("Onboarding - test onboarding carousel", () => {
  afterEach(() => {
    resetAtoms(showOnboardingAtom, hasFetchedOnboardingAtom);
    resetAllWhenMocks();
  });

  it(">> Should render onboarding carousel when webOnboardingSeen preference is false", async () => {
    mockApiData([
      {
        url: `${preferencesUrl}/preferences`,
        method: "GET",
        results: { webOnboardingSeen: false }
      }
    ]);
    await renderComponent();
    const { getByAltText, getByRole } = screen;

    const firstCarouselItemTitle = getByRole("heading", { hidden: false });
    const closeButton = getByAltText("Close icon");

    expect(firstCarouselItemTitle).toHaveTextContent(
      "Faster, more reliable banking."
    );
    expect(firstCarouselItemTitle).toBeVisible();
    expect(closeButton).toBeVisible();
  });

  it(">> Should not render onboarding carousel when webOnboardingSeen preference is true", async () => {
    mockApiData([
      {
        url: `${preferencesUrl}/preferences`,
        method: "GET",
        results: { webOnboardingSeen: true }
      }
    ]);
    await renderComponent();
    const { queryByRole, queryByAltText } = screen;

    const firstCarouselItemTitle = queryByRole("heading", { hidden: false });
    const closeButton = queryByAltText("Close icon");

    expect(firstCarouselItemTitle).not.toBeInTheDocument();
    expect(closeButton).not.toBeInTheDocument();
  });

  it(">> Should not render onboarding carousel when API GET preferences fails", async () => {
    mockApiData([
      {
        url: `${preferencesUrl}/preferences`,
        method: "GET",
        status: 500,
        results: null,
        error: "Error!"
      }
    ]);
    await renderComponent();
    const { queryByRole, queryByAltText } = screen;

    const firstCarouselItemTitle = queryByRole("heading", { hidden: false });
    const closeButton = queryByAltText("Close icon");

    expect(firstCarouselItemTitle).not.toBeInTheDocument();
    expect(closeButton).not.toBeInTheDocument();
  });

  it(">> Should hide onboarding carousel when close button is clicked", async () => {
    mockApiData([
      {
        url: `${preferencesUrl}/preferences`,
        method: "GET",
        results: { webOnboardingSeen: false }
      }
    ]);
    await renderComponent();
    const { getByAltText, getByRole } = screen;

    const firstCarouselItemTitle = getByRole("heading", { hidden: false });
    expect(firstCarouselItemTitle).toHaveTextContent(
      "Faster, more reliable banking."
    );
    const closeButton = getByAltText("Close icon");

    fireEvent.click(closeButton);

    expect(firstCarouselItemTitle).not.toBeInTheDocument();
    expect(closeButton).not.toBeInTheDocument();
  });

  it(">> Should hide onboarding carousel when close button is clicked and API PUT call fails", async () => {
    mockApiData([
      {
        url: `${preferencesUrl}/preferences`,
        method: "GET",
        results: { webOnboardingSeen: false }
      },
      {
        url: `${preferencesUrl}/preferences`,
        method: "PUT",
        status: 500,
        results: null,
        error: "Error!"
      }
    ]);
    await renderComponent();
    const { getByAltText, getByRole } = screen;

    const firstCarouselItemTitle = getByRole("heading", { hidden: false });
    expect(firstCarouselItemTitle).toHaveTextContent(
      "Faster, more reliable banking."
    );
    const closeButton = getByAltText("Close icon");

    fireEvent.click(closeButton);

    expect(firstCarouselItemTitle).not.toBeInTheDocument();
    expect(closeButton).not.toBeInTheDocument();
  });

  it(">> Should not fetch preferences if fetched once already", async () => {
    await renderWithAtom(<Onboarding />, {
      atom: hasFetchedOnboardingAtom,
      initialState: true // Assume we have fetched once already.
    });

    const spiedGet = jest.fn();
    jest.spyOn(Api, "get").mockImplementation(spiedGet);

    expect(spiedGet).not.toBeCalled();
  });
});
