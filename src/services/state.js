import { Blockchain } from "vanilla-blockchain";

import { C } from "../common";

const { BLOCKCHAIN_NODE, KEY_VAULTS, KEY_TRANSACTIONS } = C;

export default ({ props, session }, res) => {
  const blockchain = new Blockchain({
    ...BLOCKCHAIN_NODE,
    ...session,
  });

  const { latestBlock: latestVault, blocks: blocksVault } = blockchain.get(
    KEY_VAULTS
  );

  const { latestBlock: latestTx, blocks: blocksTx } = blockchain.get(
    KEY_TRANSACTIONS
  );

  res.json({
    vaults: { latestBlock: latestVault.hash, blocks: blocksVault.length },
    txs: { latestBlock: latestTx.hash, blocks: blocksTx.length },
  });
};
