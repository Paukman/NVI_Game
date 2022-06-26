import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const LOADING_DATA = "LOADING_DATA";
export const LOADING_DATA_FAILED = "LOADING_DATA_FAILED";
export const LOADED_DATA = "LOADED_DATA";
export const ON_CHANGE = "ON_CHANGE";
export const CLEAN_FORM = "CLEAN_FORM";
export const PREPARE_DATA_FOR_REVIEW = "PREPARE_DATA_FOR_REVIEW";
export const PREPARE_DATA_FOR_POST = "PREPARE_DATA_FOR_POST";
export const POSTING = "POSTING";
export const UPDATE_ACCOUNTS_FOR_ELIGIBILITY =
  "UPDATE_ACCOUNTS_FOR_ELIGIBILITY";
export const UPDATE_DROPDOWN_FROM_OPTIONS = "UPDATE_DROPDOWN_FROM_OPTIONS";
export const UPDATE_DROPDOWN_TO_OPTIONS = "UPDATE_DROPDOWN_TO_OPTIONS";
export const UPDATE_EXCHANGE_RATE = "UPDATE_EXCHANGE_RATE";
export const UPDATE_CURRENCIES = "UPDATE_CURRENCIES";
export const UPDATING_EXCHANGE_RATE = "UPDATING_EXCHANGE_RATE";

export const FAILED_CALL = "FAILED_CALL";
export const SUCCESS_CALL = "SUCCESS_CALL";
export const NO_CALL = "NO_CALL";

