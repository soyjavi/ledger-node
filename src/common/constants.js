import dotenv from 'dotenv';

dotenv.config();
const { DIFFICULTY, INSTANCE, SECRET } = process.env;

export default {
  BLOCKCHAIN: {
    difficulty: parseInt(DIFFICULTY, 10), secret: SECRET, file: INSTANCE, key: 'sessions',
  },

  CURRENCY: 'EUR',
  // CURRENCIES: [
  //   'USD', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'BGN', 'BRL',
  //   'CZK', 'DKK', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'KRW', 'MXN',
  //   'MYR', 'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'RUB', 'SEK', 'SGD', 'THB',
  //   'TRY', 'ZAR',
  // ],
  CURRENCIES: [
    'AUD', 'CNY', 'HKD', 'JPY', 'KRW', 'MXN', 'MYR', 'THB', 'GBP', 'USD', 'RUB',
  ],

  CRYPTOS: [
    'BTC',
  ],

  ENV: {
    DEVELOPMENT: true,
    PRODUCTION: false,
  },

  KEY_TRANSACTIONS: 'txs',
  KEY_VAULTS: 'vaults',

  MAPBOX: {
    HOST: 'api.mapbox.com',
    PATH: 'styles/v1/mapbox/light-v9/static',
    PATH_DARK: 'styles/v1/mapbox/dark-v9/static',
    PROPS: 'attribution=false&logo=false',
  },

  SERVICES: {
    FIAT: 'https://api.exchangeratesapi.io',
    CRYPTO: 'https://min-api.cryptocompare.com',
  },

  TX: {
    TYPE: {
      EXPENSE: 'expense',
      INCOME: 'income',
      TRANSFER: 'transfer',
    },
  },
};
