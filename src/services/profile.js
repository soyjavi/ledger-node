import Blockchain from 'vanillachain-core';

import { C } from '../common';
import { cryptos, rates } from './modules';

const { BLOCKCHAIN_VAULTS, BLOCKCHAIN_TXS, CURRENCY } = C;

export default async ({ session }, res) => {
  const year = new Date().getFullYear().toString();

  const { blocks: [, ...vaults] } = new Blockchain({ ...BLOCKCHAIN_VAULTS, file: session.hash });
  const baseCurrency = vaults[0] ? vaults[0].data.currency : CURRENCY;

  const { latestBlock } = new Blockchain({ ...BLOCKCHAIN_TXS, file: session.hash, key: year });

  return res.json({
    baseCurrency,
    latestTransaction: {
      hash: latestBlock.hash,
      timestamp: latestBlock.timestamp,
    },
    rates: {
      ...(await rates(baseCurrency)),
      BTC: 1 / (await cryptos('BTC'))[baseCurrency],
    },
    vaults: vaults.map(({ data, hash }) => ({ hash, ...data })),
  });
};
