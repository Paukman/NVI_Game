import { getEmailValidationTriggers } from "./getEmailValidationTriggers";

const mockedFormInstance = {
  getFieldError: fieldName => (fieldName === "fieldError" ? ["error"] : [])
};

describe("getEmailValidationTriggers", () => {
  it("should return validation triggers with onChange included when the field has an error", () => {
    const triggers = getEmailValidationTriggers(
      mockedFormInstance,
      "fieldError"
    );
    expect(triggers).toEqual(["onBlur", "onSubmit", "onChange"]);
  });

  it("should return validation triggers without onChange when the field does not have an error", () => {
    const triggers = getEmailValidationTriggers(mockedFormInstance, "noError");
    expect(triggers).toEqual(["onBlur", "onSubmit"]);
  });

  it("should return default validation triggers when formInstance argument is not valid", () => {
    let triggers = getEmailValidationTriggers(undefined, "fieldError");
    expect(triggers).toEqual(["onBlur", "onSubmit"]);

    triggers = getEmailValidationTriggers("my form instance", "fieldError");
    expect(triggers).toEqual(["onBlur", "onSubmit"]);

    triggers = getEmailValidationTriggers({}, "fieldError");
    expect(triggers).toEqual(["onBlur", "onSubmit"]);
  });

  it("should return default validation triggers when fieldName is not valid", () => {
    let triggers = getEmailValidationTriggers(mockedFormInstance, null);
    expect(triggers).toEqual(["onBlur", "onSubmit"]);

    triggers = getEmailValidationTriggers(mockedFormInstance, 66);
    expect(triggers).toEqual(["onBlur", "onSubmit"]);

    triggers = getEmailValidationTriggers(mockedFormInstance, {});
    expect(triggers).toEqual(["onBlur", "onSubmit"]);

    triggers = getEmailValidationTriggers(mockedFormInstance);
    expect(triggers).toEqual(["onBlur", "onSubmit"]);
  });
});
