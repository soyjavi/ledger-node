import dotenv from "dotenv";

dotenv.config();
const { DIFFICULTY, INSTANCE, SECRET } = process.env;

export const C = {
  BLOCKCHAIN: {
    defaults: { sessions: [] },
    difficulty: parseInt(DIFFICULTY, 10),
    filename: INSTANCE,
    key: "sessions",
    secret: SECRET,
  },

  CRYPTOS: ["BTC", "ETH"],

  CURRENCIES: [
    "AUD",
    "CNY",
    "GBP",
    "EUR",
    "HKD",
    "JPY",
    "KRW",
    "MXN",
    "MYR",
    "RUB",
    "SGD",
    "THB",
    "USD",
    "VND",
    // Metals
    "XAU",
    "XAG",
    // Crypto
    "BTC",
    "ETH",
  ],

  CURRENCY: "EUR",

  ENV: {
    DEVELOPMENT: true,
    PRODUCTION: false,
  },

  KEY_TRANSACTIONS: "txs",
  KEY_VAULTS: "vaults",

  MAPBOX: {
    HOST: "api.mapbox.com",
    PATH: "styles/v1/mapbox/light-v9/static",
    PATH_DARK: "styles/v1/mapbox/dark-v9/static",
    PROPS: "attribution=false&logo=false",
  },

  SERVICES: {
    CRYPTOS: "http://api.coinlayer.com/api",
    CURRENCIES: "http://data.fixer.io/api",
  },

  STORAGE: {
    defaults: { txs: [], vaults: [] },
  },

  TX: {
    TYPE: {
      EXPENSE: "expense",
      INCOME: "income",
      TRANSFER: "transfer",
    },
  },
};
