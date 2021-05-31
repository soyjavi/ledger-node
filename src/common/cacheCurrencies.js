import dotenv from "dotenv";
import fetch from "node-fetch";

import { C } from "./constants";
import { File } from "./file";

dotenv.config();
const { COINLAYER_COM_KEY = "", FIXER_IO_KEY = "" } = process.env;
const { CRYPTOS, CURRENCIES, CURRENCY, SERVICES } = C;
const FILE_NAME = "currencies.json";

const fetchJSON = async (url) => {
  const response = await fetch(url).catch(() => {});

  return response ? await response.json() : {};
};

const getCurrenciesRates = async (service = "latest") => {
  const symbols = CURRENCIES.join(",");
  const keys = FIXER_IO_KEY.split(",");
  const key = keys[Math.floor(Math.random() * keys.length)];

  const url = `${SERVICES.CURRENCIES}/${service}?access_key=${key}&symbols=${symbols}`;

  console.log(`⚙️  Fetching ${service} ${SERVICES.CURRENCIES} ...`);

  const { rates } = await fetchJSON(url);

  return rates;
};

const getCryptosRates = async (service = "live") => {
  const values = {};
  const symbols = CRYPTOS.join(",");
  const keys = COINLAYER_COM_KEY.split(",");
  const key = keys[Math.floor(Math.random() * keys.length)];

  const url = `${SERVICES.CRYPTOS}/${service}?access_key=${key}&target=${CURRENCY}&symbols=${symbols}`;

  console.log(
    `⚙️  Fetching ${service} ${SERVICES.CRYPTOS} [${keys.indexOf(key)}] ...`
  );

  const { rates = {} } = await fetchJSON(url);
  Object.keys(rates).forEach(
    (key) => (values[key] = parseFloat((1 / rates[key]).toFixed(12)))
  );

  return values;
};

const getRates = async (service) => {
  const currencies = await getCurrenciesRates(service);
  const cryptos = await getCryptosRates(service);

  return Object.keys(currencies).length && Object.keys(cryptos).length
    ? { ...currencies, ...cryptos }
    : undefined;
};

export const cacheCurrencies = async () => {
  const today = new Date();
  const historical = File.read(FILE_NAME);

  if (Object.keys(historical).length === 0) {
    const baseHistorical = new Date(2018, 10, 1);
    const baseYear = baseHistorical.getFullYear();
    const baseMonth = baseHistorical.getMonth();

    const months =
      today.getMonth() - baseMonth + 12 * (today.getFullYear() - baseYear);

    for (let month in Array.from(Array(months + 1).keys())) {
      const date = new Date(baseYear, baseMonth + parseInt(month), 0, 12, 0)
        .toISOString()
        .substr(0, 10);

      historical[date.substr(0, 7)] = await getRates(date);
    }
  }

  historical[today.toISOString().substr(0, 7)] = await getRates();

  File.write(FILE_NAME, historical);

  console.log(
    `✅ Rebuilt CURRENCIES cache (${Object.keys(historical).length} months) ...`
  );

  return historical;
};
