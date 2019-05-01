import Blockchain from 'vanillachain-core';

import { C } from '../common';

const { BLOCKCHAIN, KEY } = C;

export default ({ session }, res) => {
  const cities = {};
  const regions = {};
  const countries = {};

  const { blocks: txs } = new Blockchain({
    ...BLOCKCHAIN, file: session.hash, key: KEY, readMode: true,
  });

  txs.forEach(({ data: { location: { place } = {} } = {} }) => {
    if (place) {
      const [city, region, country] = place.split(',');

      cities[city] = cities[city] ? cities[city] + 1 : 1;
      regions[region] = regions[region] ? regions[region] + 1 : 1;
      countries[country] = countries[country] ? countries[country] + 1 : 1;
    }
  });

  return res.json({
    cities,
    regions,
    countries,
  });
};
