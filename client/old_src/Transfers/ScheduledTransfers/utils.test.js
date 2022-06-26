import { transformTransferData } from "./utils";
import { mockData, expectedBody } from "./scheduledTransfersTestData";

const genericClickHandler = () => {};
const expected = expectedBody(genericClickHandler());

describe("transformTransactionList", () => {
  it("> Should transform body", () => {
    const results = transformTransferData(mockData, genericClickHandler);

    expect(results.columns[0][0]).toEqual(expected.columns[0][0]);
    expect(results.columns[0][1]).toEqual(expected.columns[0][1]);
    expect(results.columns[0][2].data.props.children[0].props).toEqual({
      className: "acct-name",
      children: "Test Product Name"
    });
    expect(results.columns[0][3].data).toEqual("May 28, 2020");

    expect(results.columns[0][0].header).toEqual("to");
    expect(results.columns[0][1].header).toEqual("Amount");
    expect(results.columns[0][2].header).toEqual("From");
    expect(results.columns[0][3].header).toEqual("Next scheduled");
  });

  describe("> Should transform for mobile", () => {
    it("Should render mobile headers", () => {
      const mobileResults = transformTransferData(
        mockData,
        genericClickHandler
      );
      expect(mobileResults.columns[0][0].header).toEqual("to");
      expect(mobileResults.columns[0][3].header).toEqual("Next scheduled");
    });
  });
});
