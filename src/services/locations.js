import Blockchain from 'vanillachain-core';

import { C } from '../common';

const { BLOCKCHAIN, KEY } = C;

export default ({ props, session }, res) => {
  const { from, to } = props;

  let { blocks: txs } = new Blockchain({
    ...BLOCKCHAIN, file: session.hash, key: KEY, readMode: true,
  });

  res.json({
    txs,
  });
};
