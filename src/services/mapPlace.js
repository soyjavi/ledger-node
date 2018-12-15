import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
const { MAPBOX_ACCESS_TOKEN } = process.env;
const MAPBOX_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const PARAMETERS = 'language=en&limit=1&types=place';

export default async ({ props: { latitude, longitude } }, res, next) => {
  const url = `${MAPBOX_URL}/${latitude},${longitude}.json?${PARAMETERS}&access_token=${MAPBOX_ACCESS_TOKEN}`;
  const response = await fetch(url);
  let place;

  if (response) {
    const { features = [] } = await response.json() || {};
    place = features[0] ? features[0].place_name_en : 'Unknown Place';
  }

  res.dataSource = { place };

  next();
};
