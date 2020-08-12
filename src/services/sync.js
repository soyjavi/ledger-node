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
export const syncState = ({ props, session }, res) => {
  const storage = new Storage({ ...STORAGE, ...session });

  const summaryKey = (key) => {
    const { value = [] } = storage.get(key);

    return {
      latestHash: value.length > 0 ? value.slice(-1).pop().hash : undefined,
      length: value.length,
    };
  };

  res.json({
    txs: summaryKey(KEY_TRANSACTIONS),
    vaults: summaryKey(KEY_VAULTS),
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
