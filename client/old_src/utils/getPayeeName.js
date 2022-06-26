import { isObject } from "lodash";

export const getPayeeName = payee => {
  if (!isObject(payee)) {
    return "";
  }
  const { payeeNickname, payeeName } = payee;
  return payeeNickname || payeeName || "";
};
