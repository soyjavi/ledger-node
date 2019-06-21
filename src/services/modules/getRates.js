import {
  cache, C, cacheCryptos, cacheCurrencies, cacheMetals,
} from '../../common';

const { CURRENCY } = C;

const round = value => parseFloat(value.toFixed(4), 10);

export default async (baseCurrency) => {
  const cacheKey = `rates:${baseCurrency}`;

  let rates = cache.get(cacheKey);
  if (rates) return rates;

  const onlyLatest = true;
  const currencies = await cacheCurrencies(onlyLatest);
  const cryptos = await cacheCryptos(onlyLatest);
  const metals = await cacheMetals(onlyLatest);
  const isBase = baseCurrency === CURRENCY;

  rates = {};
  Object.keys(currencies).sort().forEach((key) => {
    const baseRate = isBase ? 1 : 1 / currencies[key][baseCurrency];

    Object.keys(currencies[key]).forEach((currency) => {
      currencies[key][currency] = round(currencies[key][currency] / (1 / baseRate));
    });

    rates[key] = {
      ...currencies[key],
      [CURRENCY]: round(baseRate),
      BTC: (1 / cryptos[key][CURRENCY]) / (1 / baseRate),
      AUX: 1,
    };
  });

  cache.set(cacheKey, rates, 3600);

  return rates;
};
