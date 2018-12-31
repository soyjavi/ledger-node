import Blockchain from 'vanillachain-core';

import { cache, C } from '../common';

const { BLOCKCHAIN } = C;
const KEY_VAULTS = 'vaults';

export default ({ props, session }, res) => {
  const vaults = new Blockchain({ ...BLOCKCHAIN, file: session.hash, key: KEY_VAULTS });
  const { hash: previousHash } = vaults.latestBlock;

  const vault = vaults.addBlock({ ...props, balance: parseFloat(props.balance, 10) }, previousHash);
  cache.set(session.hash, undefined);

  res.json({
    hash: vault.hash,
    ...vault.data,
  });
};
