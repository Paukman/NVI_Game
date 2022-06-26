import React from "react";
import { render } from "@testing-library/react";
import NoProfile from "./NoProfile";

describe(">> InteracPreferencePage No Profile", () => {
  it(">> should no profile page ", async () => {
    const { getByText } = render(
      <NoProfile handleOnCreateProfile={() => ""} />
    );
    expect(getByText("Create profile")).toBeTruthy();
  });
});
