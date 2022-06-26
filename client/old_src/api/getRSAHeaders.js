export const getRSAHeaders = () => {
  let devicePrint;
  let geoLocation;

  if (window.RSA_DEVICE) {
    devicePrint = window.RSA_DEVICE;
    geoLocation = window.RSA_GET_GEO_LOCATION();
  }

  const headers = {
    "requester-user-agent": window.navigator.userAgent,
    "rsa-device": "eyJIYXJkd2FyZUlEIjoiV0VCIiwiR2VvTG9jYXRpb25JbmZvIjoiIn0=",
    devicePrint,
    geoLocation
  };
  return headers;
};
