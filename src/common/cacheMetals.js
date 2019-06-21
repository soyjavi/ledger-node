import dotenv from 'dotenv';
import fetch from 'node-fetch';

import C from './constants';
import { readFile, writeFile } from './modules';

dotenv.config();
const { APILAYER_TOKEN } = process.env;
const { METALS, SERVICES } = C;
const FILE_NAME = 'metals.json';
const OUNZE_GRAM_RATIO = 0.03527396;

const getRates = async () => {
  const metals = METALS.join(',');
  const response = await fetch(`${SERVICES.METAL}/live?access_key=${APILAYER_TOKEN}&currencies=EUR,${metals}`);

  if (response) {
    const { quotes: { USDEUR, USDXAU, USDXAG } } = await response.json();

    return ({
      XAU: (USDXAU / USDEUR) / OUNZE_GRAM_RATIO,
      XAG: (USDXAG / USDEUR) / OUNZE_GRAM_RATIO,
    });
  }

  return {};
};

export default async () => {
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
