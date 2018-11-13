import Blockchain from 'vanillachain-core';

import { C } from '../common';

const { BLOCKCHAIN_VAULTS, BLOCKCHAIN_TXS, CURRENCY } = C;

export default ({ session }, res) => {
  const { blocks: [, ...vaults] } = new Blockchain({ ...BLOCKCHAIN_VAULTS, file: session.hash });
  const year = new Date().getFullYear().toString();

  const { latestBlock } = new Blockchain({ ...BLOCKCHAIN_TXS, file: session.hash, key: year });

  return res.json({
    currency: vaults[0] ? vaults[0].data.currency : CURRENCY,
    latestTransaction: {
      hash: latestBlock.hash,
      timestamp: latestBlock.timestamp,
    },
    vaults: vaults.map(({ data, hash }) => ({ hash, ...data })),
  });
};
