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
    //FILE_NAMES.MAIN_PAGE_INDEX,
  ],
  // only append to existing pages
  appendPages: [
    // FILE_NAMES.HOOK,
    // FILE_NAMES.HOOK_INDEX,
    // FILE_NAMES.CONSTANTS,
    // FILE_NAMES.STYLED,
    // FILE_NAMES.UTILS,
    // FILE_NAMES.MAIN_PAGE,
    FILE_NAMES.MAIN_PAGE_INDEX,
  ],
  moduleName: 'AccountMappingSales',
  pageDirectory: 'AccountMapping',
  graphQL: {
    fileName: 'useARMapping',
    graphQLmethods: ['accountMappingSales', 'accountMappingSalesGet', 'accountMappingSalesRemove', 'accountMappingSalesUpdate'],
  },
  replacement: {
    hook: {
      globals: true,
      hotel: true,
      download: true,
      upload: false,
      add: true,
      remove: true,
      search: true,
      edit: true,
      modes: true,
      extraButton1: false, // one for copy
      extraButton2: false, // one for filters
      drawer: false,
    },
    mainPage: {
      globals: true,
      hotel: true,
      download: true,
      upload: false,
      add: true,
      remove: true,
      search: true,
      edit: true,
      modes: true,
      drawer: false,
      extraButton1: false,
      extraButton2: false,
    },
    constants: {
      periodSelector: false,
      modes: true,
    },
  },
  provider: {
    useProvider: false,
    providerName: 'AccountMappingSales',
  },
  drawer: {
    drawerConfig: null, // Point to the config file
  },
  addEdit: {
    name: 'AccountMappingSalesAddEdit',
    useAddEdit: false,
    editConfig: null, // Point to the config file
  },
  hook: {
    globals: true,
    order: true,
  },
  mainPage: {
    property: true,
    groups: true,
    search: true,
    goButton: true,
    downloadButton: true,
    portfolio: false,
    date: false,
    fromDate: false,
    toDate: false,
    uploadButton: false,
    addEditButton: false,      
  },
};

module.exports = {
  config,
};
  