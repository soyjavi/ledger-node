import { Blockchain } from "vanilla-blockchain";

import { C } from "../common";

const { BLOCKCHAIN, KEY_VAULTS } = C;

export default ({ props, session }, res) => {
  const vaults = new Blockchain({ ...BLOCKCHAIN, ...session, key: KEY_VAULTS });
  const { hash: previousHash } = vaults.latestBlock;

  const vault = vaults.addBlock(
    { ...props, balance: parseFloat(props.balance, 10) },
    previousHash
  );

  res.json({
    hash: vault.hash,
    ...vault.data,
  });
};
