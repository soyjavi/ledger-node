import {
  cache,
  C,
  cacheCryptos,
  cacheCurrencies,
  cacheMetals,
} from "../common";

const { CURRENCY, METALS, CRYPTOS } = C;

const round = (value) => parseFloat(value.toFixed(4), 10);

const NO_CURRENCIES = [...METALS, ...CRYPTOS];

export const rates = async ({ props: { baseCurrency, latest } }, res, next) => {
  const cacheKey = `rates:${baseCurrency}${latest ? ":latest" : ""}`;

  let rates = cache.get(cacheKey);

  if (!rates) {
    const currencies = await cacheCurrencies(latest);
    const cryptos = await cacheCryptos(latest);
    const metals = await cacheMetals(latest);

    let base = {};
    Object.keys(currencies).forEach(
      (key) =>
        (base[key] = { ...currencies[key], ...cryptos[key], ...metals[key] })
    );

    const isCurrency = !NO_CURRENCIES.includes(baseCurrency);
    if (latest) {
      const lastKey = Object.keys(base).sort().pop();
      base = { [lastKey]: base[lastKey] };
    }

    rates = {};

    Object.keys(base)
      .sort()
      .forEach((key) => {
        const baseRate =
          baseCurrency === CURRENCY
            ? 1
            : isCurrency
            ? 1 / base[key][baseCurrency]
            : base[key][CURRENCY];

        Object.keys(base[key]).forEach((currency) => {
          base[key][currency] = round(base[key][currency] / (1 / baseRate));
        });

        rates[key] = {
          ...base[key],
          [CURRENCY]: round(baseRate),
          BTC: 1 / cryptos[key][CURRENCY] / (1 / baseRate),
          XAU: metals[key] ? metals[key].XAU / (1 / baseRate) : undefined,
          XAG: metals[key] ? metals[key].XAG / (1 / baseRate) : undefined,
        };
      });

    cache.set(cacheKey, rates, 900);
  }

  res.dataSource = rates;

  next();
};
