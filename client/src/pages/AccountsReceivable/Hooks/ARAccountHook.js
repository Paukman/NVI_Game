import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHotelClientAccount } from '../../../graphql/useHotelClientAccount';
import { getText } from '../../../utils/localesHelpers';

export const ARAccountHook = () => {
  const { MappedTo, loadingList, hotelClientAccountList } = useHotelClientAccount();
  const [getAccountId, setGetAccountId] = useState('');
  const param = useParams();

  useEffect(() => {
    hotelClientAccountList({
      params: {},
      pagination: {
        page: 1,
        pageSize: 1000,
      },
    });
  }, []);

  useMemo(() => {
    if (MappedTo && MappedTo.data.length !== 0) {
      setGetAccountId(MappedTo.data[0].id);
    }
  }, [MappedTo, setGetAccountId]);

  return {
    getAccountId,
    MappedTo,
  };
};
