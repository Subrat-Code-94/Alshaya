import { useEffect, useState } from 'react';
import { getCurrencyFormatter } from '../base-utils';

const useCurrencyFormatter = ({ price, priceDecimals, currency }) => {
  const [currencyValue, setCurrencyValue] = useState('');

  useEffect(() => {
    const setValue = async () => {
      const formatter = await getCurrencyFormatter(currency, priceDecimals);
      setCurrencyValue(formatter.format(price));
    };
    setValue();
  }, [price]);

  return currencyValue;
};

export default useCurrencyFormatter;
