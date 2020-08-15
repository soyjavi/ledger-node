import { Blockchain } from "vanilla-blockchain";
import { Storage } from "vanilla-storage";

import { C, ERROR } from "../common";

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
export const sync = (
  { props: { blockchain, block, blocks = [], key }, session },
  res
) => {
  const storage = new Storage({ ...STORAGE, ...session });
  let response;

  if (blockchain) {
    const { vaults, txs } = blockchain;

    storage.wipe();
    storage.get("vaults").save(vaults);
    storage.get("txs").save(txs);

    response = blockchain;
  } else if (key) {
    storage.get(key);
    if (block) response = storage.push(block);
    else if (blocks) response = blocks.map((block) => storage.push(block));
  }

  res.json(response);
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
