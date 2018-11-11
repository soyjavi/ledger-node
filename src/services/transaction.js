import Blockchain from 'vanillachain-core';

import { C, ERROR } from '../common';

const { BLOCKCHAIN_TXS } = C;

export default ({ props, session }, res) => {
  const { previousHash, ...data } = props;
  const year = new Date().getFullYear().toString();

  if (!session.vaults.includes(data.vault)) return ERROR.MESSAGE(res, { message: 'Vault not found.' });

  const txs = new Blockchain({ ...BLOCKCHAIN_TXS, file: session.hash, key: year });
  const tx = txs.addBlock({
    ...data,
    category: parseInt(data.category, 10),
    type: parseInt(data.type, 10),
    value: parseFloat(data.value, 10),
  }, previousHash);

  return res.json({
    hash: tx.hash,
    timestamp: tx.data.timestamp || tx.timestamp,
    ...tx.data,
  });
};