// We will need to change data once state starts working
export const transferDataMock = {
  fromAccounts: [
    {
      name: "No-Fee All-In Account",
      number: "7679",
      bankAccount: {
        accountId: "from-01",
        routingId: "A",
        country: "CAD"
      },
      currency: "CAD",
      balance: { currency: "CAD", value: 337005.66 },
      availableBalance: { currency: "CAD", value: 387005.66 },
      type: "Deposit",
      subType: "Chequing",
      subTypeV1: "Chequing",
      status: "30",
      subProductCode: "DP_LOC_R",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      eligibleToAccounts: [
        "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        "33ZFwIxk3ZebPZZx1bDHj8zP5lY0oNZH3acXxuxekSU",
        "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I",
        "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY"
      ]
    },
    {
      name: "Basic Account",
      nickname: "Basic Account",
      bankAccount: {
        accountId: "from-02",
        routingId: "B",
        country: "CAD"
      },
      number: "6679",
      currency: "CAD",
      balance: { currency: "CAD", value: 51657176.69 },
      availableBalance: { currency: "CAD", value: 51657176.69 },
      type: "Deposit",
      subType: "Chequing",
      subTypeV1: "Chequing",
      status: "30",
      subProductCode: "RETDP_BASIC",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
      eligibleToAccounts: [
        "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        "33ZFwIxk3ZebPZZx1bDHj8zP5lY0oNZH3acXxuxekSU",
        "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I",
        "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yfI",
        "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
        "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY"
      ]
    },
    {
      name: "Tax-Free Saver Account",
      number: "7100",
      bankAccount: {
        accountId: "from-03",
        routingId: "C",
        country: "CAD"
      },
      currency: "CAD",
      balance: { currency: "CAD", value: 3120.22 },
      availableBalance: { currency: "CAD", value: 3120.22 },
      type: "Investment",
      subTypeV1: "TFSA",
      status: "30",
      subProductCode: "RETRP_TFSA_SAVING",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E",
      eligibleToAccounts: [
        "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I",
        "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yfI",
        "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
        "33ZFwIxk3ZebPZZx1bDHj5BHdY77pFThxhcFHkednoc",
        "33ZFwIxk3ZebPZZx1bDHj0ROmns5hmKP3ujclo4W2oU",
        "33ZFwIxk3ZebPZZx1bDHjzO0AwPJXEOMqaMonE1Vqws",
        "33ZFwIxk3ZebPZZx1bDHj777JpFNow3E5Agcba7BUG4",
        "33ZFwIxk3ZebPZZx1bDHj31BbgAPwBEdu22R1gyI10U",
        "33ZFwIxk3ZebPZZx1bDHj2iU1fBY4TFhbQV2-p3DqB8",
        "33ZFwIxk3ZebPZZx1bDHj0OkdTOP1QRcWRhTEKHPbis"
      ]
    },
    {
      name: "US Dollar Savings Account",
      number: "0579",
      bankAccount: {
        country: "CA",
        routingId: "021908559",
        accountId: "0000000719610579"
      },
      signingIndicator: "false",
      currency: "USD",
      balance: { currency: "USD", value: 12037.76 },
      availableBalance: { currency: "USD", value: 12037.76 },
      type: "Deposit",
      subType: "Saving",
      subTypeV1: "Saving",
      status: "30",
      subProductCode: "RETDP_USD_SAVINGS",
      customerId: "0002471847",
      id: "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY",
      eligibleToAccounts: [
        "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        "33ZFwIxk3ZebPZZx1bDHj8zP5lY0oNZH3acXxuxekSU",
        "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I",
        "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY"
      ]
    }
  ],
  fromAccountsFormatted: [
    {
      text: "No-Fee All-In Account (7679) | $387,005.66 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
    },
    {
      text: "Basic Account (6679) | $51,657,176.69 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
      value: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw"
    },
    {
      text: "Tax-Free Saver Account (7100) | $3,120.22 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E",
      value: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E"
    }
  ],
  toAccounts: [
    {
      name: "No-Fee All-In Account",
      number: "7679",
      bankAccount: {
        accountId: "to-01",
        routingId: "A",
        country: "CAD"
      },
      currency: "CAD",
      balance: { currency: "CAD", value: 337005.66 },
      availableBalance: { currency: "CAD", value: 387005.66 },
      type: "Deposit",
      subType: "Chequing",
      subTypeV1: "Chequing",
      status: "30",
      subProductCode: "DP_LOC_R",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      eligibleFromAccounts: [
        "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        "33ZFwIxk3ZebPZZx1bDHj8zP5lY0oNZH3acXxuxekSU",
        "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I",
        "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yfI",
        "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
        "33ZFwIxk3ZebPZZx1bDHj5BHdY77pFThxhcFHkednoc",
        "33ZFwIxk3ZebPZZx1bDHj3xRyEjCxdzNZ_LPbcE8ynI",
        "33ZFwIxk3ZebPZZx1bDHj8w_IIeCGbEbLtcd9vOHztc",
        "33ZFwIxk3ZebPZZx1bDHj4U0sHSvhsRuB2Z1Myd7tco",
        "33ZFwIxk3ZebPZZx1bDHj0ROmns5hmKP3ujclo4W2oU",
        "33ZFwIxk3ZebPZZx1bDHjzO0AwPJXEOMqaMonE1Vqws",
        "33ZFwIxk3ZebPZZx1bDHjzQ1tN46tAI2ciAjF49UOJ4",
        "33ZFwIxk3ZebPZZx1bDHj777JpFNow3E5Agcba7BUG4",
        "33ZFwIxk3ZebPZZx1bDHj31BbgAPwBEdu22R1gyI10U",
        "33ZFwIxk3ZebPZZx1bDHj2iU1fBY4TFhbQV2-p3DqB8",
        "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY"
      ]
    },
    {
      name: "Basic Account",
      nickname: "Basic Account",
      bankAccount: {
        accountId: "to-02",
        routingId: "B",
        country: "CAD"
      },
      number: "6679",
      currency: "CAD",
      balance: { currency: "CAD", value: 51657176.69 },
      availableBalance: { currency: "CAD", value: 51657176.69 },
      type: "Deposit",
      subType: "Chequing",
      subTypeV1: "Chequing",
      status: "30",
      subProductCode: "RETDP_BASIC",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
      eligibleFromAccounts: [
        "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        "33ZFwIxk3ZebPZZx1bDHj8zP5lY0oNZH3acXxuxekSU",
        "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I",
        "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yfI",
        "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
        "33ZFwIxk3ZebPZZx1bDHj5BHdY77pFThxhcFHkednoc",
        "33ZFwIxk3ZebPZZx1bDHj3xRyEjCxdzNZ_LPbcE8ynI",
        "33ZFwIxk3ZebPZZx1bDHj8w_IIeCGbEbLtcd9vOHztc",
        "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY"
      ]
    },
    {
      name: "Tax-Free Saver Account",
      number: "7100",
      bankAccount: {
        accountId: "to-03",
        routingId: "C",
        country: "CAD"
      },
      currency: "CAD",
      balance: { currency: "CAD", value: 3120.22 },
      availableBalance: { currency: "CAD", value: 3120.22 },
      type: "Investment",
      subTypeV1: "TFSA",
      status: "30",
      subProductCode: "RETRP_TFSA_SAVING",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E",
      eligibleFromAccounts: [
        "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I",
        "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yfI",
        "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
        "33ZFwIxk3ZebPZZx1bDHj5BHdY77pFThxhcFHkednoc",
        "33ZFwIxk3ZebPZZx1bDHj0ROmns5hmKP3ujclo4W2oU",
        "33ZFwIxk3ZebPZZx1bDHjzO0AwPJXEOMqaMonE1Vqws",
        "33ZFwIxk3ZebPZZx1bDHjzQ1tN46tAI2ciAjF49UOJ4",
        "33ZFwIxk3ZebPZZx1bDHj777JpFNow3E5Agcba7BUG4",
        "33ZFwIxk3ZebPZZx1bDHj31BbgAPwBEdu22R1gyI10U",
        "33ZFwIxk3ZebPZZx1bDHj2iU1fBY4TFhbQV2-p3DqB8",
        "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY"
      ]
    },
    {
      name: "US Dollar Savings Account",
      number: "0579",
      bankAccount: {
        country: "CA",
        routingId: "021908559",
        accountId: "0000000719610579"
      },
      signingIndicator: "false",
      currency: "USD",
      balance: { currency: "USD", value: 12037.76 },
      availableBalance: { currency: "USD", value: 12037.76 },
      type: "Deposit",
      subType: "Saving",
      subTypeV1: "Saving",
      status: "30",
      subProductCode: "RETDP_USD_SAVINGS",
      customerId: "0002471847",
      id: "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY",
      eligibleToAccounts: [
        "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        "33ZFwIxk3ZebPZZx1bDHj8zP5lY0oNZH3acXxuxekSU",
        "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I",
        "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY"
      ]
    }
  ],
  toAccountsFormatted: [
    {
      text: "No-Fee All-In Account (7679) | $387,005.66 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
    },
    {
      text: "Basic Account (6679) | $51,657,158.28 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
      value: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw"
    },
    {
      text: "Tax-Free Saver Account (7100) | $3,120.22 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E",
      value: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E"
    },
    {
      text: "US Dollar Savings Account (0579) | $12,037.76 USD",
      key: "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY",
      value: "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY"
    }
  ],
  fromAccountsFormattedUSD: [
    {
      text: "No-Fee All-In Account (7679) | $387,005.66 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
    },
    {
      text: "Basic Account (6679) | $51,657,176.69 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
      value: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw"
    },
    {
      text: "Tax-Free Saver Account (7100) | $3,120.22 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E",
      value: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E"
    },
    {
      text: "US Dollar Savings Account (0579) | $12037.76 CAD",
      key: "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY",
      value: "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY"
    }
  ],
  toAccountsFormattedUSD: [
    {
      text: "No-Fee All-In Account (7679) | $387,005.66 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
    },
    {
      text: "Basic Account (6679) | $51,657,158.28 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
      value: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw"
    },
    {
      text: "Tax-Free Saver Account (7100) | $3,120.22 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E",
      value: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E"
    },
    {
      text: "US Dollar Savings Account (0579) | $12037.76 CAD",
      key: "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY",
      value: "QDmDXee-TPqxNtTHu57V1kwJCEpQGD9SCRfZgWr37AY"
    }
  ],
  immediateTransferAccounts: [],
  futureDatedTransferAccounts: [],
  recurringAccounts: []
};

