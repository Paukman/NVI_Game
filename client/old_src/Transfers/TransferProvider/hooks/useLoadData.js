import { useEffect } from "react";
import useIsMounted from "utils/hooks/useIsMounted";
import { LOADING_DATA, LOADING_DATA_FAILED, LOADED_DATA } from "./constants";
import { loadData } from "./utils";

const useLoadData = (
  updateStateOneTime,
  updateStateRecurring,
  noRequirementsMetAlert
) => {
  const isMounted = useIsMounted();

  useEffect(() => {
    const fetchData = async () => {
      if (!isMounted()) {
        return undefined;
      }
      updateStateOneTime({ type: LOADING_DATA });
      updateStateRecurring({ type: LOADING_DATA });
      try {
        const { dataOneTime, dataRecurring } = await loadData();
        if (
          dataOneTime.fromAccounts.length === 0 ||
          dataOneTime.toAccounts.length === 0 ||
          ((dataOneTime.fromAccounts.length === 1 ||
            dataOneTime.toAccounts.length === 1) &&
            dataOneTime.fromAccounts[0].id === dataOneTime.toAccounts[0].id)
        ) {
          noRequirementsMetAlert();
        }

        if (!isMounted()) {
          return undefined;
        }
        updateStateOneTime({ type: LOADED_DATA, data: dataOneTime });
        updateStateRecurring({ type: LOADED_DATA, data: dataRecurring });
      } catch (e) {
        if (isMounted()) {
          updateStateOneTime({ type: LOADING_DATA_FAILED });
          updateStateRecurring({ type: LOADING_DATA_FAILED });
        }
      }
      return null;
    };
    fetchData();
  }, [
    updateStateOneTime,
    updateStateRecurring,
    isMounted,
    noRequirementsMetAlert
  ]);
};

export default useLoadData;
