import dotenv from 'dotenv';

dotenv.config();
const {
  DIFFICULTY, INSTANCE, SECRET,
} = process.env;

export default {
  CURRENCY: 'USD',

  CURRENCIES: [
    'USD',
    'EUR',
    'JPY',
    'GBP',
    'AUD',
    'CAD',
    'CHF',
    'CNY',
    'HKD',
    'BGN',
    'BRL',
    'CZK',
    'DKK',
    'HRK',
    'HUF',
    'IDR',
    'ILS',
    'INR',
    'ISK',
    'KRW',
    'MXN',
    'MYR',
    'NOK',
    'NZD',
    'PHP',
    'PLN',
    'RON',
    'RUB',
    'SEK',
    'SGD',
    'THB',
    'TRY',
    'ZAR',
  ],

  ENV: {
    DEVELOPMENT: true,
    PRODUCTION: false,
  },

  BLOCKCHAIN: { 
    difficulty: parseInt(DIFFICULTY, 10), secret: SECRET, file: INSTANCE, key: 'sessions', 
  },

  TX: {
    TYPE: {
      EXPENSE: 'expense',
      INCOME: 'income',
      TRANSFER: 'transfer',
    },
  },
};
