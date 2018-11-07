import Blockchain from 'vanillachain-core';

export default ({ props, session }, res) => {
  const vaults = new Blockchain({ file: session.hash, keyChain: 'vaults' });
  const { hash: previousHash } = vaults.latestBlock;

  const vault = vaults.addBlock({ ...props, balance: parseFloat(props.balance, 10) }, previousHash);

  res.json({
    hash: vault.hash,
    ...vault.data,
  });
};
