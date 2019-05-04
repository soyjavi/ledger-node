import dotenv from 'dotenv';
// import https from 'https';
import Blockchain from 'vanillachain-core';

import { C } from '../common';

dotenv.config();
const { MAPBOX_ACCESS_TOKEN } = process.env;
const { BLOCKCHAIN, KEY, MAPBOX } = C;
const HEATMAP_COLORS = ['#FFD700', '#FFA500', '#FF4500'];

export default async ({ props, session }, res) => {
  const cities = {};
  const countries = {};
  const points = {};
  const heatmaps = { low: [], regular: [], high: [] };
  let { blocks: txs } = new Blockchain({
    ...BLOCKCHAIN, file: session.hash, key: KEY, readMode: true,
  });
  let { year, month } = props;

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

  // -- Heat Map
  let precission = 3;
  if (Object.keys(countries).length > 1) precission = 0;
  else if (Object.keys(cities).length > 1) precission = 1;

  txs.forEach(({ data: { location: { latitude, longitude } = {} } = {} }) => {
    if (latitude && longitude) {
      const point = `${longitude.toFixed(precission)},${latitude.toFixed(precission)}`;
      points[point] = points[point] ? points[point] + 1 : 1;
    }
  });

  Object.keys(points).forEach((location) => {
    let gap = 0.001;
    if (precission === 1) gap = 0.1;
    else if (precission === 0) gap = 1;

    let [lon, lat] = location.split(',');
    lon = parseFloat(lon, 10);
    lat = parseFloat(lat, 10);
    // lon = parseFloat(lon, 10) - (gap / 2);
    // lat = parseFloat(lat, 10) - (gap / 2);

    const box = [[lon, lat], [lon + gap, lat], [lon + gap, lat + gap], [lon, lat + gap], [lon, lat]];

    if (points[location] === 1) heatmaps.low.push(box);
    else if (points[location] <= 10) heatmaps.regular.push(box);
    else heatmaps.high.push(box);
  });

  const geoJSON = { type: 'FeatureCollection', features: [] };
  Object.keys(heatmaps).forEach((level, index) => {
    if (heatmaps[level].length > 0) {
      geoJSON.features.push({
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: heatmaps[level] },
        properties: { 'stroke-width': 0, fill: HEATMAP_COLORS[index], 'fill-opacity': 0.75 },
      });
    }
  });

  const geoJSONUri = encodeURIComponent(JSON.stringify(geoJSON));
  const map = `https://${MAPBOX.HOST}/${MAPBOX.PATH}/geojson(${geoJSONUri})/auto/512x256@2x?access_token=${MAPBOX_ACCESS_TOKEN}&${MAPBOX.PROPS}`;

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
    points,
    map,
  });
};
