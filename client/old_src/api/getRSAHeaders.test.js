import { getRSAHeaders } from "./getRSAHeaders";

describe("Verify RSA Utils", () => {
  it("Verify RSA Headers", () => {
    const headers = getRSAHeaders();
    expect(headers["requester-user-agent"]).not.toBeNull();
    expect(headers["rsa-device"]).not.toBeNull();
    expect(headers.devicePrint).not.toBeNull();
    expect(headers.geoLocation).not.toBeNull();
  });
});
