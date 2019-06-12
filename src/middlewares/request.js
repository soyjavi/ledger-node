import onFinished from 'on-finished';
import Blockchain from 'vanillachain-core';

import { cache, C, ERROR } from '../common';
import MAP from '../../map.json';

const { BLOCKCHAIN, KEY_TRANSACTIONS, KEY_VAULTS } = C;

export default (req, res, next) => {
  const { originalUrl } = req;
  const today = new Date();
  const timestamp = today.getTime();

  const route = MAP[originalUrl.split('/')[1].split('?')[0]]; // eslint-disable-line
  if (!route) return ERROR.UNKNOWN_SERVICE(res);

  req.routeMap = route;
  if (route.secure) {
    const { headers: { authorization, secret } } = req;
    if (!authorization || !secret) return ERROR.FORBIDDEN(res);

    const { blocks: sessions } = new Blockchain(BLOCKCHAIN);
    if (!sessions.find(({ hash }) => hash === authorization)) return ERROR.FORBIDDEN(res);

    let session = cache.get(authorization);
    if (!session) {
      session = { hash: authorization, secret };

      if (secret) {
        const connection = { ...BLOCKCHAIN, file: authorization, secret };
        const { blocks: [, ...vaults] } = new Blockchain({ ...connection, key: KEY_VAULTS });
        const { blocks: [, lastTX] } = new Blockchain({ ...connection, key: KEY_TRANSACTIONS });

        session = {
          ...session,
          vaults: vaults.map(({ hash }) => hash),
          tx: lastTX,
        };
      }

      cache.set(authorization, session, 120);
    }

    req.session = session;
  }

  onFinished(res, () => {
    console.log(`${req.method} ${req.url} ${res.statusCode} - - ${new Date().getTime() - timestamp} ms`);
  });

  return next();
};
