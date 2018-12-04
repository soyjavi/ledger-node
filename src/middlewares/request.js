import onFinished from 'on-finished';
import Blockchain from 'vanillachain-core';

import { cache, C, ERROR } from '../common';
import MAP from '../../map.json';

const { BLOCKCHAIN } = C;

export default (req, res, next) => {
  const { originalUrl } = req;
  const today = new Date();
  const timestamp = today.getTime();
  const year = today.getFullYear().toString();

  const route = MAP[originalUrl.split('/')[1].split('?')[0]]; // eslint-disable-line
  if (!route) return ERROR.UNKNOWN_SERVICE(res);

  req.routeMap = route;
  if (route.secure) {
    const { headers: { authorization } } = req;
    if (!authorization) return ERROR.FORBIDDEN(res);

    const { blocks: sessions } = new Blockchain(BLOCKCHAIN);
    if (!sessions.find(({ hash }) => hash === authorization)) return ERROR.FORBIDDEN(res);

    let session = cache.get(authorization);
    if (!session) {
      const { blocks: [, ...vaults] } = new Blockchain({ ...BLOCKCHAIN, file: authorization, key: 'vaults' });
      const { blocks: [, lastTX] } = new Blockchain({ ...BLOCKCHAIN, file: authorization, key: year });

      session = {
        hash: authorization,
        vaults: vaults.map(({ hash }) => hash),
        tx: lastTX,
      };
      cache.set(authorization, session, 120);
    }

    req.session = session;
  }

  onFinished(res, () => {
    console.log(`${req.method} ${req.url} ${res.statusCode} - - ${new Date().getTime() - timestamp} ms`);
  });

  return next();
};
