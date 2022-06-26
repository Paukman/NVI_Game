import profileIcon from "assets/icons/Person/person.svg";
import autodepositIcon from "assets/icons/Assets/assets.svg";

import { accountsBaseUrl, etransfersBaseUrl } from "api";

export const BASE_PATH = "/more/interac-preferences";
export const BASE_PATH_PROFILE = "/more/interac-preferences/profile";
export const BASE_PATH_AUTODEPOSIT = "/more/interac-preferences/autodeposit";

export const AUTODEPOSIT_DEFAULT_PAGE = `${BASE_PATH_AUTODEPOSIT}/`;
export const REGISTER_RULE_PAGE = `${BASE_PATH_AUTODEPOSIT}/register-rule`;
export const EDIT_RULE_PAGE = `${BASE_PATH_AUTODEPOSIT}/edit-rule`;
export const RULES_VIEW_PAGE = `${BASE_PATH_AUTODEPOSIT}/view`;
export const PENDING_RULES_PAGE = `${BASE_PATH_AUTODEPOSIT}/pending`;
export const NO_RULES_REGISTERED_PAGE = `${BASE_PATH_AUTODEPOSIT}/no-rules`;
// export const NO_PROFILE_PAGE = `${BASE_PATH_AUTODEPOSIT}/no-profile`;
export const ERROR_PAGE = `${BASE_PATH_AUTODEPOSIT}/error`;

export const PROFILE_DEFAULT_PAGE = `${BASE_PATH_PROFILE}/`;
export const PROFILE_VIEW_PAGE = `${BASE_PATH_PROFILE}/view-profile`;
export const EDIT_PROFILE_PAGE = `${BASE_PATH_PROFILE}/edit-profile`;
export const CREATE_PROFILE_PAGE = `${BASE_PATH_PROFILE}/create-profile`;
export const NO_PROFILE_PAGE = `${BASE_PATH_PROFILE}/no-profile`;

export const accountsURL = `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferAutoDeposit`;
export const loggedinUserURL = `${accountsBaseUrl}/accountHolderName`;
export const profileURL = `${etransfersBaseUrl}/profile`;

export const testProfile = {
  name: "charlie brown",
  email: "charlie_brown@gmail.com",
  enabled: false,
  success: false,
  loading: false,
  saving: false,
  error: { type: null },
  editing: false,
  profileUpdated: false,
  dataLoaded: true,
  editProfile: {
    name: "charlie brown",
    email: "charlie_brown@gmail.com"
  }
};

// noInteracProfile
export const testNoInteracProfileUser = {
  name: "charlie brown",
  email: "charlie_brown@gmail.com",
  editing: false,
  editProfile: {
    name: "charlie brown",
    email: "charlie_brown@gmail.com"
  },
  enabled: false,
  error: { type: null },
  loading: false,
  profileUpdated: false,
  saving: false,
  success: false,
  dataLoaded: true
};

// hasInteracProfileNoRules
export const testInteracProfileUser = {
  name: "charlie brown",
  email: "charlie_brown@gmail.com",
  editing: false,
  editProfile: {
    name: "charlie brown",
    email: "charlie_brown@gmail.com"
  },
  enabled: true,
  error: false,
  loading: false,
  profileUpdated: false,
  saving: false,
  success: false,
  dataLoaded: true
};

// hasInteracProfileLoading
export const testInteracProfileLoadingUser = {
  name: "charlie brown",
  email: "charlie_brown@gmail.com",
  editing: false,
  editProfile: {
    name: "charlie brown",
    email: "charlie_brown@gmail.com"
  },
  enabled: true,
  error: false,
  loading: true,
  profileUpdated: false,
  saving: false,
  success: false,
  dataLoaded: false
};

// hasInteracProfileLoading
export const testInteracProfileNull = {
  name: "charlie brown",
  email: "charlie_brown@gmail.com",
  editing: false,
  editProfile: {
    name: "charlie brown",
    email: "charlie_brown@gmail.com"
  },
  enabled: true,
  error: false,
  loading: false,
  profileUpdated: false,
  saving: false,
  success: false,
  dataLoaded: true
};

