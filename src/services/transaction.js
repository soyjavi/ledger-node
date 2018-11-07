import Blockchain from 'vanillachain-core';

export default ({ props }, res) => {
  const { previousHash, ...data } = props;
  const blockchain = new Blockchain({ file: 'voltvault' });

  const block = blockchain.addBlock(data, previousHash);

  res.json({
    ...props,
    block,
  });
};
