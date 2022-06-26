const { FILE_NAMES } = require('../config');

const config = {
  // all pages you want to create
  createPages: [FILE_NAMES.HOOK, FILE_NAMES.MAIN_PAGE, FILE_NAMES.MAIN_PAGE_INDEX, FILE_NAMES.HOOK_INDEX],
  // only append to existing pages
  appendPages: [FILE_NAMES.MAIN_PAGE_INDEX, FILE_NAMES.HOOK_INDEX],

  moduleName: 'PnLView',
  pageDirectory: 'ProfitAndLoss',
  graphQL: {
    fileName: 'usePnLViewQueries',
    graphQLmethods: ['pnlViewsList'], // have to have at least 1, make dummy if you don't know the name
    listState: 'pnlViewListState', // has to be different then `${moduleName}State`
  },
  replacement: {
    hook: {
      add: true,
      remove: true,
      edit: true,
    },
    mainPage: {
      addNew: true,
    },
  },
  provider: {
    useProvider: false,
    providerName: 'PnLView',
  },
  drawer: {
    drawerConfig: null, // Point to the config file
  },
  addEdit: {
    name: 'PnLViewAddEdit',
    useAddEdit: false,
    editConfig: null, // Point to the config file
  },
};

module.exports = {
  config,
};
