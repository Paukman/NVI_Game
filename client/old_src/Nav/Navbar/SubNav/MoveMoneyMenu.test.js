import React from "react";
import { render } from "@testing-library/react";
import { RenderWithProviders, mockApiData } from "utils/TestUtils";
import DataStore from "utils/store";

import { featureToggleBaseUrl } from "api";
import SubNav from "./SubNav";
import { navLinkType } from "../useNavbar";

describe("Move Money Menu", () => {
  describe("Global Transfers", () => {
    let component;
    let renderComponent;

    afterEach(() => {
      DataStore.flush();
    });

    beforeEach(() => {
      DataStore.flush();
      renderComponent = (featureFlagOn = true) => {
        mockApiData([
          {
            url: `${featureToggleBaseUrl}/rebank-global-transfers-enabled`,
            results: {
              status: featureFlagOn
            }
          }
        ]);

        return render(
          <RenderWithProviders location="">
            <SubNav
              atPageTop
              handleClose={() => {}}
              navId=""
              isOpenSubNav={menu => menu === navLinkType.MOVE_MONEY}
            />
          </RenderWithProviders>
        );
      };
    });

    it("should not show the Global Transfers menu if the feature flag is disabled", () => {
      component = renderComponent(false);
      const { queryByText } = component;

      const globalTransfers = queryByText("Global Transfers");
      expect(globalTransfers).not.toBeInTheDocument();
    });

    it("should show the Global Transfers menu if the feature flag is enabled", async () => {
      component = renderComponent(true);
      const { findByText } = component;

      const globalTransfers = await findByText("Global Transfers");
      expect(globalTransfers).toBeVisible();
    });
  });
});
