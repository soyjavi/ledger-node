import Blockchain from 'vanillachain-core';
import dotenv from 'dotenv';

dotenv.config();
const { DIFFICULTY, INSTANCE, SECRET } = process.env;

export default ({ props }, res) => {
  const blockchain = new Blockchain({
    difficulty: DIFFICULTY, file: INSTANCE, secret: SECRET,
  });
  const { hash: previousHash } = blockchain.latestBlock;
  const { hash } = blockchain.addBlock(props, previousHash);

  res.json({ hash });
};
