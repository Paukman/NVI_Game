import { useEffect, useState } from "react";
import { accountsBaseUrl, manualApiFetch } from "api";
import useIsMounted from "utils/hooks/useIsMounted";
import { LOGGED_IN_USER } from "utils/store/storeSchema";

const useAccountHolderName = () => {
  const [name, setName] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    fullName: "",
    error: null
  });
  const isMounted = useIsMounted();

  useEffect(() => {
    const fetchAccountHolderInfo = async () => {
      try {
        const response = await manualApiFetch(
          `${accountsBaseUrl}/accountHolderName`,
          LOGGED_IN_USER
        );

        if (response && response.value && isMounted()) {
          let firstName;
          let fullName;
          const isBusinessBp = "businessName" in response.value;
          if (isBusinessBp) {
            const accountHolderName =
              "tradeName" in response.value.businessName
                ? `${response.value.businessName.companyName} (${response.value.businessName.tradeName})`
                : response.value.businessName.companyName;
            firstName = accountHolderName;
            fullName = accountHolderName;
          } else {
            ({ firstName } = response.value.retailName);
            const {
              middleName: retailMiddleName,
              lastName: retailLastName
            } = response.value.retailName;
            fullName = [firstName, retailMiddleName, retailLastName]
              .filter(Boolean)
              .join(" ");
          }

          const middleName = isBusinessBp
            ? ""
            : response.value.retailName.middleName;

          const lastName = isBusinessBp
            ? ""
            : response.value.retailName.lastName;

          setName(state => ({
            ...state,
            firstName,
            middleName,
            lastName,
            fullName
          }));
        }
      } catch (e) {
        if (isMounted()) {
          setName(state => ({
            ...state,
            firstName: "",
            middleName: "",
            lastName: "",
            fullName: "",
            error: e.message
          }));
        }
      }
    };

    fetchAccountHolderInfo();
  }, [isMounted]);

  return {
    accountHolderFirstName: name.firstName,
    accountHolderMiddleName: name.middleName,
    accountHolderLastName: name.lastName,
    accountHolderFullName: name.fullName,
    accountHolderNameError: name.error
  };
};

export default useAccountHolderName;
