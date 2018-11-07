import dotenv from 'dotenv';

dotenv.config();
const { DIFFICULTY, INSTANCE, SECRET } = process.env;
const BLOCKCHAIN = { difficulty: DIFFICULTY, secret: SECRET };

export default {
  ENV: {
    DEVELOPMENT: true,
    PRODUCTION: false,
  },

  BLOCKCHAIN: { ...BLOCKCHAIN, file: INSTANCE, key: 'sessions' },
  BLOCKCHAIN_VAULTS: { ...BLOCKCHAIN, key: 'vaults' },
  BLOCKCHAIN_TXS: { ...BLOCKCHAIN, key: 'txs' },

  TX: {
    TYPE: {
      EXPENSE: 'expense',
      INCOME: 'iconme',
      TRANSFER: 'transfer',
    },
  },
};
