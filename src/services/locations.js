import dotenv from 'dotenv';
// import https from 'https';

import { C } from '../common';

dotenv.config();
const { MAPBOX_ACCESS_TOKEN } = process.env;
const { MAPBOX } = C;
const HEATMAP_COLORS = ['#FFD700', '#FFA500', '#FF4500'];

export default async ({ props }, res) => {
  const {
    center = 'auto',
    points,
    precission = 0.001,
    resolution = '512x256@2x',
  } = props;
  const heatmaps = { low: [], regular: [], high: [] };
  const gap = parseFloat(precission, 10);

  (points ? JSON.parse(points) : []).forEach((point) => {
    let [long, lat, value] = point;

    long = parseFloat(long, 10) - (gap / 2);
    lat = parseFloat(lat, 10);

    const box = [[long, lat], [long + gap, lat], [long + gap, lat + gap], [long, lat + gap], [long, lat]];

    if (value === 1) heatmaps.low.push(box);
    else if (value <= 10) heatmaps.regular.push(box);
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
  const path = `/${MAPBOX.PATH}/geojson(${geoJSONUri})/${center}/${resolution}?access_token=${MAPBOX_ACCESS_TOKEN}&${MAPBOX.PROPS}`;
  const map = `https://${MAPBOX.HOST}${path}`;

  // https.request({
  //   host: MAPBOX.HOST,
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

  return res.json({ map });
};
