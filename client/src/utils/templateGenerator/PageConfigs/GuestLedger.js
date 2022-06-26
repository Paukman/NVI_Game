const { FILE_NAMES } = require('../config');

const config = {
  // all pages you want to create
  createPages: [
    FILE_NAMES.HOOK,
    FILE_NAMES.HOOK_INDEX,
    FILE_NAMES.CONSTANTS,
    FILE_NAMES.STYLED,
    FILE_NAMES.UTILS,
    FILE_NAMES.MAIN_PAGE,
    FILE_NAMES.MAIN_PAGE_INDEX,
  ],
  // only append to existing pages
  appendPages: [
    // FILE_NAMES.HOOK,
    // FILE_NAMES.HOOK_INDEX,
    // FILE_NAMES.CONSTANTS,
    // FILE_NAMES.STYLED,
    // FILE_NAMES.UTILS,
    // FILE_NAMES.MAIN_PAGE,
    // FILE_NAMES.MAIN_PAGE_INDEX,
  ],

  moduleName: 'GuestLedger',
  pageDirectory: 'GuestLedger',
  graphQL: {
    fileName: 'useGuestLedger',
    graphQLmethods: ['listGuestLedger'],
    listState: 'guestLedger',
  },
  modesName: 'Guest_Ledger_MODES',
  replacement: {
    hook: {
      globals: true,
      hotel: true,
      download: true,
      search: true,
      extraButton2: true, // one for filters
    },
    mainPage: {
      globals: true,
      hotel: true,
      download: true,
      search: true,
      modes: true,
      extraButton2: true,
    },
    constants: {
      periodSelector: false,
      modes: false,
    },
  },
  provider: {
    useProvider: false,
    providerName: 'GuestLedger',
  },
  drawer: {
    drawerConfig: null, // Point to the config file
  },
  addEdit: {
    name: 'GuestLedgerAddEdit',
    useAddEdit: false,
    editConfig: null, // Point to the config file
  },
};

module.exports = {
  config,
};
