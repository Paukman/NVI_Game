import mixpanel from "mixpanel-browser";

export const PAGE_TRACKING = "Page View";

export const TYPE = {
  QUICK_ACTION: "Quick Action",
  PRIMARY_MENU: "Primary Menu",
  SECONDARY_MENU: "Secondary Menu",
  TERTIARY_MENU: "Tertiary Menu"
};

export const appPaths = [
  {
    event: "More",
    navItem: ["more"],
    type: TYPE.PRIMARY_MENU
  },
  {
    event: "Move money",
    navItem: ["move-money"],
    type: TYPE.PRIMARY_MENU
  },
  {
    event: "Manage contacts",
    navItem: ["Manage contacts"],
    type: TYPE.SECONDARY_MENU
  },
  {
    event: "Interac references",
    navItem: ["Interac references"],
    type: TYPE.SECONDARY_MENU
  },
  {
    event: "Interac e-Transfer",
    navItem: ["Interac e-Transfer"],
    type: TYPE.SECONDARY_MENU
  },
  {
    event: "Pay a bill",
    navItem: ["Pay a bill"],
    type: TYPE.SECONDARY_MENU
  },
  {
    event: "Transfer between accounts",
    navItem: ["Transfer between accounts"],
    type: TYPE.SECONDARY_MENU
  },
  {
    event: "Overview",
    exactPath: ["/", "overview"],
    type: TYPE.PRIMARY_MENU
  },

  {
    event: "Account details",
    pathStartsWith: ["/details"],
    type: TYPE.PRIMARY_MENU
  },

  {
    event: "Send money",
    pathStartsWith: ["/move-money/send-money"],
    type: TYPE.TERTIARY_MENU
  },
  {
    event: "Request money",
    pathStartsWith: ["/move-money/request-money"],
    type: TYPE.TERTIARY_MENU
  },
  {
    event: "Transfer History",
    pathStartsWith: ["/move-money/etransfer-history"],
    type: TYPE.TERTIARY_MENU
  },

  {
    event: "One-time payment",
    pathStartsWith: ["/move-money/bill-payment/one-time"],
    type: TYPE.TERTIARY_MENU
  },
  {
    event: "Recurring payment",
    pathStartsWith: ["/move-money/bill-payment/recurring"],
    type: TYPE.TERTIARY_MENU
  },
  {
    event: "Scheduled payments",
    pathStartsWith: ["/move-money/bill-payment/scheduled-payments"],
    type: TYPE.TERTIARY_MENU
  },

  {
    event: "One-time transfer",
    pathStartsWith: ["/move-money/transfer-between-accounts/one-time"],
    type: TYPE.TERTIARY_MENU
  },
  {
    event: "Recurring transfer",
    pathStartsWith: ["/move-money/transfer-between-accounts/recurring"],
    type: TYPE.TERTIARY_MENU
  },
  {
    event: "Scheduled transfers",
    pathStartsWith: [
      "/move-money/transfer-between-accounts/scheduled-transfers"
    ],
    type: TYPE.TERTIARY_MENU
  },

  {
    event: "Recipients",
    pathStartsWith: ["/more/manage-contacts/recipients"],
    type: TYPE.TERTIARY_MENU
  },
  {
    event: "Payees",
    pathStartsWith: ["/more/manage-contacts/payees"],
    type: TYPE.TERTIARY_MENU
  },

  {
    event: "Profile",
    pathStartsWith: ["/more/interac-preferences/profile"],
    type: TYPE.TERTIARY_MENU
  },
  {
    event: "Autodeposit",
    pathStartsWith: ["/more/interac-preferences/autodeposit"],
    type: TYPE.TERTIARY_MENU
  },

  {
    event: "Contact us",
    exactPath: ["/more/contact-us"],
    type: TYPE.SECONDARY_MENU
  },
  {
    event: "Privacy & security",
    exactPath: ["/more/privacy-and-security"],
    type: TYPE.SECONDARY_MENU
  }
];

export const getCurrentPathEvent = path => {
  if (!path) {
    return null;
  }

  const eventItem = appPaths.find(item => {
    if (item.navItem?.find(element => element === path)) return true;
    if (item.exactPath?.find(element => element === path)) return true;
    if (item.pathStartsWith?.find(element => path.startsWith(element)))
      return true;
    return false;
  });

  if (eventItem) {
    return { event: eventItem.event, type: eventItem.type };
  }
  return null;
};

export const startTrackingNewLocation = ({
  locationPathname,
  prevLocation,
  setPrevLocation,
  type
}) => {
  const navigationSelection = getCurrentPathEvent(locationPathname);
  const previousSelection = getCurrentPathEvent(prevLocation);

  if (
    navigationSelection &&
    previousSelection &&
    navigationSelection.event !== previousSelection.event
  ) {
    const navigationType = type || navigationSelection.type;

    mixpanel.track(PAGE_TRACKING, {
      isBeta: false,
      previousPage: previousSelection.event,
      navigationSelection: navigationSelection.event,
      navigationType
    });
    mixpanel.time_event(PAGE_TRACKING);
  }
  if (navigationSelection) {
    setPrevLocation(locationPathname);
  }
};

export const trackSecondaryToTertiaryLocation = ({
  locationPathname,
  navLocation,
  prevLocation,
  setPrevLocation
}) => {
  startTrackingNewLocation({
    locationPathname: navLocation,
    prevLocation,
    setPrevLocation
  });
  startTrackingNewLocation({
    locationPathname,
    prevLocation: navLocation,
    setPrevLocation
  });
};

export const getSecondaryMenuTag = (content, url) => {
  if (url === "/more/interac-preferences/profile/view-profile") {
    return "Interac references";
  }
  if (url === "/move-money/send-money") {
    return "Interac e-Transfer";
  }
  if (
    content === "Manage contacts" ||
    content === "Pay a bill" ||
    content === "Transfer between accounts"
  ) {
    // contact us and privacy and security is handled by path change
    return content;
  }
  return null;
};
