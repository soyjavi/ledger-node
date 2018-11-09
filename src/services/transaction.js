import Blockchain from 'vanillachain-core';

import { C, ERROR } from '../common';

const { BLOCKCHAIN_TXS } = C;

export default ({ props, session }, res) => {
  const { previousHash, ...data } = props;

  if (!session.vaults.includes(data.vault)) return ERROR.MESSAGE(res, { message: 'Vault not found.' });

  const txs = new Blockchain({ ...BLOCKCHAIN_TXS, file: session.hash });
  const tx = txs.addBlock({ ...data, value: parseFloat(data.value, 10) }, txs.latestBlock.hash);

  return res.json({
    hash: tx.hash,
    timestamp: tx.hash,
    ...tx.data,
  });
};