export const testAutoDepositProfile = {
  name: "auto deposit",
  email: "auto_deposit@gmail.com",
  enabled: false,
  success: false,
  loading: false,
  saving: false,
  error: false,
  editing: false,
  profileUpdated: false,
  editProfile: {
    name: "auto deposit",
    email: "auto_deposit@gmail.com"
  },
  dataLoaded: true
};

export const testNoInteracProfileAutoDeposit = {
  name: "auto deposit",
  email: "auto_deposit@gmail.com",
  editing: false,
  editProfile: {
    name: "auto deposit",
    email: "auto_deposit@gmail.com"
  },
  enabled: false,
  error: false,
  loading: false,
  profileUpdated: false,
  saving: false,
  success: false,
  dataLoaded: true
};

export const testAutodeposit = {
  autodepositState: {
    account: "",
    accounts: [
      {
        name: "Basic Account",
        number: "6679",
        id: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        bankAccount: {
          country: "CA",
          routingId: "00001",
          accountId: "0000000734458979"
        }
      },
      {
        name: "Basic Account",
        number: "8479",
        id: "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yff",
        bankAccount: {
          country: "CA",
          routingId: "00002",
          accountId: "0000000734458889"
        }
      },
      {
        name: "Basic Account",
        number: "7679",
        id: "33ZFwIxk3ZebPZZx1bDHj5BHdY77pFThxhcFHkednoc",
        bankAccount: {
          country: "CA",
          routingId: "00003",
          accountId: "0000000734453333"
        }
      },
      {
        name: "No-Fee All-In Account",
        number: "7679",
        id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        bankAccount: {
          country: "CA",
          routingId: "00004",
          accountId: "0000000734454444"
        }
      },
      {
        name: "No-Fee All-In Account",
        number: "6879",
        id: "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
        bankAccount: {
          country: "CA",
          routingId: "00005",
          accountId: "0000000799999333"
        }
      }
    ],
    formattedAccountOptions: [
      {
        text: "Basic Account (6679)",
        key: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        value: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw"
      },
      {
        text: "Basic Account (8479)",
        key: "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yff",
        value: "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yfI"
      },
      {
        text: "Basic Account (7679)",
        key: "33ZFwIxk3ZebPZZx1bDHj5BHdY77pFThxhcFHkednoc",
        value: "33ZFwIxk3ZebPZZx1bDHj5BHdY77pFThxhcFHkednoc"
      },
      {
        text: "No-Fee All-In Account (7679)",
        key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
      },
      {
        text: "No-Fee All-In Account (6879)",
        key: "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
        value: "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y"
      }
    ],
    autodeposit: "",
    enabled: false,
    email: "",
    error: false,
    legalName: "George Morgan Vegas",
    loading: false,
    profileUpdated: false,
    saving: false,
    success: false,
    rebankSupportNumber: "1-800-332-8383",
    mode: "",
    rules: [
      {
        account: "7679",
        accountHolderName: "George Morgan Vegas",
        bankAccount: {
          country: "CA",
          routingId: "00001",
          accountId: "0000000734458979"
        },
        accountName: "No-Fee All-In Account",
        directDepositHandle: "test@atb.cozncm",
        directDepositReferenceNumber: "CA1DDNbVNszUPDRW",
        registrationStatus: 1
      },
      {
        account: "7679",
        accountHolderName: "George Morgan Vegas",
        bankAccount: {
          country: "CA",
          routingId: "00002",
          accountId: "0000000734458889"
        },
        accountName: "Basic Account",
        directDepositHandle: "dganev@atb.com",
        directDepositReferenceNumber: "CA1DDdJH3vnvbF6b",
        registrationStatus: 0
      },
      {
        account: "7679",
        accountHolderName: "George Morgan Vegas",
        bankAccount: {
          country: "CA",
          routingId: "00003",
          accountId: "0000000734452229"
        },
        accountName: "Basic Account",
        directDepositHandle: "faketesting@atb.com",
        directDepositReferenceNumber: "CA1DD8Q5xAukUuHp",
        registrationStatus: 0
      }
    ],
    updateAutodeposit: undefined
  },
  maxRules: [
    {
      account: "7679",
      accountHolderName: "George Morgan Vegas",
      bankAccount: {
        country: "CA",
        routingId: "00001",
        accountId: "0000000734458979"
      },
      accountName: "No-Fee All-In Account",
      directDepositHandle: "test@atb.cozncm",
      directDepositReferenceNumber: "CA1DDNbVNszUPDRW",
      registrationStatus: 1
    },
    {
      account: "7679",
      accountHolderName: "George Morgan Vegas",
      bankAccount: {
        country: "CA",
        routingId: "00002",
        accountId: "0000000734458889"
      },
      accountName: "Basic Account",
      directDepositHandle: "dganev@atb.com",
      directDepositReferenceNumber: "CA1DDdJH3vnvbF6b",
      registrationStatus: 0
    },
    {
      account: "7679",
      accountHolderName: "George Morgan Vegas",
      bankAccount: {
        country: "CA",
        routingId: "00003",
        accountId: "0000000734453333"
      },
      accountName: "Basic Account",
      directDepositHandle: "faketesting@atb.com",
      directDepositReferenceNumber: "CA1DD8Q5xAukUuHp",
      registrationStatus: 0
    },
    {
      account: "7679",
      accountHolderName: "George Morgan Vegas",
      bankAccount: {
        country: "CA",
        routingId: "00004",
        accountId: "0000000734454444"
      },
      accountName: "Basic Account",
      directDepositHandle: "test2@atb.com",
      directDepositReferenceNumber: "CA1DD8Q5xAukUuHp",
      registrationStatus: 0
    },
    {
      account: "7679",
      accountHolderName: "George Morgan Vegas",
      bankAccount: {
        country: "CA",
        routingId: "00005",
        accountId: "0000000799999333"
      },
      accountName: "Basic Account",
      directDepositHandle: "test3@atb.com",
      directDepositReferenceNumber: "CA1DD8Q5xAukUuHp",
      registrationStatus: 0
    }
  ]
};

