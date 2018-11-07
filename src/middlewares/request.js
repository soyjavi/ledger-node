import onFinished from 'on-finished';
import Blockchain from 'vanillachain-core';

import { cache, C, ERROR } from '../common';
import MAP from '../../map.json';

const { ENV: { BLOCKCHAIN, SECRET } } = C;

export default (req, res, next) => {
  const timestamp = new Date().getTime();

  const route = MAP[req.originalUrl.split('/')[1].split('?')[0]]; // eslint-disable-line
  req.routeMap = route;

  if (route && route.secure) {
    const { headers: { authorization } } = req;
    if (!authorization) return ERROR.FORBIDDEN(res);

    const { blocks } = new Blockchain(BLOCKCHAIN);
    const block = blocks.find(({ hash }) => hash === authorization);
    if (!block) return ERROR.FORBIDDEN(res);

    let session = cache.get(authorization);
    if (!session) {
      const blockchain = new Blockchain({ file: authorization, secret: SECRET, keyChain: 'vaults' });
      session = {
        hash: authorization,
        vaults: blockchain.blocks.map(({ data }) => data),
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
