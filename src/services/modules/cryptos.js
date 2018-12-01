import fetch from 'node-fetch';
import { cache, C } from '../../common';

const { CURRENCIES } = C;
const ENDPOINT = 'https://min-api.cryptocompare.com/data/price';

export default async (base = 'BTC') => {
  const key = `cryptos:${base}`;
  let cryptos = cache.get(key);
  if (cryptos) return cryptos;

  const response = await fetch(`${ENDPOINT}?fsym=${base}&tsyms=${CURRENCIES.join(',')}`);
  if (response) {
    cryptos = await response.json();
    cache.set(key, cryptos, 3600);
  }

  return cryptos;
};
