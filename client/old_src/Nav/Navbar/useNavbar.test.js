import { fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import React, { createRef } from "react";
import ReactRouter from "react-router";
import PropTypes from "prop-types";
import { RenderWithProviders } from "utils/TestUtils";
import * as useResponsive from "utils/hooks/useResponsive";
import useNavbar, { navLinkType } from "./useNavbar";

const Wrapper = (location = "/") => {
  const Component = ({ children }) => (
    <RenderWithProviders location={location}>{children}</RenderWithProviders>
  );
  Component.propTypes = {
    children: PropTypes.node.isRequired
  };
  return Component;
};

describe("useNavbar", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Should set and update activeNavLink based on current path", async () => {
    const router = jest.spyOn(ReactRouter, "useLocation");
    router.mockReturnValue({
      pathname: "/"
    });

    const ref = createRef();
    ref.current = document.body;

    let hook;
    await act(async () => {
      hook = renderHook(({ navRef }) => useNavbar(navRef), {
        initialProps: { navRef: ref },
        wrapper: Wrapper()
      });
    });

    const { result, rerender } = hook;

    const isOverview = result.current.isActiveNavLink(navLinkType.OVERVIEW);
    expect(isOverview).toBe(true);

    router.mockReturnValue({
      pathname: "/move-money/bill-payment/one-time"
    });
    rerender();
    const isMoveMoney = result.current.isActiveNavLink(navLinkType.MOVE_MONEY);
    expect(isMoveMoney).toBe(true);

    router.mockReturnValue({
      pathname: "/more/manage-contacts"
    });
    rerender();
    const isMore = result.current.isActiveNavLink(navLinkType.MORE);
    expect(isMore).toBe(true);
  });

  it("Should overwrite activeNavLink when subNav is open", async () => {
    const ref = createRef();
    ref.current = document.body;

    let hook;
    await act(async () => {
      hook = renderHook(({ navRef }) => useNavbar(navRef), {
        initialProps: { navRef: ref },
        wrapper: Wrapper()
      });
    });

    const { result } = hook;

    expect(result.current.isActiveNavLink(navLinkType.OVERVIEW)).toBe(true);

    expect(result.current.isOpenSubNav(navLinkType.MOVE_MONEY)).toBe(false);
    expect(result.current.isOpenSubNav(navLinkType.MORE)).toBe(false);

    act(() => {
      result.current.handleNavLinkClick(navLinkType.MORE);
    });

    expect(result.current.isOpenSubNav(navLinkType.MORE)).toBe(true);
    expect(result.current.isActiveNavLink(navLinkType.MORE)).toBe(true);
  });

  it("Should reset openSubNav when handleSubNavClose is called", async () => {
    const ref = createRef();
    ref.current = document.body;

    let hook;
    await act(async () => {
      hook = renderHook(({ navRef }) => useNavbar(navRef), {
        initialProps: { navRef: ref },
        wrapper: Wrapper()
      });
    });

    const { result } = hook;

    expect(result.current.isActiveNavLink(navLinkType.OVERVIEW)).toBe(true);

    expect(result.current.isOpenSubNav(navLinkType.MOVE_MONEY)).toBe(false);
    expect(result.current.isOpenSubNav(navLinkType.MORE)).toBe(false);

    act(() => {
      result.current.handleNavLinkClick(navLinkType.MORE);
    });

    expect(result.current.isOpenSubNav(navLinkType.MORE)).toBe(true);

    act(() => {
      result.current.handleSubNavClose(navLinkType.MORE);
    });

    expect(result.current.isOpenSubNav(navLinkType.MOVE_MONEY)).toBe(false);
    expect(result.current.isOpenSubNav(navLinkType.MORE)).toBe(false);
  });

  it("Should reset openSubNav when location.pathname changes", async () => {
    const router = jest.spyOn(ReactRouter, "useLocation");
    router.mockReturnValue({
      pathname: "/more"
    });

    const ref = createRef();
    ref.current = document.body;

    let hook;
    await act(async () => {
      hook = renderHook(({ navRef }) => useNavbar(navRef), {
        initialProps: { navRef: ref },
        wrapper: Wrapper()
      });
    });

    const { result, rerender } = hook;

    expect(result.current.isActiveNavLink(navLinkType.MORE)).toBe(true);
    expect(result.current.isOpenSubNav(navLinkType.MORE)).toBe(true);

    router.mockReturnValue({
      pathname: "/"
    });
    rerender();
    expect(result.current.isActiveNavLink(navLinkType.OVERVIEW)).toBe(true);

    expect(result.current.isOpenSubNav(navLinkType.MORE)).toBe(false);
    expect(result.current.isOpenSubNav(navLinkType.MOVE_MONEY)).toBe(false);
  });

  it("Should return openSubNav if one is open", async () => {
    const ref = createRef();
    ref.current = document.body;

    let hook;
    await act(async () => {
      hook = renderHook(({ navRef }) => useNavbar(navRef), {
        initialProps: { navRef: ref },
        wrapper: Wrapper("/move-money")
      });
    });

    const { result, rerender } = hook;

    expect(result.current.isActiveNavLink(navLinkType.MOVE_MONEY)).toBe(true);
    expect(result.current.isOpenSubNav(navLinkType.MORE)).toBe(false);

    // Open More subNavMenu
    act(() => {
      result.current.handleNavLinkClick(navLinkType.MORE);
    });

    rerender();
    expect(result.current.isOpenSubNav(navLinkType.MORE)).toBe(true);
  });

  it("Should return activeLink as openSubNav when no subNav is selected and screen is non-mobile size", async () => {
    jest.spyOn(useResponsive, "default").mockReturnValue({
      screenIsAtMost: () => false
    });

    const ref = createRef();
    ref.current = document.body;

    let hook;
    await act(async () => {
      hook = renderHook(({ navRef }) => useNavbar(navRef), {
        initialProps: { navRef: ref },
        wrapper: Wrapper("/move-money")
      });
    });

    const { result } = hook;

    expect(result.current.isActiveNavLink(navLinkType.MOVE_MONEY)).toBe(true);
    expect(result.current.isOpenSubNav(navLinkType.MOVE_MONEY)).toBe(true);
  });

  it("Should not return activeLink as openSubNav when no subNav is selected and screen is mobile size", async () => {
    jest.spyOn(useResponsive, "default").mockReturnValue({
      screenIsAtMost: () => true
    });

    const ref = createRef();
    ref.current = document.body;

    let hook;
    await act(async () => {
      hook = renderHook(({ navRef }) => useNavbar(navRef), {
        initialProps: { navRef: ref },
        wrapper: Wrapper("/move-money")
      });
    });

    const { result } = hook;

    expect(result.current.isActiveNavLink(navLinkType.MOVE_MONEY)).toBe(true);
    expect(result.current.isOpenSubNav(navLinkType.MOVE_MONEY)).toBe(false);
  });

  it("Should close any open sub nav when mouse leaves passed in ref", async () => {
    const ref = createRef();
    ref.current = document.body;

    let hook;
    await act(async () => {
      hook = renderHook(({ navRef }) => useNavbar(navRef), {
        initialProps: { navRef: ref },
        wrapper: Wrapper("/move-money")
      });
    });

    const { result, rerender, waitForNextUpdate } = hook;

    expect(result.current.isActiveNavLink(navLinkType.MOVE_MONEY)).toBe(true);
    expect(result.current.isOpenSubNav(navLinkType.MORE)).toBe(false);

    act(() => {
      result.current.handleNavLinkClick(navLinkType.MORE);
    });

    rerender();
    expect(result.current.isOpenSubNav(navLinkType.MORE)).toBe(true);

    await act(async () => {
      fireEvent(ref.current, new Event("mouseout"));
    });
    await waitForNextUpdate();

    expect(result.current.isOpenSubNav(navLinkType.MORE)).toBe(false);
  });
});
