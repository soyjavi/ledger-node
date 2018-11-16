import fetch from 'node-fetch';
import { cache, C } from '../../common';

const { CURRENCIES } = C;
const ENDPOINT = 'https://api.exchangeratesapi.io';

export default async (base) => {
  const key = `rates:${base}`;
  let rates = cache.get(key);
  if (rates) return rates;

  rates = {};
  const response = await fetch(`${ENDPOINT}/latest?base=${base}`);
  if (response) {
    const json = await response.json();

    CURRENCIES.forEach((currency) => {
      if (json.rates[currency]) rates[currency] = json.rates[currency];
    });

    cache.set(key, rates, 3600);
  }

  return rates;
};
