import Blockchain from 'vanillachain-core';

import { C } from '../common';
import getRates from './modules/getRates';

const {
  BLOCKCHAIN, CURRENCY, KEY_TRANSACTIONS, KEY_VAULTS,
} = C;

export default async ({ session }, res) => {
  const { blocks: [, ...vaults] } = new Blockchain({ ...BLOCKCHAIN, ...session, key: KEY_VAULTS });
  const { latestBlock } = new Blockchain({ ...BLOCKCHAIN, ...session, key: KEY_TRANSACTIONS });

  const baseCurrency = vaults[0] ? vaults[0].data.currency : CURRENCY;

  return res.json({
    rates: await getRates(baseCurrency),
    baseCurrency,
    latestTransaction: {
      hash: latestBlock.hash,
      timestamp: latestBlock.timestamp,
    },
    vaults: vaults.map(({ data, hash }) => ({ hash, ...data })),
  });
};
