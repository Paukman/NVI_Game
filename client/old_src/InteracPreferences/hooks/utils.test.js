import { interacPreferences } from "utils/MessageCatalog";
import {
  rules,
  getFormattedAccounts,
  prepareAutoDepositRuleToPost,
  prepareAutoDepositRuleToPut,
  prepareErrorModal
} from "./utils";

const { isValidEmail } = rules.email;
const { requiredEmail } = rules.email;
const { requiredAccount } = rules.account;

describe(">> Interact autodeposit utils", () => {
  it(">> should validate email", () => {
    let email = "";
    expect(isValidEmail(email)).toBe(false);
    email = null;
    expect(isValidEmail(email)).toBe(false);
    email = undefined;
    expect(isValidEmail(email)).toBe(false);
    email = "123";
    expect(isValidEmail(email)).toBe(false);
    email = "123@";
    expect(isValidEmail(email)).toBe(false);
    email = "123@gmail@";
    expect(isValidEmail(email)).toBe(false);
    email = "123@gmail.com";
    expect(isValidEmail(email)).toBe(true);
  });
  it(">> should validate empty email", () => {
    let email = "";
    expect(requiredEmail(email)).toBe(false);
    email = null;
    expect(requiredEmail(email)).toBe(false);
    email = undefined;
    expect(requiredEmail(email)).toBe(false);
    email = "123";
    expect(requiredEmail(email)).toBe(true);
  });
  it(">> should validate empty account", () => {
    let account = "";
    expect(requiredAccount(account)).toBe(false);
    account = null;
    expect(requiredAccount(account)).toBe(false);
    account = undefined;
    expect(requiredAccount(account)).toBe(false);
    account = "123";
    expect(requiredAccount(account)).toBe(true);
  });
  it(">> should return correct formatted accounts getFormattedAccounts", () => {
    let accounts = [
      {
        name: "B",
        id: 1,
        number: "1"
      },
      {
        name: "A",
        id: 1,
        number: "1"
      }
    ];
    let formatted = getFormattedAccounts(accounts);
    expect(formatted).toMatchObject([
      { text: "A (1)", key: 1, value: 1 },
      { text: "B (1)", key: 1, value: 1 }
    ]);
    accounts = [];
    formatted = getFormattedAccounts(accounts);
    expect(formatted).toMatchObject([]);
    accounts = undefined;
    formatted = getFormattedAccounts(accounts);
    expect(formatted).toMatchObject([]);
    accounts = null;
    formatted = getFormattedAccounts(accounts);
    expect(formatted).toMatchObject([]);
    accounts = "abc";
    formatted = getFormattedAccounts(accounts);
    expect(formatted).toMatchObject([]);
  });
  it("can return correct element from prepareAutoDepositRuleToPost call", () => {
    let state = {};
    let element = prepareAutoDepositRuleToPost(state);
    expect(element).toBeNull();

    state = null;
    element = prepareAutoDepositRuleToPost(state);
    expect(element).toBeNull();

    state = undefined;
    element = prepareAutoDepositRuleToPost(state);
    expect(element).toBeNull();

    state = "";
    element = prepareAutoDepositRuleToPost(state);
    expect(element).toBeNull();

    state = {
      account: 123
    };
    element = prepareAutoDepositRuleToPost(state);
    expect(element).toBeNull();

    state = {
      account: 123,
      email: "someEmail"
    };
    element = prepareAutoDepositRuleToPost(state);
    expect(element).toMatchObject({
      accountId: 123,
      directDepositHandle: "someEmail"
    });
  });
  it("can return correct element from prepareAutoDepositRuleToPut call", () => {
    let state = {};
    let element = prepareAutoDepositRuleToPut(state);
    expect(element).toBeNull();

    state = null;
    element = prepareAutoDepositRuleToPut(state);
    expect(element).toBeNull();

    state = undefined;
    element = prepareAutoDepositRuleToPut(state);
    expect(element).toBeNull();

    state = "";
    element = prepareAutoDepositRuleToPut(state);
    expect(element).toBeNull();

    state = {
      account: 123
    };
    element = prepareAutoDepositRuleToPut(state);
    expect(element).toBeNull();

    state = {
      account: 123,
      autodepositRule: {
        account: "123",
        accountHolderName: "George Morgan Vegas",
        accountId: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        accountName: "No-Fee All-In Account",
        directDepositHandle: "test@atb.cozncm",
        directDepositReferenceNumber: "CA1DDNbVNszUPDRW",
        registrationStatus: 1
      }
    };
    element = prepareAutoDepositRuleToPut(state);
    expect(element).toMatchObject({
      accountId: 123,
      directDepositReferenceNumber: "CA1DDNbVNszUPDRW"
    });
  });

  it("can return correct error message from prepareErrorModal call", () => {
    let error = null;
    let errorMessage = prepareErrorModal(error);
    expect(errorMessage).toBe("");
    error = {
      response: "System Error"
    };
    errorMessage = prepareErrorModal(error);
    expect(errorMessage).toEqual(
      interacPreferences.ERR_SYSTEM_SAVE_AUTODEPOSIT()
    );
    error = null;
    errorMessage = prepareErrorModal(error);
    expect(errorMessage).toBe("");
    error = undefined;
    errorMessage = prepareErrorModal(error);
    expect(errorMessage).toBe("");
    error = "";
    errorMessage = prepareErrorModal(error);
    expect(errorMessage).toBe("");
    error = {
      response: { status: 500, data: { code: "ETRN0002" } }
    };
    errorMessage = prepareErrorModal(error);
    expect(errorMessage).toEqual(
      interacPreferences.ERR_SYSTEM_MAXIMUM_AUTODEPOSIT()
    );
    error = {
      response: { status: 500, data: { code: "ETRN0005" } }
    };
    errorMessage = prepareErrorModal(error);
    expect(errorMessage).toEqual(
      interacPreferences.ERR_SYSTEM_DUPLICATE_AUTODEPOSIT()
    );
  });
});
