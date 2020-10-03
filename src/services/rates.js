import dotenv from "dotenv";

import { cache, C, File } from "../common";

dotenv.config();
const { CURRENCY } = C;

const round = (value) => parseFloat(value.toFixed(6), 10);

const FILE_NAME = "currencies.json";
const METALS = ["XAU", "XAG"];
const OUNCE_TO_GRAM = 31.1;

export const rates = async ({ props: { baseCurrency, latest } }, res, next) => {
  const cacheKey = `rates:${baseCurrency}${latest ? ":latest" : ""}`;

  let rates = cache.get(cacheKey);

  if (!rates) {
    const historicalRates = File.read(FILE_NAME);

    let base = historicalRates;
    if (latest) {
      const lastKey = Object.keys(historicalRates).sort().pop();
      base = { [lastKey]: base[lastKey] };
    }

    rates = {};
    Object.keys(base)
      .sort()
      .forEach((key) => {
        const baseRate =
          baseCurrency === CURRENCY
            ? 1
            : METALS.includes(baseCurrency)
            ? 1 / base[key][baseCurrency] / OUNCE_TO_GRAM
            : 1 / base[key][baseCurrency];

        Object.keys(base[key]).forEach((currency) => {
          base[key][currency] = round(
            (base[key][currency] / (1 / baseRate)) *
              (METALS.includes(currency) ? OUNCE_TO_GRAM : 1)
          );
        });

        rates[key] = { ...base[key] };
      });

    cache.set(cacheKey, rates, 3600);
  }

  res.dataSource = rates;

  next();
};
