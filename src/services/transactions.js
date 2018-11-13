import Blockchain from 'vanillachain-core';

import { C } from '../common';

const { BLOCKCHAIN_TXS } = C;

export default ({ props: { year = new Date().getFullYear().toString() }, session }, res) => {
  const { blocks: [, ...txs] } = new Blockchain({
    ...BLOCKCHAIN_TXS, file: session.hash, key: year, readMode: true,
  });

  return res.json({
    txs: txs.map(({ hash, timestamp, data }) => ({ hash, timestamp: data.timestamp || timestamp, ...data })),
  });
};
