import { getLegalName } from "./getLegalName";

describe("Testing getLegalName", () => {
  it(">> should return proper legal name", () => {
    const state = {
      recipientName: "Recipient Name"
    };
    const customerNameNoMIddleName = {
      legalName: {
        retailName: {
          firstName: "First Name",
          lastName: "Last Name"
        }
      }
    };
    const customerNameWithMIddleName = {
      legalName: {
        retailName: {
          firstName: "First Name",
          lastName: "Last Name",
          middleName: "Middle Name"
        }
      }
    };
    let res = getLegalName(state, null);
    expect(res).toEqual("Recipient Name");

    res = getLegalName(state, customerNameNoMIddleName);
    expect(res).toEqual("First Name Last Name");

    res = getLegalName(state, customerNameWithMIddleName);
    expect(res).toEqual("First Name Middle Name Last Name");
  });
});
