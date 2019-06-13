import dotenv from 'dotenv';
import Blockchain from 'vanillachain-core';

import { C, cache } from '../common';

dotenv.config();
const { SECRET } = process.env;
const { BLOCKCHAIN, KEY_TRANSACTIONS, KEY_VAULTS } = C;

const copy = (blocks = [], blockchain) => {
  let [block] = blockchain.blocks.slice(-1);

  blocks.forEach(({ data, timestamp }, index) => {
    if (data) {
      block = blockchain.addBlock({ ...data, timestamp }, block.hash);
      console.log(`${index}. (${block.nonce}) .${block.hash}`);
    }
  });

  return blockchain.blocks.length;
};

export default async ({ props, session: { hash, secret } }, res) => {
  const { file, secure = SECRET } = props;
  const connection = { file, secret: secure, readMode: true };
  const connectionFork = { file: hash, secret };

  // -- Get  blocks
  const { blocks: [, ...vaults] } = new Blockchain({ ...BLOCKCHAIN, ...connection, key: KEY_VAULTS });
  const { blocks: [, ...txs] } = new Blockchain({ ...BLOCKCHAIN, ...connection, key: '2018' });

  cache.set(hash, undefined);

  return res.json({
    file,
    secure,
    vaults: copy(vaults, new Blockchain({ ...BLOCKCHAIN, ...connectionFork, key: KEY_VAULTS })),
    txs: copy(txs, new Blockchain({ ...BLOCKCHAIN, ...connectionFork, key: KEY_TRANSACTIONS })),
  });
};
