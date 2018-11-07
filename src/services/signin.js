import Blockchain from 'vanillachain-core';

import { C, ERROR } from '../common';

const { BLOCKCHAIN, BLOCKCHAIN_VAULTS } = C;

export default ({ props }, res) => {
  const { blocks } = new Blockchain(BLOCKCHAIN);

  const block = blocks.find(({ data: { fingerprint, pin } }) => fingerprint === props.fingerprint && pin === props.pin);
  if (!block) return ERROR.NOT_FOUND(res);

  const { blocks: [, ...vaults] } = new Blockchain({ ...BLOCKCHAIN_VAULTS, file: block.hash });

  return res.json({
    hash: block.hash,
    vaults: vaults.map(({ data, hash }) => ({ hash, ...data })),
  });
};
