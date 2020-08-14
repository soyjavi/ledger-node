import { Blockchain } from "vanilla-blockchain";
import { Storage } from "vanilla-storage";

import { C } from "../common";

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
export const state = ({ props, session }, res) => {
  const storage = new Storage({ ...STORAGE, ...session });

  const blocks = (key) => storage.get(key).value.length;

  const latestHash = (key) => {
    const { value = [] } = storage.get(key);
    return value.length > 0 ? value.slice(-1).pop().hash : undefined;
  };

  res.json({
    blocks: { txs: blocks(KEY_TRANSACTIONS), vaults: blocks(KEY_VAULTS) },
    latestHash: {
      txs: latestHash(KEY_TRANSACTIONS),
      vaults: latestHash(KEY_VAULTS),
    },
  });
};

// -----------------------------------------------------------------------------
// SYNC
// -----------------------------------------------------------------------------
export const sync = ({ props: { key, block, blocks }, session }, res) => {
  const storage = new Storage({ ...STORAGE, ...session });
  let response;

  storage.get(key);
  if (block) response = storage.push(block);
  else if (blocks) response = blocks.map((block) => storage.push(block));

  res.json(response);
};

// -----------------------------------------------------------------------------
// FORK
// -----------------------------------------------------------------------------
export const fork = ({ props: { blockchain } }, res) => {
  const [secret, filename] = blockchain.split("|");

  const storage = new Storage({ ...STORAGE, filename, secret });

  res.json({
    vaults: storage.get("vaults").value,
    txs: storage.get("txs").value,
  });
};