const preparedDataForReview = {
  From: {
    visible: true,
    imageIcon: "/static/media/account.da6f95e9.svg",
    title: "From",
    label: "No-Fee All-In Account (7679) | $387,005.66 CAD"
  },
  DownArrow: {
    visible: true,
    imageIcon: "/static/media/arrow_down.7fd6fb37.svg"
  },
  To: {
    visible: true,
    imageIcon: "/static/media/account.da6f95e9.svg",
    title: "To",
    label: "Basic Account (6679) | $51,657,158.28 CAD"
  },
  Amount: {
    visible: true,
    imageIcon: "/static/media/money.c79bdc3d.svg",
    title: "Amount",
    label: "$1.00"
  },
  When: {
    visible: true,
    imageIcon: "/static/media/calendar.315e3dcf.svg",
    title: "When",
    label: "Apr 06, 2020"
  },
  Message: {
    visible: true,
    message: ""
  }
};

export const oneTimeTransferState = {
  fromAccounts: [
    {
      name: "No-Fee All-In Account",
      number: "7679",
      currency: "CAD",
      balance: { currency: "CAD", value: 337005.66 },
      availableBalance: { currency: "CAD", value: 387005.66 },
      type: "Deposit",
      subType: "Chequing",
      subTypeV1: "Chequing",
      status: "30",
      subProductCode: "DP_LOC_R",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      eligibleToAccounts: [
        "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        "33ZFwIxk3ZebPZZx1bDHj8zP5lY0oNZH3acXxuxekSU",
        "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I"
      ]
    },
    {
      name: "Basic Account",
      nickname: "Basic Account",
      number: "6679",
      currency: "CAD",
      balance: { currency: "CAD", value: 51657176.69 },
      availableBalance: { currency: "CAD", value: 51657176.69 },
      type: "Deposit",
      subType: "Chequing",
      subTypeV1: "Chequing",
      status: "30",
      subProductCode: "RETDP_BASIC",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
      eligibleToAccounts: [
        "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        "33ZFwIxk3ZebPZZx1bDHj8zP5lY0oNZH3acXxuxekSU",
        "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I",
        "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yfI",
        "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y"
      ]
    },
    {
      name: "Tax-Free Saver Account",
      number: "7100",
      currency: "CAD",
      balance: { currency: "CAD", value: 3120.22 },
      availableBalance: { currency: "CAD", value: 3120.22 },
      type: "Investment",
      subTypeV1: "TFSA",
      status: "30",
      subProductCode: "RETRP_TFSA_SAVING",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E",
      eligibleToAccounts: [
        "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I",
        "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yfI",
        "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
        "33ZFwIxk3ZebPZZx1bDHj5BHdY77pFThxhcFHkednoc",
        "33ZFwIxk3ZebPZZx1bDHj0ROmns5hmKP3ujclo4W2oU",
        "33ZFwIxk3ZebPZZx1bDHjzO0AwPJXEOMqaMonE1Vqws",
        "33ZFwIxk3ZebPZZx1bDHj777JpFNow3E5Agcba7BUG4",
        "33ZFwIxk3ZebPZZx1bDHj31BbgAPwBEdu22R1gyI10U",
        "33ZFwIxk3ZebPZZx1bDHj2iU1fBY4TFhbQV2-p3DqB8",
        "33ZFwIxk3ZebPZZx1bDHj0OkdTOP1QRcWRhTEKHPbis"
      ]
    }
  ],
  fromAccountsFormatted: [
    {
      text: "No-Fee All-In Account (7679) | $387,005.66 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
    },
    {
      text: "Basic Account (6679) | $51,657,176.69 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
      value: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw"
    },
    {
      text: "Tax-Free Saver Account (7100) | $3,120.22 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E",
      value: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E"
    }
  ],
  toAccounts: [
    {
      name: "No-Fee All-In Account",
      number: "7679",
      currency: "CAD",
      balance: { currency: "CAD", value: 337005.66 },
      availableBalance: { currency: "CAD", value: 387005.66 },
      type: "Deposit",
      subType: "Chequing",
      subTypeV1: "Chequing",
      status: "30",
      subProductCode: "DP_LOC_R",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      eligibleFromAccounts: [
        "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        "33ZFwIxk3ZebPZZx1bDHj8zP5lY0oNZH3acXxuxekSU",
        "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I",
        "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yfI",
        "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
        "33ZFwIxk3ZebPZZx1bDHj5BHdY77pFThxhcFHkednoc",
        "33ZFwIxk3ZebPZZx1bDHj3xRyEjCxdzNZ_LPbcE8ynI",
        "33ZFwIxk3ZebPZZx1bDHj8w_IIeCGbEbLtcd9vOHztc",
        "33ZFwIxk3ZebPZZx1bDHj4U0sHSvhsRuB2Z1Myd7tco",
        "33ZFwIxk3ZebPZZx1bDHj0ROmns5hmKP3ujclo4W2oU",
        "33ZFwIxk3ZebPZZx1bDHjzO0AwPJXEOMqaMonE1Vqws",
        "33ZFwIxk3ZebPZZx1bDHjzQ1tN46tAI2ciAjF49UOJ4",
        "33ZFwIxk3ZebPZZx1bDHj777JpFNow3E5Agcba7BUG4",
        "33ZFwIxk3ZebPZZx1bDHj31BbgAPwBEdu22R1gyI10U",
        "33ZFwIxk3ZebPZZx1bDHj2iU1fBY4TFhbQV2-p3DqB8"
      ]
    },
    {
      name: "Basic Account",
      nickname: "Basic Account",
      number: "6679",
      currency: "CAD",
      balance: { currency: "CAD", value: 51657176.69 },
      availableBalance: { currency: "CAD", value: 51657176.69 },
      type: "Deposit",
      subType: "Chequing",
      subTypeV1: "Chequing",
      status: "30",
      subProductCode: "RETDP_BASIC",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
      eligibleFromAccounts: [
        "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        "33ZFwIxk3ZebPZZx1bDHj8zP5lY0oNZH3acXxuxekSU",
        "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I",
        "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yfI",
        "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
        "33ZFwIxk3ZebPZZx1bDHj5BHdY77pFThxhcFHkednoc",
        "33ZFwIxk3ZebPZZx1bDHj3xRyEjCxdzNZ_LPbcE8ynI",
        "33ZFwIxk3ZebPZZx1bDHj8w_IIeCGbEbLtcd9vOHztc"
      ]
    },
    {
      name: "Tax-Free Saver Account",
      number: "7100",
      currency: "CAD",
      balance: { currency: "CAD", value: 3120.22 },
      availableBalance: { currency: "CAD", value: 3120.22 },
      type: "Investment",
      subTypeV1: "TFSA",
      status: "30",
      subProductCode: "RETRP_TFSA_SAVING",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E",
      eligibleFromAccounts: [
        "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
        "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I",
        "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yfI",
        "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
        "33ZFwIxk3ZebPZZx1bDHj5BHdY77pFThxhcFHkednoc",
        "33ZFwIxk3ZebPZZx1bDHj0ROmns5hmKP3ujclo4W2oU",
        "33ZFwIxk3ZebPZZx1bDHjzO0AwPJXEOMqaMonE1Vqws",
        "33ZFwIxk3ZebPZZx1bDHjzQ1tN46tAI2ciAjF49UOJ4",
        "33ZFwIxk3ZebPZZx1bDHj777JpFNow3E5Agcba7BUG4",
        "33ZFwIxk3ZebPZZx1bDHj31BbgAPwBEdu22R1gyI10U",
        "33ZFwIxk3ZebPZZx1bDHj2iU1fBY4TFhbQV2-p3DqB8"
      ]
    }
  ],
  toAccountsFormatted: [
    {
      text: "No-Fee All-In Account (7679) | $387,005.66 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
    },
    {
      text: "Basic Account (6679) | $51,657,158.28 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
      value: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw"
    },
    {
      text: "Tax-Free Saver Account (7100) | $3,120.22 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E",
      value: "33ZFwIxk3ZebPZZx1bDHjx9gpGyrSnfncUONI6HLi_E"
    }
  ],
  immediateTransferAccounts: [],
  futureDatedTransferAccounts: [],
  recurringAccounts: [],
  from: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
  to: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
  amount: "$1.00",
  when: dayjs("Mar 18, 2020", "MMM DD, YYYY"),
  isPosting: false,
  preparedDataForReview,
  preparedDataForComplete: { ...preparedDataForReview },
  createCompleted: true
};

