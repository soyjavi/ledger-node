import Blockchain from 'vanillachain-core';

import { cache, C } from '../common';

const { BLOCKCHAIN_VAULTS } = C;

export default ({ props, session }, res) => {
  const vaults = new Blockchain({ ...BLOCKCHAIN_VAULTS, file: session.hash });
  const { hash: previousHash } = vaults.latestBlock;

  const vault = vaults.addBlock({ ...props, balance: parseFloat(props.balance, 10) }, previousHash);
  cache.set(session.hash, undefined);

  res.json({
    hash: vault.hash,
    ...vault.data,
  });
};
