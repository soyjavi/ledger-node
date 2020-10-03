import dotenv from "dotenv";
import fetch from "node-fetch";

import { C } from "./constants";
import { File } from "./file";

dotenv.config();
const { FIXER_IO_KEY } = process.env;
const { CURRENCIES, SERVICES } = C;
const FILE_NAME = "currencies.json";

const getRates = async (service = "latest") => {
  console.log(`⚙️  Fetching ${service} CURRENCIES ...`);

  const url = `${
    SERVICES.CURRENCIES
  }/${service}?access_key=${FIXER_IO_KEY}&symbols=${CURRENCIES.join(",")}`;

  const response = await fetch(url).catch(() => {});
  if (response) {
    const { rates = {} } = await response.json();
    return rates;
  } else return undefined;
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
