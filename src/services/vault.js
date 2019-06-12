import Blockchain from 'vanillachain-core';

import { cache, C } from '../common';

const { BLOCKCHAIN, KEY_VAULTS } = C;

export default ({ props, session: { hash, secret } }, res) => {
  const vaults = new Blockchain({
    ...BLOCKCHAIN, file: hash, key: KEY_VAULTS, secret,
  });
  const { hash: previousHash } = vaults.latestBlock;

  const vault = vaults.addBlock({ ...props, balance: parseFloat(props.balance, 10) }, previousHash);
  cache.set(hash, undefined);

  res.json({
    hash: vault.hash,
    ...vault.data,
  });
};
