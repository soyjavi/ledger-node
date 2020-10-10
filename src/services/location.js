import https from "https";

import dotenv from "dotenv";
import fetch from "node-fetch";

import { C } from "../common";

dotenv.config();
const { MAPBOX_ACCESS_TOKEN } = process.env;
const { MAPBOX } = C;
const HEATMAP_OPACITY = [0.2, 0.4, 0.6, 0.8];
const DARK = "dark";

const MAPBOX_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";

export const mapPlace = async (
  { props: { latitude, longitude } },
  res,
  next
) => {
  const PARAMETERS = "language=en&limit=10&types=place";
  const url = `${MAPBOX_URL}/${longitude},${latitude}.json?${PARAMETERS}&access_token=${MAPBOX_ACCESS_TOKEN}`;
  const response = await fetch(url);
  let place;

  if (response) {
    const { features = [] } = (await response.json()) || {};
    place = features[0] ? features[0].place_name_en : "Unknown Place";
  }

  res.dataSource = { place };

  next();
};

export const places = async ({ props: { latitude, longitude } }, res, next) => {
  const PARAMETERS = "language=en&limit=10&types=poi";
  const url = `${MAPBOX_URL}/${longitude},${latitude}.json?${PARAMETERS}&access_token=${MAPBOX_ACCESS_TOKEN}`;
  const response = await fetch(url);
  let POIs;

  if (response) {
    const { features = [] } = (await response.json()) || {};

    POIs = features.map(
      ({ id, properties: { address }, text_en: text, context = [] }) => {
        const info = {};
        context.forEach(({ id, text_en: value }) => {
          const [key] = id.split(".");
          if (["postcode", "place", "region", "country"].includes(key))
            info[key] = value;
        });
        const { place: city, ...location } = info;

        return {
          address,
          id,
          text,
          ...location,
          city,
        };
      }
    );
  }

  res.dataSource = { POIs };

  next();
};

export const map = async ({ props }, res) => {
  const {
    center = "auto",
    color = "#FF4500",
    precission = 0.001,
    resolution = "512x256@2x",
    style,
  } = props;
  const heatmaps = [[], [], [], []];
  const gap = parseFloat(precission, 10);

  let { points } = props;
  points = points ? JSON.parse(points) : [];
  const max = Math.max(...points.map(([long, lat, amount = 1]) => amount));

  points.forEach((point) => {
    let [long, lat, amount = 1] = point;

    long = parseFloat(long, 10) - gap / 2;
    lat = parseFloat(lat, 10);

    const box = [
      [long, lat],
      [long + gap, lat],
      [long + gap, lat + gap],
      [long, lat + gap],
      [long, lat],
    ];

    // Determine level
    let index = 1;
    if (points.length > 1) {
      const percentage = Math.floor((amount * 100) / max);

      if (percentage > 80) index = 3;
      else if (percentage > 50) index = 2;
      else if (percentage > 10) index = 1;
      else index = 0;
    }

    heatmaps[index].push(box);
  });

  const geoJSON = { type: "FeatureCollection", features: [] };
  heatmaps.forEach((coordinates, index) => {
    if (coordinates.length > 0) {
      geoJSON.features.push({
        type: "Feature",
        geometry: { type: "Polygon", coordinates },
        properties: {
          "stroke-width": 0,
          fill: color,
          "fill-opacity": HEATMAP_OPACITY[index],
        },
      });
    }
  });

  const geoJSONUri = encodeURIComponent(JSON.stringify(geoJSON));
  const queryParams = `access_token=${MAPBOX_ACCESS_TOKEN}&${MAPBOX.PROPS}`;
  const path = style === DARK ? MAPBOX.PATH_DARK : MAPBOX.PATH;

  https
    .request(
      {
        host: MAPBOX.HOST,
        path: `/${path}/geojson(${geoJSONUri})/${center}/${resolution}?${queryParams}`,
      },
      (response) => {
        if (response.statusCode === 200) {
          res.writeHead(200, {
            "Content-Type": response.headers["content-type"],
          });
          response.pipe(res);
        } else {
          res.writeHead(response.statusCode);
          res.end();
        }
      }
    )
    .end();
};