export const oneTimeTransferStateNoPreparedData = {
  to: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
  amount: "$1.00",
  when: dayjs("Mar 18, 2020", "MMM DD, YYYY"),
  preparedDataForReview: [],
  isPosting: false,
  createCompleted: false
};

export const oneTimeDataForReview = {
  amount: "$1.00",
  from: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
  fromAccountsFormatted: [
    {
      key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      text: "No-Fee All-In Account (7679) | $386,756.06 CAD",
      value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
    },
    {
      key: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
      text: "Springboard Savings Account (1479) | $220,491.79 CAD",
      value: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
    }
  ],
  to: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
  toAccountsFormatted: [
    {
      key: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
      text: "Springboard Savings Account (1479) | $220,491.79 CAD",
      value: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
    },
    {
      key: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
      text: "Basic Account (6679) | $51,656,951.31",
      value: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw"
    },
    {
      key: "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I",
      text: "Springboard Savings Account (2279) | $701,591.91 CAD",
      value: "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I"
    }
  ],

  when: dayjs("Mar 18, 2020", "MMM DD, YYYY")
};

export const loanAccountsTestingData = {
  fromAccounts: [
    {
      name: "No-Fee All-In Account",
      number: "7679",
      currency: "CAD",
      balance: { currency: "CAD", value: 337005.66 },
      availableBalance: { currency: "CAD", value: 387005.66 },
      type: "Deposit",
      subType: "Chequing",
      subTypeV1: "Chequing",
      status: "30",
      subProductCode: "DP_LOC_R",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      eligibleToAccounts: ["id1", "id2"]
    }
  ],
  fromAccountsFormatted: [
    {
      text: "No-Fee All-In Account (7679) | $387,005.66 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
    }
  ],

  toAccounts: [
    {
      name: "No-Fee All-In Account",
      number: "1000",
      currency: "CAD",
      balance: { currency: "CAD", value: 10 },
      availableBalance: { currency: "CAD", value: 50000 },
      type: "Loan",
      id: "id1"
    },
    {
      name: "No-Fee All-In Account",
      number: "1001",
      currency: "CAD",
      balance: { currency: "CAD", value: 0 },
      availableBalance: { currency: "CAD", value: 50000 },
      type: "Loan",
      id: "id2"
    }
  ],
  toAccountsFormatted: [
    {
      text: "No-Fee All-In Account (1000) | $50,000.00 CAD",
      key: "id1",
      value: "id1"
    },
    {
      text: "No-Fee All-In Account (1001) | $50,000.00 CAD",
      key: "id2",
      value: "id2"
    }
  ],
  immediateTransferAccounts: [],
  futureDatedTransferAccounts: [],
  recurringAccounts: []
};
