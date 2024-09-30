import { getConfigValue } from '../../scripts/configs.js';

export const getCurrencyFormatter = async (currencyCode, priceDecimals = 2) => {
  let currency = currencyCode || '';

  if (!currency) {
    currency = await getConfigValue('currency') || 'AED';
  }

  const countryCode = await getConfigValue('country-code') || 'AE';

  return new Intl.NumberFormat(`${document.documentElement.lang || 'en'}-${countryCode}`, {
    style: 'currency',
    currency,
    numberingSystem: 'latn',
    maximumFractionDigits: priceDecimals,
  });
};

export const formatPrice = async (currency, price) => {
  const currentFormatter = await getCurrencyFormatter(currency);
  return currentFormatter.format(price);
};

export const getRandomNumber = () => Math.floor(Math.random() * 100);
