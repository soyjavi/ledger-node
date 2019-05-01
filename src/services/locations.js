import Blockchain from 'vanillachain-core';

import { C } from '../common';

const { BLOCKCHAIN, KEY } = C;

export default ({ props, session }, res) => {
  let { year, month } = props;
  const cities = {};
  const regions = {};
  const countries = {};

  let { blocks: txs } = new Blockchain({
    ...BLOCKCHAIN, file: session.hash, key: KEY, readMode: true,
  });

  if (year || month) {
    year = parseInt(year, 10);
    month = parseInt(month, 10);

    txs = txs.filter(({ timestamp }) => {
      const date = new Date(timestamp);
      return (year && !month && date.getFullYear() === year)
        || (date.getFullYear() === year && date.getMonth() === month);
    });
  }

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
