import { cache, ERROR } from '../common';

export default ({ originalUrl, routeMap }, res) => {
  const { dataSource } = res;
  let json;

  if (!dataSource) ERROR.UNKNOWN_SERVICE(res);
  else json = dataSource;

  if (json) {
    res.json(json);
    cache.set(originalUrl, json, routeMap.cache);
  }
};
