import fetch from 'node-fetch';
import { cache } from '../../common';

const ENDPOINT = 'https://api.exchangeratesapi.io';

export default async (base) => {
  const key = `rates:${base}`;
  let rates = cache.get(key);
  if (rates) return rates;

  const response = await fetch(`${ENDPOINT}/latest?base=${base}`);
  if (response) ({ rates = {} } = await response.json());
  cache.set(key, rates, 3600);

  return rates;
};
