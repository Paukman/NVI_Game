import { findByBankAccount } from "./findByBankAccount";

const accounts = [
  {
    name: "account 1",
    id: "0001",
    bankAccount: {
      accountId: "1234567",
      routingId: "01234",
      country: "CAD"
    }
  },
  {
    name: "account 2",
    id: "0002",
    bankAccount: {
      accountId: "8901234",
      routingId: "56789",
      country: "USD"
    }
  }
];
describe("findByBankAccount", () => {
  it(">> Should return an account that completely matches the passed `bankAccount", () => {
    const completeMatch = {
      accountId: "1234567",
      routingId: "01234",
      country: "CAD"
    };
    const foundAccount = findByBankAccount(completeMatch, accounts);
    expect(foundAccount.name).toBe("account 1");
    expect(foundAccount.id).toBe("0001");
  });

  it(">> Should return undefined if passed `bankAccount` is not a complete match of any accounts in `accounts`", () => {
    const incompleteMatch = {
      accountId: "1234568",
      routingId: "01234",
      country: "CAD"
    };
    const foundAccount = findByBankAccount(incompleteMatch, accounts);
    expect(foundAccount).toBeUndefined();
  });

  it(">> Should handle unexpected parameters", () => {
    let account = findByBankAccount({
      accountId: "8901234",
      routingId: "56789",
      country: "USD"
    });
    expect(account).toBeUndefined();

    account = findByBankAccount();
    expect(account).toBeUndefined();

    account = findByBankAccount("bankAccount", {});
    expect(account).toBeUndefined();

    account = findByBankAccount([], 42);
    expect(account).toBeUndefined();

    account = findByBankAccount(
      {
        accountId: "8901234",
        routingId: "56789"
      },
      accounts
    );
    expect(account).toBeUndefined();
  });
});
