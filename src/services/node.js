import fs from "fs";
import path from "path";

import { Blockchain } from "vanilla-blockchain";
import { Storage } from "vanilla-storage";

import { C, cache, ERROR } from "../common";

const { BLOCKCHAIN, STORAGE, KEY_VAULTS, KEY_TRANSACTIONS } = C;

// -----------------------------------------------------------------------------
// SIGNUP
// -----------------------------------------------------------------------------
export const signup = ({ props }, res) => {
  const blockchain = new Blockchain(BLOCKCHAIN);

  const { hash: authorization } = blockchain.addBlock(
    props,
    blockchain.latestBlock.hash
  );

  res.json({
    authorization,
  });
};

// -----------------------------------------------------------------------------
// STATE
// -----------------------------------------------------------------------------
export const state = ({ session }, res) => {
  const cacheKey = `state:${session.filename}`;
  let response = cache.get(cacheKey);

  if (!response) {
    const storage = new Storage({ ...STORAGE, ...session });
    const info = (key) => {
      const { value = [] } = storage.get(key);

      return {
        latestHash: value.length > 0 ? value[value.length - 1].hash : undefined,
        length: value.length,
      };
    };

    response = {
      txs: info(KEY_TRANSACTIONS),
      vaults: info(KEY_VAULTS),
    };
  }

  cache.set(cacheKey, response, 3600);

  res.json(response);
};

// -----------------------------------------------------------------------------
// SYNC
// -----------------------------------------------------------------------------
export const sync = (
  { props: { blockchain, block, blocks = [], key }, session },
  res
) => {
  cache.set(`state:${session.filename}`, undefined);

  if (blockchain) {
    const filePath = path.resolve(".", `store/${session.filename}.json`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    const storage = new Storage({ ...STORAGE, ...session });
    Object.keys(blockchain).forEach((key) => {
      storage.get(key);
      blockchain[key].forEach((block) => storage.push(block));
    });
  } else if (key) {
    const storage = new Storage({ ...STORAGE, ...session });
    storage.get(key);

    const { value = [] } = storage;
    const hash = value.length > 0 ? value.slice(-1).pop().hash : undefined;
    const { previousHash } = block || blocks[0] || {};

    if (hash !== previousHash) return ERROR.NOT_FOUND(res);

    if (block) storage.push(block);
    else if (blocks) blocks.map((block) => storage.push(block));
  }

  state({ session }, res);
};

// -----------------------------------------------------------------------------
// FORK
// -----------------------------------------------------------------------------
export const blockchain = ({ props: { blockchain } }, res) => {
  const [secret, filename] = blockchain.split("|");

  try {
    const storage = new Storage({ ...STORAGE, filename, secret });
    res.json({
      txs: storage.get("txs").value,
      vaults: storage.get("vaults").value,
    });
  } catch (error) {
    return ERROR.MESSAGE(res, error);
  }
};
