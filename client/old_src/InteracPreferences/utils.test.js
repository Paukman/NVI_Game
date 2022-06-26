import { isValidEmail, isAphaNumeric } from "utils/formUtils";
import { validationRulesName, validationRulesEmail } from "./utils";

describe(">> Interac Preferences utils", () => {
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
    email = "123@gmail.comom";
    expect(isValidEmail(email)).toBe(true);
  });
  it(">> should validate isAphaNumeric", () => {
    let string = "";
    expect(isAphaNumeric(string)).toBe(true);
    string = " ";
    expect(isAphaNumeric(string)).toBe(true);
    string = "123";
    expect(isAphaNumeric(string)).toBe(true);
    string = "123!";
    expect(isAphaNumeric(string)).toBe(false);
    string = 123;
    expect(isAphaNumeric(string)).toBe(true);
    string = "John 3";
    expect(isAphaNumeric(string)).toBe(true);
  });
  it(">> should validate name", () => {
    let string = "";
    expect(validationRulesName.requiredName(string)).toBe(false);
    string = " ";
    expect(validationRulesName.requiredName(string)).toBe(false);
    string = "abc";
    expect(validationRulesName.requiredName(string)).toBe(true);
    string = "";
    expect(validationRulesName.isAphaNumeric(string)).toBe(true);
    string = " ";
    expect(validationRulesName.isAphaNumeric(string)).toBe(true);
    string = "123";
    expect(validationRulesName.isAphaNumeric(string)).toBe(true);
    string = "123!";
    expect(validationRulesName.isAphaNumeric(string)).toBe(false);
    string = 123;
    expect(validationRulesName.isAphaNumeric(string)).toBe(true);
    string = "John 3";
    expect(validationRulesName.isAphaNumeric(string)).toBe(true);
  });
  it(">> should validate email", () => {
    let email = "";
    expect(validationRulesEmail.isValidEmail(email)).toBe(false);
    expect(validationRulesEmail.requiredEmail(email)).toBe(false);
    email = null;
    expect(validationRulesEmail.isValidEmail(email)).toBe(false);
    email = undefined;
    expect(validationRulesEmail.isValidEmail(email)).toBe(false);
    email = "123";
    expect(validationRulesEmail.isValidEmail(email)).toBe(false);
    email = "123@";
    expect(validationRulesEmail.isValidEmail(email)).toBe(false);
    email = "123@gmail@";
    expect(validationRulesEmail.isValidEmail(email)).toBe(false);
    email = "123@gmail.com";
    expect(validationRulesEmail.isValidEmail(email)).toBe(true);
    expect(validationRulesEmail.requiredEmail(email)).toBe(true);
  });
});