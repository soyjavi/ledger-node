import Blockchain from 'vanillachain-core';

import { C, ERROR } from '../common';

const { BLOCKCHAIN } = C;

export default ({ props }, res) => {
  const { blocks } = new Blockchain(BLOCKCHAIN);

  const block = blocks.find(({ data: { fingerprint, pin } }) => fingerprint === props.fingerprint && pin === props.pin);
  if (!block) return ERROR.NOT_FOUND(res);

  return res.json({
    hash: block.hash,
  });
};
