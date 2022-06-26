import payBillIcon from "assets/icons/PayBill/pay-bill.svg";
import groupIcon from "assets/icons/Group/group.svg";
import pencilIcon from "assets/icons/Pencil/pencil.svg";
import { getLastDigits } from "utils";

export const transformDetails = data => {
  return {
    PayeeName: {
      visible: true,
      imageIcon: payBillIcon,
      title: "Payee name",
      label: `${data.payeeName} (${getLastDigits(data.payeeCustomerReference)})`
    },

    AccountNumber: {
      visible: true,
      imageIcon: groupIcon,
      title: "Account number",
      label: data.payeeCustomerReference
    },
    Nickname: {
      visible: !!data.payeeNickname,
      imageIcon: pencilIcon,
      title: "Nickname",
      label: `${data.payeeNickname} (${getLastDigits(
        data.payeeCustomerReference
      )})`
    }
  };
};
