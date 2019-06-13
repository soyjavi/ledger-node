import dotenv from 'dotenv';

import { cache } from '../common';
import PKG from '../../package.json';

dotenv.config();
const { INSTANCE } = process.env;

export default (req, res, next) => {
  res.dataSource = {
    instance: INSTANCE,
    version: PKG.version,
    cache: cache.status,
  };

  next();
};
