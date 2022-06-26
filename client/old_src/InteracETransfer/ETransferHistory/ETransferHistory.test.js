import React from "react";
import { mockApiData, windowMatchMediaMock } from "utils/TestUtils";
import { render, act, fireEvent } from "@testing-library/react";
import { etransfersBaseUrl } from "api";
import ModalProvider from "Common/ModalProvider";
import { MessageProvider } from "StyleGuide/Components";
import {
  pendingHistory,
  transferDetails,
  postedHistory,
  noHistory
} from "./ETransferHistory.testdata";

import ETransferHistory from "./ETransferHistory";

const pendingDetailsUrl = `${etransfersBaseUrl}/1`;

describe("Test ETransfer History", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> Should Render posted and pending data", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/pending`,
        results: pendingHistory
      },
      {
        url: `${etransfersBaseUrl}/posted?paging=true`,
        results: postedHistory
      }
    ]);

    // using the existing modalprovider causes all tests to have to be wrapped
    // using antd modal will no longer require this.
    // const { getByText } = render(<ETransferHistory />);
    let component;
    await act(async () => {
      component = render(
        <ModalProvider>
          <ETransferHistory setIsDetailsClicked={false} />
        </ModalProvider>
      );
    });
    const { getByText } = component;

    expect(getByText("Joe Dood")).toBeTruthy();
    expect(getByText("$2.35")).toBeTruthy();
    expect(getByText("Jane Dood")).toBeTruthy();
    expect(getByText("$34.56")).toBeTruthy();
    expect(getByText("Show more")).toBeTruthy();
  });

  it(">> Should render Details page on click of a row", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/pending`,
        results: pendingHistory
      },
      {
        url: `${etransfersBaseUrl}/posted?paging=true`,
        results: postedHistory
      },
      {
        url: pendingDetailsUrl,
        results: transferDetails,
        status: 200
      }
    ]);

    // using the existing modalprovider causes all tests to have to be wrapped
    // using antd modal will no longer require this.
    // const { getByText } = render(<ETransferHistory />);
    const setIsDetailsClicked = jest.fn();
    const { findByText } = render(
      <ModalProvider>
        <MessageProvider>
          <ETransferHistory setIsDetailsClicked={setIsDetailsClicked} />
        </MessageProvider>
      </ModalProvider>
    );

    const row = await findByText("Joe Dood");

    await act(async () => {
      fireEvent.click(row);
    });

    const detailsPageTitle = await findByText("Send money details");
    expect(detailsPageTitle).toBeTruthy();
  });

  it(">> Should show no results", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/pending`,
        results: noHistory
      },
      {
        url: `${etransfersBaseUrl}/posted?paging=true`,
        results: postedHistory
      }
    ]);

    // const { getByText } = render(<ETransferHistory />);
    let component;
    await act(async () => {
      component = render(
        <ModalProvider>
          <ETransferHistory setIsDetailsClicked={false} />
        </ModalProvider>
      );
    });
    const { getByText } = component;

    expect(getByText(/no transaction records/)).toBeTruthy();
  });

  it(">> Should show error when api call fails", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/pending`,
        error: "Error! Error! Error!"
      },
      {
        url: `${etransfersBaseUrl}/posted`,
        results: noHistory
      }
    ]);

    // const { getByText } = render(<ETransferHistory />);
    let component;
    await act(async () => {
      component = render(
        <ModalProvider>
          <ETransferHistory setIsDetailsClicked={false} />
        </ModalProvider>
      );
    });
    const { getByText } = component;

    expect(getByText(/experiencing some technical issues/)).toBeTruthy();
  });
});
