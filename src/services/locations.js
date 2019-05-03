import dotenv from 'dotenv';
// import https from 'https';
import Blockchain from 'vanillachain-core';

import { C } from '../common';

dotenv.config();
const { MAPBOX_ACCESS_TOKEN } = process.env;
const { BLOCKCHAIN, KEY } = C;
const HOST = 'api.mapbox.com';
const PATH = 'v4/mapbox.light';

export default async ({ props, session }, res) => {
  const cities = {};
  const countries = {};
  const points = {};
  let { blocks: txs } = new Blockchain({
    ...BLOCKCHAIN, file: session.hash, key: KEY, readMode: true,
  });
  let { year, month, week } = props;

  // -- Filter
  if (year || month) {
    year = parseInt(year, 10);
    month = parseInt(month, 10) - 1;

    txs = txs.filter(({ timestamp }) => {
      const date = new Date(timestamp);
      return (year && !month && date.getFullYear() === year)
        || (date.getFullYear() === year && date.getMonth() === month);
    });
  }

  // -- Get locations
  txs.forEach(({ data: { location: { place } = {} } = {} }) => {
    if (place) {
      const [city, region, country] = place.split(',');

      cities[city] = cities[city] ? cities[city] + 1 : 1;
      countries[country] = countries[country] ? countries[country] + 1 : 1;
    }
  });

  //-- Process Map
  const precission = Object.keys(countries).length > 1 ? 0 : 2;
  txs.forEach(({ data: { location: { latitude, longitude } = {} } = {} }) => {
    if (latitude && longitude) {
      const point = `${longitude.toFixed(precission)},${latitude.toFixed(precission)}`;
      points[point] = points[point] ? points[point] + 1 : 1;
    }
  });

  let pins = '';
  Object.keys(points).forEach((location) => {
    let content = `s-${points[location]}`;
    if (points[location] > 99) content = 'l-star';
    // else if (points[location] === 1) content = 'm-circle';

    pins += `${pins !== '' ? ',' : ''}pin-${content}+7966FF(${location})`;
  });

  const path = `https:/${HOST}/${PATH}/${pins}/auto/480x256@2x.png?access_token=${MAPBOX_ACCESS_TOKEN}`;

  // https.request({
  //   host: HOST,
  //   path,
  // }, (response) => {
  //   if (response.statusCode === 200) {
  //     res.writeHead(200, {
  //       'Content-Type': response.headers['content-type'],
  //     });
  //     response.pipe(res);
  //   } else {
  //     res.writeHead(response.statusCode);
  //     res.end();
  //   }
  // }).end();

  return res.json({
    cities,
    countries,
    map: path,
  });
};
