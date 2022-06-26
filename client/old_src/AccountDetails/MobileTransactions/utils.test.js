import { setTitleId } from "./utils";

describe("Testing setTitleId", () => {
  const id = "details";

  it(">> Should render posted", () => {
    const posting = setTitleId("Posted transactions", id);
    expect(posting).toEqual("details-title-posted");
  });

  it(">> Should render pending", () => {
    const posting = setTitleId("Pending transactions", id);
    expect(posting).toEqual("details-title-pending");
  });

  it(">> Should render details-title", () => {
    const posting = setTitleId("", id);
    expect(posting).toEqual("details-title");
  });
});
