import React, { Suspense } from "react";
import { render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

import ScrollToTop from "./ScrollToTop";

// mocks window.scrollTo
global.scrollTo = jest.fn();

describe("ScrollToTop hook", () => {
  let history;

  function testComponent(hist) {
    render(
      <Suspense fallback="Loading">
        <Router history={hist}>
          <ScrollToTop />
        </Router>
      </Suspense>
    );
  }

  beforeEach(() => {
    history = createMemoryHistory();
  });

  afterEach(() => {
    history = null;
    jest.clearAllMocks();
  });

  it(">> gets called on route location changes", () => {
    testComponent(history);
    history.push("/test-location-change");
    expect(global.scrollTo).toHaveBeenCalledWith(0, 0);
  });
  it(">> gets called on route hash location changes", () => {
    testComponent(history);
    history.push("#test-hash-change");
    expect(global.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
