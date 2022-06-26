import React from "react";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { windowMatchMediaMock } from "utils/TestUtils";
import useQualtrics from "./useQualtrics";

const Qualtrics = () => {
  useQualtrics();
  return null;
};

describe("> renders", () => {
  it(">> test", async () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    window.QSI = {
      API: {
        unload: jest.fn(),
        load: jest.fn(),
        run: jest.fn()
      }
    };
    windowMatchMediaMock();
    let container;
    await act(async () => {
      container = render(
        <Router history={history}>
          <Qualtrics />
        </Router>
      );
    });
    history.push("/newroute");
    const { rerender } = container;
    await rerender(
      <Router history={history}>
        <Qualtrics />
      </Router>
    );

    expect(window.QSI.API.unload).toHaveBeenCalled();
    expect(window.QSI.API.load).toHaveBeenCalled();
  });
});
