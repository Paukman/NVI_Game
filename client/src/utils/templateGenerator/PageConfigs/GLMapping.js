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

  moduleName: 'HmgGlCodesMapping',
  pageDirectory: 'HmgGlCodes',
  graphQL: {
    fileName: 'useHmgGlCodes',
    graphQLmethods: [
      'listHmgGlCodes',
      'hmgGlCodeListMdoStatus',
      'removeHmgGlCode',
      'mapHmgGlCode',
      'setHmgGlCodeStatus',
      'setHmgGlCodeStatusAll',
      'loading',
      'mdoGlCodeStatuses',
      'lastOperationResult',
      'hCStatus',
    ],
    listState: 'hmgGlCodes',
  },
  modesName: 'GL_MODES',
  replacement: {
    hook: {
      globals: true,
      hotel: true,
      download: true,
      upload: true,
      add: true,
      remove: true,
      search: true,
      edit: true,
      modes: true,
      extraButton1: true, // one for copy
      extraButton2: true, // one for filters
      drawer: true,
    },
    mainPage: {
      globals: true,
      hotel: true,
      download: true,
      upload: true,
      add: true,
      remove: true,
      search: true,
      edit: true,
      modes: true,
      drawer: true,
      extraButton1: true,
      extraButton2: true,
    },
    constants: {
      periodSelector: false,
      modes: true,
    },
  },
  provider: {
    useProvider: false,
    providerName: 'HealthScorecard',
  },
  drawer: {
    drawerConfig: null, // Point to the config file
  },
  addEdit: {
    name: 'SalesManagerAddEdit',
    useAddEdit: false,
    editConfig: null, // Point to the config file
  },
};

module.exports = {
  config,
};
