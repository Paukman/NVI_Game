import React from "react";
import { render } from "@testing-library/react";
import { InteracPreferencesContext } from "../InteracPrefProvider";
import ViewProfile from "./ViewProfile";
import { testProfile } from "../constants";

describe(">> InteracPreferencePage Edit Profile", () => {
  it(">> should render the profile data in the form ", async () => {
    const editProfile = () => {};
    const { getByText } = render(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: {
            profileState: testProfile
          },
          editProfile
        }}
      >
        <ViewProfile />
      </InteracPreferencesContext.Provider>
    );
    expect(getByText("charlie brown")).toBeTruthy();
    expect(getByText("charlie_brown@gmail.com")).toBeTruthy();
    expect(getByText("Edit")).toBeTruthy();
  });
});
