import api, { accountsBaseUrl, queryKeys } from "api";
import dayjs from "dayjs";
import { useCallback } from "react";
import { useInfiniteQuery } from "react-query";
import { remapTransactions } from "./utils";

const todaysDate = dayjs().format("YYYY-MM-DD");
const fromDate = dayjs()
  .subtract(180, "day")
  .format("YYYY-MM-DD");

const getCreditCardUrl = (baseUrl, nextPage) => {
  const creditCardUrl = `${baseUrl}/transactions?status=Completed&fromDate=${fromDate}&toDate=${todaysDate}&limit=25`;

  return nextPage
    ? `${creditCardUrl}&offset=${nextPage.offset}`
    : creditCardUrl;
};

const getUrl = (type, accountId, nextPage) => {
  const baseUrl = `${accountsBaseUrl}/${type}s/${accountId}`;

  if (type === "creditcard") {
    return getCreditCardUrl(baseUrl, nextPage);
  }

  const url = `${baseUrl}/transactionsByCount?count=25`;
  return nextPage
    ? `${url}&lastKey=${nextPage.lastKey}&lastPostingDate=${nextPage.lastPostingDate}`
    : url;
};

const usePostedTransactions = ({ type, accountId }) => {
  const getPostedTransactions = async ({ pageParam }) => {
    const url = getUrl(type, accountId, pageParam);
    const { data } = await api.get(url);

    const transactions = remapTransactions(type, data.transactions);
    return { ...data, transactions };
  };

  const {
    data: transactions,
    fetchNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    hasNextPage
  } = useInfiniteQuery(
    [queryKeys.POSTED_TRANSACTIONS, type, accountId],
    getPostedTransactions,
    {
      // Gets params to fetch next page
      getNextPageParam: (lastPage, pages) => {
        if (!lastPage.moreItem) return undefined;

        const lastTransaction =
          lastPage.transactions[lastPage.transactions.length - 1];
        return {
          lastKey: lastTransaction.key,
          lastPostingDate: lastTransaction.transactionDate,
          offset: pages.length
        };
      },
      // transforms `data` returned from useInfiniteQuery to just transactions
      select: useCallback(
        data => data?.pages.flatMap(page => page.transactions),
        []
      )
    }
  );

  return {
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isFetchNextPageError: hasNextPage && isError,
    isLoading,
    transactions: transactions || []
  };
};

export default usePostedTransactions;
