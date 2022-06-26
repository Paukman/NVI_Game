import {
  createValidateUniqueEmail,
  createValidateUniqueName,
  validationRulesAnswer,
  validationQandA,
  validationEmptyQuestion,
  validationRulesNickname,
  validationRulesName,
  validationRulesEmail
} from "./utils";

describe("Verify validationRulesAnswer", () => {
  it("Value is less than 3", () => {
    const iresults = validationRulesAnswer("ab");
    expect(iresults).toBeFalsy();
  });

  it("Value is more than 64", () => {
    const str = new Array(64).join("ab");
    const iresults = validationRulesAnswer(str);
    expect(iresults).toBeFalsy();
  });

  it("Value has space", () => {
    const iresults = validationRulesAnswer("abc def");
    expect(iresults).toBeFalsy();
  });

  it("Value has url", () => {
    const iresults = validationRulesAnswer("http:\\www.abc.com");
    expect(iresults).toBeFalsy();
  });
});

describe("Verify validationQandA", () => {
  it("should return false if q === a", () => {
    const isValid = validationQandA("question", "question");
    expect(isValid).toEqual(false);
  });
  it("should return false if q !== a", () => {
    const isValid = validationQandA("question", "answer");
    expect(isValid).toEqual(true);
  });
});

describe("Verify validationEmptyQuestion", () => {
  it("should return false if empty", () => {
    const isValid = validationEmptyQuestion("");
    expect(isValid).toEqual(false);
  });
  it("should return true if not empty", () => {
    const isValid = validationEmptyQuestion("question");
    expect(isValid).toEqual(true);
  });
});

describe("Verify validationRulesNickname", () => {
  it("can validate isValidNickname nickname", () => {
    let result = validationRulesNickname.isValidNickname("");
    expect(result).toEqual(true);
    result = validationRulesNickname.isValidNickname(null);
    expect(result).toEqual(true);
    result = validationRulesNickname.isValidNickname(undefined);
    expect(result).toEqual(true);
    result = validationRulesNickname.isValidNickname("1");
    expect(result).toEqual(true);
    result = validationRulesNickname.isValidNickname("1@");
    expect(result).toEqual(false);
    result = validationRulesNickname.isValidNickname("http");
    expect(result).toEqual(false);
  });
});

describe("Verify validationRulesName", () => {
  it("can validate requiredName", () => {
    let result = validationRulesName.requiredName("");
    expect(result).toEqual(false);
    result = validationRulesName.requiredName(null);
    expect(result).toEqual(false);
    result = validationRulesName.requiredName(undefined);
    expect(result).toEqual(false);
    result = validationRulesName.requiredName("1j1j1j");
    expect(result).toEqual(true);
  });

  it("can validate isValidName", () => {
    let result = validationRulesName.isValidName("");
    expect(result).toEqual(false);
    result = validationRulesName.isValidName("InV@liD");
    expect(result).toEqual(false);
    result = validationRulesName.isValidName("Valid");
    expect(result).toEqual(true);
  });
});

describe("Verify createValidateUniqueName", () => {
  const recipient = { aliasName: "Obi-Wan" };
  const list = [recipient, { aliasName: "Anakin" }];

  const validateUniqueName = createValidateUniqueName(list, recipient);
  it("Should return true if value is current recipient's name", () => {
    expect(validateUniqueName("obi-wan")).toBe(true);
  });
  it("Should return false if value equals a name in recipient list", () => {
    expect(validateUniqueName("anakin")).toBe(false);
  });
  it("Should return true if value is not in recipient list", () => {
    expect(validateUniqueName("Palpatine")).toBe(true);
  });

  it("Should handle list and recipient being undefined", () => {
    let validate = createValidateUniqueName(list);
    expect(validate("Palpatine")).toBe(true);
    expect(validate("Obi-wan")).toBe(false);
    expect(validate("Anakin")).toBe(false);

    validate = createValidateUniqueName();
    expect(validate("Palpatine")).toBe(true);
    expect(validate("Obi-wan")).toBe(true);
    expect(validate("Anakin")).toBe(true);
  });
});

describe("Verify validationRulesEmail", () => {
  it("can validate email", async () => {
    let result = await validationRulesEmail(
      null,
      () => {},
      () => {}
    );
    expect(result).toEqual(false);

    result = await validationRulesEmail(
      undefined,
      () => {},
      () => {}
    );
    expect(result).toEqual(false);

    result = await validationRulesEmail(
      "not valid email",
      () => {},
      () => {}
    );
    expect(result).toEqual(false);

    result = await validationRulesEmail(
      "$%&*//#@specialchars.com",
      () => {},
      () => {}
    );
    expect(result).toEqual(false);

    result = await validationRulesEmail(
      "abc@atb.com",
      () => {},
      () => {}
    );
    expect(result).toEqual(true);
  });
});

describe("Verify createValidateUniqueEmail", () => {
  const recipient = {
    notificationPreference: [{ notificationHandle: "obi-wan@high.ground" }]
  };
  const list = [
    recipient,
    { notificationPreference: [{ notificationHandle: "Anakin@chosen.one" }] }
  ];

  const validateUniqueEmail = createValidateUniqueEmail(list, recipient);
  it("Should return true if value is current recipient's email", () => {
    expect(validateUniqueEmail("obi-wan@high.ground")).toBe(true);
  });
  it("Should return false if value equals a email in recipient list", () => {
    expect(validateUniqueEmail("anakin@chosen.one")).toBe(false);
  });
  it("Should return true if value is not in recipient list", () => {
    expect(validateUniqueEmail("Palpatine@do.it")).toBe(true);
  });

  it("Should handle list and recipient being undefined", () => {
    let validate = createValidateUniqueEmail(list);
    expect(validate("palpatine@do.it")).toBe(true);
    expect(validate("obi-wan@high.ground")).toBe(false);
    expect(validate("Anakin@chosen.one")).toBe(false);

    validate = createValidateUniqueEmail();
    expect(validate("Palpatine@do.it")).toBe(true);
    expect(validate("obi-wan@high.ground")).toBe(true);
    expect(validate("Anakin@chosen.one")).toBe(true);
  });
});
