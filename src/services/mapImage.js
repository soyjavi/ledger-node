import dotenv from 'dotenv';
import https from 'https';

dotenv.config();
const { MAPBOX_ACCESS_TOKEN } = process.env;
const HOST = 'api.mapbox.com';
const PATH = '/styles/v1/mapbox/light-v9/static';

export default async ({ props }, res) => {
  const {
    latitude, longitude, resolution = '480x192', zoom = 14,
  } = props;

  https.request({
    host: HOST,
    path: `${PATH}/${latitude},${longitude},${zoom},0,0/${resolution}?access_token=${MAPBOX_ACCESS_TOKEN}`,
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
