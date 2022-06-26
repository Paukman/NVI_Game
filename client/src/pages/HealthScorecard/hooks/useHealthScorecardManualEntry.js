import { AppContext, GlobalFilterContext, HotelContext } from 'contexts';
import { useHealthScorecardReports } from '../../../graphql';
import { globals } from 'hooks';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

const useHealthScoreCardManualEntry = () => {
  const { portfolio, assignGlobalValue } = useContext(GlobalFilterContext);
  const { hotels } = useContext(HotelContext);
  const history = useHistory();
  const { appPages } = useContext(AppContext);

  const {
    listData,
    listDataQueryGet,
    listDataGetLoading,
    getEvpSvpQuery,
    svpEvpValues,
    getSvpEvpValuesLoading,
    hSManulEntrySet,
    hSManulEntrySvpEvpSet,
    hsSet,
    hsSvpEvpSet,
    mutationHSManualEntryEVPSVPValuesLoading,
    mutationHSManualEntryValuesLoading,
  } = useHealthScorecardReports();
  const myGlobals = [globals.hotelId];
  const [state, setState] = useState({
    hotelId: hotels && hotels.length ? hotels[0].id : '',
    requestReport: true,
    year: new Date().getFullYear(),
    data: [],
    errors: [],
    loading: listDataGetLoading,
    svpName: '',
    evpName: '',
  });

  useEffect(() => {
    setState({ ...state, loading: listDataGetLoading });
  }, [listDataGetLoading]);

  useEffect(() => {
    if (listData?.data || listData?.errors?.length) {
      // no errors
      if (listData?.data && !listData?.errors?.length) {
        if (!listData.data?.length) {
          // no data
          setState((state) => ({
            ...state,
            listData: [],
          }));
        } else {
          //   const formattedlistData = formatResultData(listData.data, listingState);
          setState((state) => ({
            ...state,
            data: [...listData.data],
          }));
        }
      } // errors...
      else if (listData?.errors?.length) {
        setState((state) => ({
          ...state,
          errors: listData?.errors,
        }));
      }
    }
  }, [listData]);
  useEffect(() => {
    if (svpEvpValues?.data || svpEvpValues?.errors?.length) {
      // no errors
      if (svpEvpValues?.data && !svpEvpValues?.errors?.length) {
        if (!svpEvpValues.data?.length) {
          // no data
          setState((state) => ({
            ...state,
            svpName: '',
            evpName: '',
          }));
        } else {
          //   const formattedsvpEvpValues = formatResultData(svpEvpValues.data, listingState);
          setState((state) => ({
            ...state,
            evpName: svpEvpValues.data[0].evpFullName,
            svpName: svpEvpValues.data[0].svpFullName,
          }));
        }
      } // errors...
      else if (svpEvpValues?.errors?.length) {
        setState((state) => ({
          ...state,
          errors: svpEvpValues?.errors,
        }));
      }
    }
  }, [svpEvpValues]);

  const onChange = (name, value) => {
    if (myGlobals.includes(name)) {
      assignGlobalValue(name, value);
    }
    setState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleValueChange = (name, value, id) => {
    setState({
      ...state,
      data: state.data.map((a) => (a.id === id ? { ...a, [name]: value } : a)),
    });
  };

  const submitAndClose = () => {
    hSManulEntrySet({
      hotelId: state?.hotelId,
      year: state?.year,
      items: state?.data.map((a) => ({
        jan: parseFloat(a.jan),
        feb: parseFloat(a.feb),
        mar: parseFloat(a.mar),
        apr: parseFloat(a.apr),
        may: parseFloat(a.may),
        jun: parseFloat(a.jun),
        jul: parseFloat(a.jul),
        aug: parseFloat(a.aug),
        sep: parseFloat(a.sep),
        oct: parseFloat(a.oct),
        nov: parseFloat(a.nov),
        dec: parseFloat(a.dec),
        total: a.total ? parseFloat(a.total) : null,
        reportSettingId: a.reportSettingId,
      })),
    });
    hSManulEntrySvpEvpSet({
      hotelId: state?.hotelId,
      evpFullName: state?.evpName,
      svpFullName: state?.svpName,
    });
    history.push(appPages.keys['health-scorecard'].url);
  };

  const handleReport = () => {
    setState({ ...state, requestReport: false, data: [] });
    const hotelId =
      state?.hotelId === 'All' || !state?.hotelId ? hotels.map((a) => a.id).filter((b) => b !== 0) : state?.hotelId;
    listDataQueryGet({
      hotelId,
      year: state?.year,
    });
    getEvpSvpQuery({ hotelId });
  };

  return { state, onChange, handleReport, handleValueChange, submitAndClose };
};

export default useHealthScoreCardManualEntry;
