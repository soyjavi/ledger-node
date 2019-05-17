import fetch from 'node-fetch';

import C from './constants';
import { readFile, writeFile } from './modules';

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

export default async (onlyLatest = false) => {
  const history = readFile(FILE_NAME);
  const tasks = [];
  const today = new Date();

  // -- Restore history of rates if it's empty
  const dates = Object.keys(await readFile('currencies.json')).sort().slice(0, -1);
  const lastMonth = dates[dates.length - 1];
  if (!onlyLatest && !history[lastMonth]) {
    console.log('⚙️  Fetching CRYPTOS history data...');
    dates.forEach(async (key) => {
      tasks.push(new Promise(async (resolve) => {
        const date = new Date(...key.split('-', 15));
        const { [BTC]: rates } = await getRates(`data/pricehistorical?fsym=${BTC}&ts=${(date.getTime() / 1000)}`);
        resolve([key, rates]);
      }));
    });
  }

  // -- Get latest rate for this month
  tasks.push(new Promise(async (resolve) => {
    console.log('⚙️  Fetching latest CRYPTOS rates...');
    resolve([(today).toISOString().substr(0, 7), await getRates(`data/price?fsym=${BTC}`)]);
  }));

  const values = await Promise.all(tasks);
  values.forEach(([key, rates]) => {
    history[key] = rates;
  });

  writeFile(FILE_NAME, history);
  console.log(`✅ Rebuilt CRYPTOS cache (${Object.keys(history).length} months) ...`);

  return history;
};
