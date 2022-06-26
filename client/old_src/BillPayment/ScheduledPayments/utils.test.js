import React from "react";
import { transformTransactionList } from "./utils";

const mockData = [
  {
    payeeNickname: "Test Column",
    payeeCustomerReference: "123456",
    amount: {
      value: 1
    },
    sourceAccountProductName: "Test Product Name",
    paymentDate: "2020-06-01"
  },
  {
    payeeNickname: "Test Column",
    payeeCustomerReference: "123456",
    amount: {
      value: 1
    },
    sourceAccountProductName: "Test Product Name",
    paymentDate: "2020-05-28"
  }
];

const genericClickHandler = () => {};

const expected = {
  columns: [
    [
      {
        data: (
          <>
            <span className="acct-name" data-testid="item-payments-0">
              Test Column
            </span>
          </>
        ),
        header: "Payee",
        width: {
          widescreen: "four",
          desktop: "five",
          tablet: "four",
          mobile: "sixteen"
        }
      },
      {
        data: <span data-testid="item-payments-amount-1">$1.00</span>,
        header: "Amount",
        width: {
          widescreen: "two",
          desktop: "two",
          tablet: "two",
          mobile: "sixteen"
        }
      },
      {
        data: (
          <>
            <span className="acct-name">Test Product Name</span>({})
          </>
        ),
        header: "From",
        width: {
          desktop: "six",
          tablet: "five",
          mobile: "eight"
        }
      },
      {
        data: "June 01, 2020",
        hasIcon: true,
        header: "Next scheduled",
        width: {
          desktop: "four",
          tablet: "five",
          mobile: "eight"
        }
      }
    ]
  ],
  chevron: {
    icon: "chevron-right.svg",
    alt: "chevron alt tag",
    onClick: genericClickHandler
  },
  trash: {
    icon: "trashcan.svg",
    alt: "trash alt tag",
    onClick: () => {}
  }
};

describe("transformTransactionList", () => {
  it("> Should transform body", () => {
    const results = transformTransactionList(
      mockData,
      genericClickHandler,
      1024
    );

    expect(results.columns[0][0]).toEqual(expected.columns[0][0]);
    expect(results.columns[0][1]).toEqual(expected.columns[0][1]);
    expect(results.columns[0][2].data.props.children[0].props).toEqual({
      className: "acct-name",
      children: "Test Product Name"
    });
    expect(results.columns[0][3].data).toEqual("May 28, 2020");

    expect(results.columns[0][0].header).toEqual("Payee");
    expect(results.columns[0][1].header).toEqual("Amount");
    expect(results.columns[0][2].header).toEqual("From");
    expect(results.columns[0][3].header).toEqual("Next scheduled");
  });

  describe("> Should transform for mobile", () => {
    it("Should render mobile headers", () => {
      const mobileResults = transformTransactionList(
        mockData,
        genericClickHandler,
        320
      );
      expect(mobileResults.columns[0][0].header).toEqual("Payee");
      expect(mobileResults.columns[0][3].header).toEqual("Next scheduled");
    });
  });
});
