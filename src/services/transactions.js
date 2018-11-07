import Blockchain from 'vanillachain-core';

import { C } from '../common';

const { BLOCKCHAIN_TXS } = C;

export default ({ session }, res) => {
  const { blocks: [, ...txs] } = new Blockchain({ ...BLOCKCHAIN_TXS, file: session.hash });

  return res.json({
    txs: txs.map(({ hash, timestamp, data }) => ({ hash, timestamp, ...data })),
  });
};
