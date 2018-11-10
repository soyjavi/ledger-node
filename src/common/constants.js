import dotenv from 'dotenv';

dotenv.config();
const {
  DIFFICULTY, INSTANCE, SECRET,
} = process.env;
const BLOCKCHAIN = { difficulty: parseInt(DIFFICULTY, 10), secret: SECRET };

export default {
  ENV: {
    DEVELOPMENT: true,
    PRODUCTION: false,
  },

  BLOCKCHAIN: { ...BLOCKCHAIN, file: INSTANCE, key: 'sessions' },
  BLOCKCHAIN_VAULTS: { ...BLOCKCHAIN, key: 'vaults' },
  BLOCKCHAIN_TXS: { ...BLOCKCHAIN, key: new Date().getFullYear().toString() },

  TX: {
    TYPE: {
      EXPENSE: 'expense',
      INCOME: 'income',
      TRANSFER: 'transfer',
    },
  },
};
