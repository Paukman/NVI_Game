import { useEffect, useState } from "react";
import { ACCOUNTS_OVERVIEW_ALL_ACCOUNTS } from "utils/store/storeSchema";
import { accountsBaseUrl, asyncResolver, manualApiFetch } from "api";
import useIsMounted from "utils/hooks/useIsMounted";
import { mapToOverview, mapTotals } from "./utils";

export const accountsWithQuickActionsURL = `${accountsBaseUrl}/accounts?quickActions=true&totals=true`;

const loadData = async ([url, key]) => manualApiFetch(url, key, 600000);

const useLoadAccounts = () => {
  const [accounts, setAccounts] = useState({
    loading: true,
    depositTotals: {},
    investmentTotals: {},
    loanTotals: {},
    creditCardTotals: {},
    prepaidCardTotals: {},
    generalError: null, // general error eg. network etc...
    fetchAccountErrors: {}, // failing API errors
    accountLoadingErrors: {},
    allAccounts: []
  });
  const isMounted = useIsMounted();

  useEffect(() => {
    const fetchData = async () => {
      const data = await asyncResolver([
        {
          fn: loadData,
          args: [accountsWithQuickActionsURL, ACCOUNTS_OVERVIEW_ALL_ACCOUNTS],
          key: "orderedAccounts"
        }
      ]);
      const { orderedAccounts } = data;

      if (!isMounted()) {
        return;
      }

      // update errors
      setAccounts(state => {
        return {
          ...state,
          fetchAccountErrors: orderedAccounts.result?.value?.errors
        };
      });

      if (orderedAccounts.error) {
        setAccounts(state => {
          return {
            ...state,
            loading: false,
            generalError: true
          };
        });
      }

      const orderedAccountsArray = orderedAccounts.result?.value?.accounts;
      const totals = orderedAccounts.result?.value?.totals;

      const allAccounts = mapToOverview(orderedAccountsArray || []);

      setAccounts(state => ({
        ...state,
        allAccounts,
        loading: false,
        ...mapTotals(totals)
      }));
    };
    fetchData();
  }, []);

  return {
    accounts
  };
};

export default useLoadAccounts;
