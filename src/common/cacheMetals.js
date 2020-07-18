import dotenv from "dotenv";
import fetch from "node-fetch";

import C from "./constants";
import { readFile, writeFile } from "./modules";

dotenv.config();
const { APILAYER_TOKEN } = process.env;
const { METALS, SERVICES } = C;
const FILE_NAME = "metals.json";
const OUNZE_GRAM_RATIO = 0.03527396;

const getRates = async () => {
  const metals = METALS.join(",");
  const response = await fetch(
    `${SERVICES.METAL}/live?access_key=${APILAYER_TOKEN}&currencies=EUR,${metals}`
  );

  if (response) {
    const {
      success,
      quotes: { USDEUR, USDXAU, USDXAG } = {},
    } = await response.json();

    return success
      ? {
          XAU: USDXAU / USDEUR / OUNZE_GRAM_RATIO,
          XAG: USDXAG / USDEUR / OUNZE_GRAM_RATIO,
        }
      : undefined;
  }
};

export default async () => {
  let history = readFile(FILE_NAME);
  const today = new Date();

  // -- Get latest rate for this month
  console.log("⚙️  Fetching latest METALS rates...");
  const key = today.toISOString().substr(0, 7);
  history = {
    ...history,
    [key]: (await getRates()) || history[key],
  };

  writeFile(FILE_NAME, history);
  console.log(
    `✅ Rebuilt METALS cache (${Object.keys(history).length} months) ...`
  );

  return history;
};
