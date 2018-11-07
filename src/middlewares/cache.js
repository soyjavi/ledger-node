import { cache } from '../common';

export default ({ originalUrl }, res, next) => {
  const cached = cache.get(originalUrl);

  if (cached) res.json(cached);
  else next();
};
