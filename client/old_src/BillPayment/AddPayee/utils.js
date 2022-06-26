import {
  isAphaNumeric,
  isAphaNumericWithoutSpace,
  isDisallowed,
  hasInvalidCharacters
} from "utils/formUtils";
import { manageContactMessage, billPaymentErrors } from "utils/MessageCatalog";

export const rules = {
  createPayeeName: (approvedCreditors = []) => {
    const isValidCreditor = value =>
      approvedCreditors.find(({ name }) => name === value);

    return {
      requiredPayeeName: value => {
        if (!value || value.length < 3) {
          return false;
        }
        if (!isValidCreditor(value)) {
          return false;
        }
        return true;
      }
    };
  },
  account: {
    requiredAccount: value => {
      if (!value || !value.length) {
        return false;
      }
      return true;
    },
    invalidAccount: value => {
      if (!value) return false;
      return (
        !(hasInvalidCharacters(value) || isDisallowed(value)) &&
        isAphaNumericWithoutSpace(value)
      );
    }
  },
  nickname: {
    isValidNickname: value => {
      if (!value) return true;
      if (
        !isAphaNumeric(value) ||
        isDisallowed(value) ||
        hasInvalidCharacters(value)
      ) {
        return false;
      }
      return true;
    }
  }
};

export const errorTypes = {
  INVALID_ACCOUNT: "invalidAccount"
};

export const errorMessages = {
  requiredPayeeName: billPaymentErrors.MSG_RBBP_006,
  invalidAccount: manageContactMessage.MSG_RBBP_017,
  requiredAccount: manageContactMessage.MSG_RBBP_017B,
  isValidNickname: manageContactMessage.MSG_RBBP_017_UNK
};
