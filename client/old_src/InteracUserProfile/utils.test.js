import { interacPreferences } from "utils/MessageCatalog";
import { validateEmail, validateName } from "./utils";

const emailError = new Error(interacPreferences.ERR_INCORRECT_FORMAT_EMAIL);
const nameError = new Error(interacPreferences.ERR_MANDATORY_NAME);

describe("validateEmail", () => {
  it("throws when emails is invalid", async () => {
    try {
      await validateEmail(null, null);
    } catch (e) {
      expect(e).toEqual(emailError);
    }
    try {
      await validateEmail(null, undefined);
    } catch (e) {
      expect(e).toEqual(emailError);
    }
    try {
      await validateEmail(null, "123");
    } catch (e) {
      expect(e).toEqual(emailError);
    }
  });
  it("returns null if email is valid", async () => {
    const error = await validateEmail(null, "123@email.com");
    expect(error).toBeNull();
  });
});
describe(" validateName", () => {
  it("throws when name is invalid", async () => {
    try {
      await validateName(null, "123");
    } catch (e) {
      expect(e).toEqual(nameError);
    }
    try {
      await validateName(null, null);
    } catch (e) {
      expect(e).toEqual(nameError);
    }
    try {
      await validateName(null, undefined);
    } catch (e) {
      expect(e).toEqual(nameError);
    }
  });
  it("returns null if name is valid", async () => {
    const error = await validateName(null, "John");
    expect(error).toBeNull();
  });
});
