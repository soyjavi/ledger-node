import Blockchain from 'vanillachain-core';

import { C, ERROR } from '../common';

const { ENV: { DIFFICULTY, INSTANCE, SECRET } } = C;

export default ({ props }, res) => {
  const { blocks } = new Blockchain({
    difficulty: DIFFICULTY, file: INSTANCE, secret: SECRET,
  });

  const block = blocks.find(({ data: { fingerprint, pin } }) => fingerprint === props.fingerprint && pin === props.pin);
  if (!block) ERROR.NOT_FOUND(res);

  res.json({ hash: block.hash });
};
