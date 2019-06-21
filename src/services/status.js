import Blockchain from 'vanillachain-core';
import dotenv from 'dotenv';

import { cache, C } from '../common';
import PKG from '../../package.json';

dotenv.config();
const { INSTANCE } = process.env;
const { BLOCKCHAIN } = C;

export default (req, res, next) => {
  const blockchain = new Blockchain(BLOCKCHAIN);

  res.dataSource = {
    instance: INSTANCE,
    version: PKG.version,
    cache: cache.status.bytes,
    sessions: blockchain.blocks.length,
  };

  next();
};
