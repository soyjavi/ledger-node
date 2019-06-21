import dotenv from 'dotenv';
import fetch from 'node-fetch';

import C from './constants';
import { readFile, writeFile } from './modules';

dotenv.config();
const { APILAYER_TOKEN } = process.env;
const { METALS, SERVICES } = C;
const FILE_NAME = 'metals.json';

const getRates = async () => {
  const metals = METALS.join(',');
  const response = await fetch(`${SERVICES.METAL}/live?access_key=${APILAYER_TOKEN}&currencies=EUR,${metals}`);
  // const response = {
  //   success: true,
  //   terms: 'https:\/\/currencylayer.com\/terms',
  //   privacy: 'https:\/\/currencylayer.com\/privacy',
  //   timestamp: 1561031945,
  //   source: 'USD',
  //   quotes: {
  //     USDEUR: 0.884295,
  //     USDXAU: 0.000724,
  //     USDXAG: 0.065073,
  //   },
  // };

  if (response) {
    const { quotes: { USDEUR, USDXAU, USDXAG } } = await response.json();

    return ({
      XAU: USDXAU / USDEUR,
      XAG: USDXAG / USDEUR,
    });
  }

  return {};
};

export default async (onlyLatest = false) => {
  let history = readFile(FILE_NAME);
  const today = new Date();

  // -- Get latest rate for this month
  console.log('⚙️  Fetching latest METALS rates...');
  history = {
    ...history,
    [(today).toISOString().substr(0, 7)]: await getRates(),
  };

  writeFile(FILE_NAME, history);
  console.log(`✅ Rebuilt METALS cache (${Object.keys(history).length} months) ...`);

  return history;
};
