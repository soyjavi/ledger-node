import dotenv from 'dotenv';
import Blockchain from 'vanillachain-core';

import { C } from '../common';

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

  const connection = {
    ...BLOCKCHAIN, file, secret: secure, readMode: true,
  };
  const connectionFork = { ...BLOCKCHAIN, file: hash, secret };

  // -- vaults
  const { blocks: [, ...vaults] } = new Blockchain({ ...connection, key: KEY_VAULTS });
  const { blocks: [, ...txs] } = new Blockchain({ ...connection, key: '2018' });

  return res.json({
    file,
    secure,
    vaults: copy(vaults, new Blockchain({ ...connectionFork, key: KEY_VAULTS })),
    txs: copy(txs, new Blockchain({ ...connectionFork, key: KEY_TRANSACTIONS })),
  });
};
