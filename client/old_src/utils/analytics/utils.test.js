import mixpanel from "mixpanel-browser";
import {
  getCurrentPathEvent,
  startTrackingNewLocation,
  trackSecondaryToTertiaryLocation,
  getSecondaryMenuTag,
  PAGE_TRACKING
} from "./utils";
import * as analytics from "./analytics";

describe("Testing getCurrentPathEvent", () => {
  it(">> should return properly", () => {
    let res = getCurrentPathEvent("");
    expect(res).toEqual(null);
    res = getCurrentPathEvent(null);
    expect(res).toEqual(null);
    res = getCurrentPathEvent(undefined);
    expect(res).toEqual(null);

    res = getCurrentPathEvent("/unknown path");
    expect(res).toEqual(null);

    res = getCurrentPathEvent("/more/contact-us");
    expect(res).toMatchObject({ event: "Contact us", type: "Secondary Menu" });
    res = getCurrentPathEvent("/more/interac-preferences/autodeposit");
    expect(res).toMatchObject({ event: "Autodeposit", type: "Tertiary Menu" });
    res = getCurrentPathEvent("/move-money/send-money");
    expect(res).toMatchObject({ event: "Send money", type: "Tertiary Menu" });
    res = getCurrentPathEvent("/");
    expect(res).toMatchObject({ event: "Overview", type: "Primary Menu" });
    res = getCurrentPathEvent("overview");
    expect(res).toMatchObject({ event: "Overview", type: "Primary Menu" });
    res = getCurrentPathEvent("Interac e-Transfer");
    expect(res).toMatchObject({
      event: "Interac e-Transfer",
      type: "Secondary Menu"
    });
    res = getCurrentPathEvent("more");
    expect(res).toMatchObject({ event: "More", type: "Primary Menu" });
  });
});

describe("Testing startTrackingNewLocation", () => {
  beforeEach(() => {
    mixpanel.track.mockClear();
  });

  it(">> should track event for proper arguments", () => {
    const setPrevLocation = jest.fn();

    analytics.init();
    startTrackingNewLocation({
      locationPathname: "/more/contact-us",
      prevLocation: "more",
      setPrevLocation
    });

    expect(setPrevLocation).toBeCalledTimes(1);
    expect(setPrevLocation).toBeCalledWith("/more/contact-us");
    expect(mixpanel.track).toHaveBeenCalledWith(PAGE_TRACKING, {
      navigationSelection: "Contact us",
      navigationType: "Secondary Menu",
      previousPage: "More",
      isBeta: false
    });

    startTrackingNewLocation({
      locationPathname: "/more/contact-us",
      prevLocation: "more",
      setPrevLocation,
      type: "Some crazy type"
    });
    expect(mixpanel.track).toHaveBeenCalledWith(PAGE_TRACKING, {
      navigationSelection: "Contact us",
      navigationType: "Some crazy type",
      previousPage: "More",
      isBeta: false
    });
  });

  it(">> should not track event for the same path", () => {
    const setPrevLocation = jest.fn();
    analytics.init();
    startTrackingNewLocation({
      locationPathname: "more",
      prevLocation: "more",
      setPrevLocation
    });

    expect(mixpanel.track).toHaveBeenCalledTimes(0);
    expect(setPrevLocation).toBeCalledTimes(1);
    expect(setPrevLocation).toBeCalledWith("more");
  });

  it(">> should not track event for the wrong path", () => {
    const setPrevLocation = jest.fn();
    analytics.init();
    startTrackingNewLocation({
      locationPathname: "more",
      prevLocation: "moredd",
      setPrevLocation
    });
    expect(mixpanel.track).toHaveBeenCalledTimes(0);
    expect(setPrevLocation).toBeCalledTimes(1);
    expect(setPrevLocation).toBeCalledWith("more");
  });

  it(">> should not track event for the wrong path nor set previous location", () => {
    const setPrevLocation = jest.fn();
    analytics.init();
    startTrackingNewLocation({
      locationPathname: "wrong path",
      prevLocation: "wrong path",
      setPrevLocation
    });
    expect(mixpanel.track).toHaveBeenCalledTimes(0);
    expect(setPrevLocation).toBeCalledTimes(0);
  });
});

describe("Testing trackSecondaryToTertiaryLocation", () => {
  beforeEach(() => {
    mixpanel.track.mockClear();
  });

  it(">> should track 2 event for proper arguments", () => {
    const setPrevLocation = jest.fn();

    analytics.init();

    trackSecondaryToTertiaryLocation({
      locationPathname: "/more/manage-contacts/recipients",
      navLocation: "Manage contacts",
      prevLocation: "more",
      setPrevLocation
    });

    expect(setPrevLocation).toBeCalledTimes(2);
    expect(setPrevLocation).toHaveBeenNthCalledWith(1, "Manage contacts");
    expect(setPrevLocation).toHaveBeenNthCalledWith(
      2,
      "/more/manage-contacts/recipients"
    );
    expect(mixpanel.track).toHaveBeenCalledTimes(2);
    expect(mixpanel.track).toHaveBeenNthCalledWith(1, PAGE_TRACKING, {
      navigationSelection: "Manage contacts",
      navigationType: "Secondary Menu",
      previousPage: "More",
      isBeta: false
    });
    expect(mixpanel.track).toHaveBeenNthCalledWith(2, PAGE_TRACKING, {
      navigationSelection: "Recipients",
      navigationType: "Tertiary Menu",
      previousPage: "Manage contacts",
      isBeta: false
    });
  });
});

describe("Testing getSecondaryMenuTag", () => {
  it(">> should return proper menu tag", () => {
    let res = getSecondaryMenuTag(null, null);
    expect(res).toEqual(null);
    res = getSecondaryMenuTag(undefined, null);
    expect(res).toEqual(null);
    res = getSecondaryMenuTag("", "");
    expect(res).toEqual(null);

    res = getSecondaryMenuTag(
      "Manage contacts",
      "/more/interac-preferences/profile/view-profile"
    );
    expect(res).toEqual("Interac references");

    res = getSecondaryMenuTag("Manage contacts", "/move-money/send-money");
    expect(res).toEqual("Interac e-Transfer");

    res = getSecondaryMenuTag("Manage contacts", "Some url");
    expect(res).toEqual("Manage contacts");
    res = getSecondaryMenuTag("Pay a bill", "Some url");
    expect(res).toEqual("Pay a bill");
    res = getSecondaryMenuTag("Transfer between accounts", "Some url");
    expect(res).toEqual("Transfer between accounts");
    res = getSecondaryMenuTag("Contact us", "Some url");
    expect(res).toEqual(null);
  });
});
