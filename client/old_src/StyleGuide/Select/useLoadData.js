import { useEffect, useState } from "react";
import { billPaymentsBaseUrl, manualApiFetch } from "api";
import { APPROVED_CREDITORS } from "utils/store";
import useIsMounted from "utils/hooks/useIsMounted";

export const LOADING_DATA = "LOADING_DATA";
export const LOADING_DATA_FAILED = "LOADING_DATA_FAILED";
export const LOADED_DATA = "LOADED_DATA";

export const approvedCreditorsUrl = `${billPaymentsBaseUrl}/approvedCreditors`;

const dataOptions = [
  "12 MILE STORAGE",
  "123 TREE PLANTING",
  "18 WHEELER PARTS N SERVICE LTD",
  "1ST CHOICE TRUCK AND CAR WASH",
  "3225941 MANITOBA LTD",
  "361025 ALBERTA LTD",
  "39 NIAGARA RENTALS",
  "3T SYSTEMS LTD",
  "4 REFUEL CANADA LP",
  "4/15/2020",
  "411 CA",
  "OKANAGAN FALLS IRRIGATION DISTRICT",
  "OKANAGAN RESIDENT PLUS PHARMACY ORPP",
  "OKANAGAN TREE FRUIT COOPERATIVE",
  "OKOTOKS HOME HARDWARE BUILDING CENTRE",
  "OLD DUTCH FOODS ATLANTIC",
  "OLD DUTCH FOODS ONTARIO QUEBEC",
  "OLD DUTCH WEST",
  "OLD OAK PROPERTIES INC",
  "OLD VICTORIA WATER COMPANY",
  "OLDFIELD KIRBY ESAU INC",
  "OLDS COLLEGE"
];

const useLoadData = () => {
  const isMounted = useIsMounted();
  const [creditorsState, updateState] = useState({
    type: "",
    data: ""
  });

  useEffect(() => {
    const loadData = async () => {
      updateState(state => ({
        ...state,
        type: LOADING_DATA
      }));
      try {
        const approvedCreditors = await manualApiFetch(
          approvedCreditorsUrl,
          APPROVED_CREDITORS
        );
        updateState(state => ({
          ...state,
          type: LOADED_DATA,
          data: approvedCreditors.value.map(item => {
            return item.name;
          })
        }));
        return;
      } catch (e) {
        if (!isMounted()) {
          updateState(state => ({
            ...state,
            data: dataOptions, // in case it fails, this is just for demo
            type: LOADING_DATA_FAILED
          }));
        }
      }
    };
    loadData();
  }, [updateState, isMounted]);

  return {
    creditorsState
  };
};

export default useLoadData;
