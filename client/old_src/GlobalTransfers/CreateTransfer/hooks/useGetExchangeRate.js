import api, { globalTransfersUrl } from "api";
import { useMutation } from "react-query";
import { useEffect } from "react";

import useErrorModal from "utils/hooks/useErrorModal";

const useGetExchangeRate = ({ onSuccess = () => {} }) => {
  const postExchangeRate = async requestData => {
    const exchangeRateUrl = `${globalTransfersUrl}/exchangeRates`;

    const { data } = await api.post(exchangeRateUrl, requestData);
    return data;
  };

  const exchangeRateRequest = useMutation(postExchangeRate, {
    onSuccess
  });

  const { isError, isLoading } = exchangeRateRequest;
  const { showErrorModal } = useErrorModal();

  useEffect(() => {
    if (isError) {
      showErrorModal();
    }
  }, [isError]);

  return { exchangeRateRequest, isLoading, isError };
};

export default useGetExchangeRate;
