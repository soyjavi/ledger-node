import Blockchain from 'vanillachain-core';

import { C } from '../common';

const { BLOCKCHAIN, KEY } = C;

export default async ({ props, session }, res) => {
  const {
    file,
  } = props;

  const { blocks: [, ...blocks] } = new Blockchain({
    ...BLOCKCHAIN, file: session.hash, key: KEY, readMode: true,
  });

  const fork = new Blockchain({ ...BLOCKCHAIN, file, key: KEY });
  let { blocks: [block] } = fork;

  blocks.forEach(({ data, timestamp }) => {
    if (data) block = fork.addBlock({ ...data, timestamp }, block.hash);
  });

  res.json({
    origin: { file: session.hash, blocks: blocks.length + 1 },
    fork: { file, blocks: fork.blocks.length },
  });
};
