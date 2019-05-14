
import fetch from 'node-fetch';

import { C } from '../common';
import readFile from './readFile';
import writeFile from './writeFile';

const { CURRENCIES, SERVICES } = C;
const FILE_NAME = 'currencies.json';

const getRates = async (url) => {
  const response = await fetch(`${SERVICES.FIAT}/${url}`);

  if (response) {
    const { rates = {} } = await response.json();
    return rates;
  }

  return {};
};

export default async () => {
  const today = new Date();
  const symbols = `symbols=${CURRENCIES.join(',')}`;
  let history = readFile(FILE_NAME);

  // -- Restore history of rates if it's empty
  const lastMonth = (new Date(today.getFullYear(), today.getMonth() - 1, 15, 0, 0)).toISOString().substr(0, 7);
  if (!history[lastMonth]) {
    console.log('⚙️  Fetching CURRENCIES history data...');

    const rates = await getRates(`history?start_at=2019-01-01&end_at=${lastMonth}-15&${symbols}`);
    Object.keys(rates).sort().forEach((key) => {
      if (!history[key.substr(0, 7)]) history[key.substr(0, 7)] = rates[key];
    });
  }

  // -- Get latest rate for this month
  console.log('⚙️  Fetching latest CURRENCIES rates...');
  const latest = await getRates(`latest?${symbols}`);
  history = {
    ...history,
    [(today).toISOString().substr(0, 7)]: latest,
  };

  writeFile(FILE_NAME, history);

  console.log(`✅ Rebuilt CURRENCIES cache (${Object.keys(history).length} months) ...`);
};
