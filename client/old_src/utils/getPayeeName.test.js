import { getPayeeName } from "./getPayeeName";

describe("getPayeeName", () => {
  it(">> Should return payeeNickname if it exists", () => {
    const name = getPayeeName({ payeeName: "NAME", payeeNickname: "NICKNAME" });
    expect(name).toEqual("NICKNAME");
  });

  it(">> Should return payeeName if it exists and no nickname exists", () => {
    const name = getPayeeName({ payeeName: "NAME" });
    expect(name).toEqual("NAME");
  });
  it(">> Should return empty string if no name or nickname exist", () => {
    const name = getPayeeName({});
    expect(name).toEqual("");
  });

  it(">> Should return empty string if argument is not an object", () => {
    expect(getPayeeName()).toEqual("");
    expect(getPayeeName("hello")).toEqual("");
    expect(getPayeeName(44)).toEqual("");
    expect(getPayeeName(null)).toEqual("");
  });
});
