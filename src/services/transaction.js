import Blockchain from 'vanillachain-core';

import { C, ERROR } from '../common';

const { BLOCKCHAIN } = C;

export default ({ props, session }, res) => {
  const {
    category, latitude, longitude, place, previousHash, title, type, value, ...data
  } = props;
  const year = new Date().getFullYear().toString();

  if (!session.vaults.includes(data.vault)) return ERROR.MESSAGE(res, { message: 'Vault not found.' });

  const txs = new Blockchain({ ...BLOCKCHAIN, file: session.hash, key: year });

  try {
    const tx = txs.addBlock({
      ...data,
      title: title && title.trim().length > 0 ? title : undefined,
      category: parseInt(category, 10),
      location: latitude && longitude
        ? { latitude: parseFloat(latitude, 10), longitude: parseFloat(longitude, 10), place }
        : undefined,
      type: parseInt(type, 10),
      value: parseFloat(value, 10),
    }, previousHash);

    return res.json({
      hash: tx.hash,
      timestamp: tx.data.timestamp || tx.timestamp,
      ...tx.data,
    });
  } catch (error) {
    return ERROR.MESSAGE(res, error);
  }
};
