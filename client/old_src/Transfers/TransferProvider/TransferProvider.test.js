import React from "react";
import { render } from "@testing-library/react";
import { TransferContext } from "./TransferProvider";

describe(">> TransferProvider tests", () => {
  it(">> the context is exported and should render children ", async () => {
    const { container } = render(
      <TransferContext.Provider>
        <div />
      </TransferContext.Provider>
    );
    expect(container.hasChildNodes()).toBe(true);
  });
});
