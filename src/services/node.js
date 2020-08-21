import fs from "fs";
import path from "path";

import { Blockchain } from "vanilla-blockchain";
import { Storage } from "vanilla-storage";

import { C, ERROR } from "../common";

const { BLOCKCHAIN, STORAGE, KEY_VAULTS, KEY_TRANSACTIONS } = C;

const latestHash = (storage, key) => {
  const { value = [] } = storage.get(key);
  return value.length > 0 ? value.slice(-1).pop().hash : undefined;
};

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
  const storage = new Storage({ ...STORAGE, ...session });

  const blocks = (key) => storage.get(key).value.length;

  res.json({
    blocks: { txs: blocks(KEY_TRANSACTIONS), vaults: blocks(KEY_VAULTS) },
    latestHash: {
      txs: latestHash(storage, KEY_TRANSACTIONS),
      vaults: latestHash(storage, KEY_VAULTS),
    },
  });
};

// -----------------------------------------------------------------------------
// SYNC
// -----------------------------------------------------------------------------
export const sync = (
  { props: { blockchain, block, blocks = [], key }, session },
  res
) => {
  let response;

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

    const { previousHash } = block || blocks[0] || {};
    const hash = latestHash(storage, key);

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