export const autodepositRules = [
  {
    accountName: "No-Fee All-In Account",
    directDepositReferenceNumber: "CA1DDthQTMvX33Ng",
    directDepositHandle: "faketesting@atb.com",
    accountHolderName: "George Morgan Vegas",
    account: "6879",
    bankAccount: {
      country: "CA",
      routingId: "00001",
      accountId: "0000000734458979"
    },
    registrationStatus: 0
  },
  {
    accountName: "Basic Account",
    directDepositReferenceNumber: "CA1DDtnpG8pFTxr7",
    directDepositHandle: "test@atb.cozncm",
    accountHolderName: "George Morgan Vegas",
    account: "6679",
    bankAccount: {
      country: "CA",
      routingId: "00002",
      accountId: "0000000734458889"
    },
    registrationStatus: 1
  }
];
export const accounts = [
  {
    name: "Basic Account",
    nickname: "Basic Account",
    number: "6679",
    currency: "CAD",
    id: "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yfI",
    bankAccount: {
      country: "CA",
      routingId: "00001",
      accountId: "0000000734458979"
    }
  },
  {
    name: "Basic Another Account",
    nickname: "Basic Another Account",
    number: "6680",
    currency: "CAD",
    id: "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yjjj",
    bankAccount: {
      country: "CA",
      routingId: "00002",
      accountId: "0000000734458889"
    }
  }
];

export const loggedInUser = {
  retailName: {
    firstName: "George",
    lastName: "Vegas",
    middleName: "Morgan"
  }
};

export const interacProfile = {
  customerName: {
    legalName: {
      retailName: {
        firstName: "George",
        middleName: "Morgan",
        lastName: "Vegas"
      }
    },
    registrationName: "Different Random Email"
  },
  enabled: true,
  notificationPreference: [
    {
      isActive: true,
      notificationHandle: "different.random.email@random.email.com",
      notificationHandleType: "Email"
    }
  ]
};

export const dataWithProfile = {
  enabled: true,
  customerName: {
    registrationName: "James Bond"
  },
  notificationPreference: [
    {
      notificationHandleType: "Email",
      notificationHandle: "james_bond@saveworld.com"
    }
  ]
};

export const dataWithNoProfile = {
  enabled: false
};

export const interacPreferencesTabItems = [
  {
    url: BASE_PATH_PROFILE,
    class: "active",
    name: "Profile",
    icon: profileIcon
  },
  {
    url: BASE_PATH_AUTODEPOSIT,
    class: "inactive",
    name: "Autodeposit",
    icon: autodepositIcon
  }
];
