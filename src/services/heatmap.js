import dotenv from 'dotenv';
import https from 'https';

import { C } from '../common';

dotenv.config();
const { MAPBOX_ACCESS_TOKEN } = process.env;
const { MAPBOX } = C;
const HEATMAP_OPACITY = [0.2, 0.4, 0.6, 0.8];

export default async ({ props }, res) => {
  const {
    center = 'auto',
    color = '#FF4500',
    precission = 0.001,
    resolution = '512x256@2x',
  } = props;
  const heatmaps = [[], [], [], []];
  const gap = parseFloat(precission, 10);

  let { points } = props;
  points = points ? JSON.parse(points) : [];
  const max = Math.max(...points.map(([long, lat, amount = 1]) => amount));

  points.forEach((point) => {
    let [long, lat, amount = 1] = point;

    long = parseFloat(long, 10) - (gap / 2);
    lat = parseFloat(lat, 10);

    const box = [[long, lat], [long + gap, lat], [long + gap, lat + gap], [long, lat + gap], [long, lat]];

    // Determine level
    const percentage = Math.floor((amount * 100) / max);
    let index;
    if (percentage > 80) index = 3;
    else if (percentage > 50) index = 2;
    else if (percentage > 10) index = 1;
    else index = 0;

    heatmaps[index].push(box);
  });

  const geoJSON = { type: 'FeatureCollection', features: [] };
  heatmaps.forEach((coordinates, index) => {
    if (coordinates.length > 0) {
      geoJSON.features.push({
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates },
        properties: { 'stroke-width': 0, fill: color, 'fill-opacity': HEATMAP_OPACITY[index] },
      });
    }
  });

  const geoJSONUri = encodeURIComponent(JSON.stringify(geoJSON));
  const queryParams = `access_token=${MAPBOX_ACCESS_TOKEN}&${MAPBOX.PROPS}`;

  https.request({
    host: MAPBOX.HOST,
    path: `/${MAPBOX.PATH}/geojson(${geoJSONUri})/${center}/${resolution}?${queryParams}`,
  }, (response) => {
    if (response.statusCode === 200) {
      res.writeHead(200, {
        'Content-Type': response.headers['content-type'],
      });
      response.pipe(res);
    } else {
      res.writeHead(response.statusCode);
      res.end();
    }
  }).end();
};
