import { cache, ERROR } from "../common";

export default ({ originalUrl, routeMap }, res) => {
  const { dataSource } = res;

  if (!dataSource) ERROR.UNKNOWN_SERVICE(res);
  else {
    res.json(dataSource);
    if (routeMap.cache) cache.set(originalUrl, dataSource, routeMap.cache);
  }
};
