
import fetch from 'node-fetch';

import { C } from '../common';
import readFile from './readFile';
import writeFile from './writeFile';

const { CURRENCY, SERVICES } = C;
const FILE_NAME = 'cryptos.json';
const BTC = 'BTC';

const getRates = async (url) => {
  const response = await fetch(`${SERVICES.CRYPTO}/${url}&tsyms=${CURRENCY}`);

  if (response) {
    const rates = await response.json();
    return rates;
  }

  return {};
};

export default async () => {
  let history = readFile(FILE_NAME);

  // -- Restore history of rates if it's empty
  const dates = Object.keys(await readFile('currencies.json')).sort().slice(0, -1);
  const lastMonth = dates[dates.length - 1];
  if (!history[lastMonth]) {
    console.log('⚙️  Fetching CRYPTOS history data...');

    dates.forEach(async (key) => {
      const date = new Date(...key.split('-', 15));
      const { [BTC]: rates } = await getRates(`data/pricehistorical?fsym=${BTC}&ts=${(date.getTime() / 1000)}`);

      writeFile(FILE_NAME, { ...(await readFile(FILE_NAME)), [key]: rates });
    });
  }

  // -- Get latest rate for this month
  console.log('⚙️  Fetching latest CRYPTOS rates...');
  const today = new Date();
  history = {
    ...history,
    [(today).toISOString().substr(0, 7)]: await getRates(`data/price?fsym=${BTC}`),
  };

  writeFile(FILE_NAME, history);

  console.log(`✅ Rebuilt CRYPTOS cache (${Object.keys(history).length} months) ...`);
};
