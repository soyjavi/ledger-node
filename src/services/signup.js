import { Blockchain } from "vanilla-blockchain";

import { C } from "../common";

const { BLOCKCHAIN, KEY_VAULTS } = C;

export default ({ props }, res) => {
  const blockchain = new Blockchain(BLOCKCHAIN);

  const { hash: authorization } = blockchain.addBlock(
    props,
    blockchain.latestBlock.hash
  );

  res.json({
    authorization,
  });
};
