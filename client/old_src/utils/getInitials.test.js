import { getInitials } from "./getInitials";

describe("getInitials Util", () => {
  it(">> Should render NU", () => {
    const newUser = getInitials("New User");
    expect(newUser).toEqual("NU");
  });

  it(">> Should render empty", () => {
    const empty = getInitials("");
    expect(empty).toEqual("");
  });
});
