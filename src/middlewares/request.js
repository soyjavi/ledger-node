import onFinished from 'on-finished';
import Blockchain from 'vanillachain-core';

import { cache, C, ERROR } from '../common';
import MAP from '../../map.json';

const { BLOCKCHAIN, BLOCKCHAIN_VAULTS, BLOCKCHAIN_TXS } = C;

export default (req, res, next) => {
  const { originalUrl } = req;
  const timestamp = new Date().getTime();

  const route = MAP[originalUrl.split('/')[1].split('?')[0]]; // eslint-disable-line
  req.routeMap = route;

  if (route && route.secure) {
    const { headers: { authorization } } = req;
    if (!authorization) return ERROR.FORBIDDEN(res);

    const { blocks: sessions } = new Blockchain(BLOCKCHAIN);
    if (!sessions.find(({ hash }) => hash === authorization)) return ERROR.FORBIDDEN(res);

    let session = cache.get(authorization);
    if (!session) {
      const { blocks: [, ...vaults] } = new Blockchain({ ...BLOCKCHAIN_VAULTS, file: authorization });
      const { blocks: [, lastTX] } = new Blockchain({ ...BLOCKCHAIN_TXS, file: authorization });

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
