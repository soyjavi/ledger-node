import Blockchain from 'vanillachain-core';

import { C } from '../common';
import getRates from './modules/getRates';

const { BLOCKCHAIN, CURRENCY, KEY } = C;

export default async ({ session }, res) => {
  const { blocks: [, ...vaults] } = new Blockchain({ ...BLOCKCHAIN, file: session.hash, key: 'vaults' });
  const { latestBlock } = new Blockchain({ ...BLOCKCHAIN, file: session.hash, key: KEY });
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
