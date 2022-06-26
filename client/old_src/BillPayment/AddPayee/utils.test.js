import { rules } from "./utils";

describe("add payee utils", () => {
  it("can validate payee name", () => {
    const { createPayeeName } = rules;
    const payeeName = createPayeeName([{ name: "123" }, { name: "12345" }]);
    let result = payeeName.requiredPayeeName("");
    expect(result).toEqual(false);
    result = payeeName.requiredPayeeName(undefined);
    expect(result).toEqual(false);
    result = payeeName.requiredPayeeName(null);
    expect(result).toEqual(false);
    result = payeeName.requiredPayeeName("1");
    expect(result).toEqual(false);
    result = payeeName.requiredPayeeName("12");
    expect(result).toEqual(false);
    result = payeeName.requiredPayeeName("123");
    expect(result).toEqual(true);
    result = payeeName.requiredPayeeName("1234");
    expect(result).toEqual(false);
    result = payeeName.requiredPayeeName("12345");
    expect(result).toEqual(true);
  });
  it("can validate required account", () => {
    const { account } = rules;
    let result = account.requiredAccount("");
    expect(result).toEqual(false);
    result = account.requiredAccount(undefined);
    expect(result).toEqual(false);
    result = account.requiredAccount(null);
    expect(result).toEqual(false);
    result = account.requiredAccount("1");
    expect(result).toEqual(true);
  });
  it("can validate invalidAccount account", () => {
    const { account } = rules;
    let result = account.invalidAccount("");
    expect(result).toEqual(false);
    result = account.invalidAccount(undefined);
    expect(result).toEqual(false);
    result = account.invalidAccount(null);
    expect(result).toEqual(false);
    result = account.invalidAccount("1");
    expect(result).toEqual(true);
    result = account.invalidAccount("1@");
    expect(result).toEqual(false);
    result = account.invalidAccount("http");
    expect(result).toEqual(false);
  });
  it("can validate isValidNickname nickname", () => {
    const { nickname } = rules;
    let result = nickname.isValidNickname("");
    expect(result).toEqual(true);
    result = nickname.isValidNickname(null);
    expect(result).toEqual(true);
    result = nickname.isValidNickname(undefined);
    expect(result).toEqual(true);
    result = nickname.isValidNickname("1");
    expect(result).toEqual(true);
    result = nickname.isValidNickname("1@");
    expect(result).toEqual(false);
    result = nickname.isValidNickname("http");
    expect(result).toEqual(false);
  });
});
