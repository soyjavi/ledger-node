import dotenv from 'dotenv';
import Blockchain from 'vanillachain-core';

import { C } from '../common';

dotenv.config();
const { SECRET } = process.env;
const { BLOCKCHAIN, KEY_TRANSACTIONS, KEY_VAULTS } = C;

const copy = (blocks = [], blockchain) => {
  let { latestBlock: block } = blockchain;

  blocks.forEach(({ data, timestamp, ...fork }, index) => {
    if (data) {
      block = blockchain.addBlock({ ...data, timestamp: data.timestamp || timestamp }, block.hash, fork);
      console.log(`${index}. (${block.nonce}) .${block.hash}`);
    }
  });

  return blockchain.blocks.length;
};

export default async ({ props, session }, res) => {
  const { file, secure = SECRET } = props;
  const connection = { file, secret: secure, readMode: false };

  // -- Get  blocks
  const { blocks: [, ...vaults] } = new Blockchain({ ...BLOCKCHAIN, ...connection, key: KEY_VAULTS });
  const { blocks: [, ...txs] } = new Blockchain({ ...BLOCKCHAIN, ...connection, key: KEY_TRANSACTIONS });

  // -- Wipe blockchain
  const blockchain = new Blockchain({ ...BLOCKCHAIN, ...session, key: KEY_VAULTS });
  blockchain.wipe();

  return res.json({
    file,
    secure,
    origin: {
      ...connection,
      vaults: vaults.length + 1,
      txs: txs.length + 1,
    },
    fork: {
      ...session,
      vaults: copy(vaults, new Blockchain({ ...BLOCKCHAIN, ...session, key: KEY_VAULTS })),
      txs: copy(txs, new Blockchain({ ...BLOCKCHAIN, ...session, key: KEY_TRANSACTIONS })),
    },
  });
};
