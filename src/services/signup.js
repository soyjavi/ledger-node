import Blockchain from 'vanillachain-core';

import { C } from '../common';

const { BLOCKCHAIN } = C;

export default ({ props }, res) => {
  const blockchain = new Blockchain(BLOCKCHAIN);

  const { hash } = blockchain.addBlock(props, blockchain.latestBlock.hash);

  res.json({
    hash,
  });
};
