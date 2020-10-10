import onFinished from "on-finished";
import { Blockchain } from "vanilla-blockchain";
import { Storage } from "vanilla-storage";

import MAP from "../../map.json";
import { C, ERROR } from "../common";

const { BLOCKCHAIN, STORAGE } = C;

export default (req, res, next) => {
  const { originalUrl } = req;
  const today = new Date();
  const timestamp = today.getTime();

  const [, ...parts] = originalUrl.split("?")[0].split("/");
  const route = MAP[parts.join("/")];

  if (!route) return ERROR.UNKNOWN_SERVICE(res);

  req.routeMap = route;
  if (route.secure) {
    const {
      headers: { authorization, secret },
    } = req;
    if (!authorization || !secret) return ERROR.FORBIDDEN(res);

    const { blocks: sessions } = new Blockchain(BLOCKCHAIN);

    if (!sessions.find(({ hash }) => hash === authorization))
      return ERROR.FORBIDDEN(res);

    const session = { filename: authorization, secret };
    try {
      new Storage({ ...STORAGE, ...session });
    } catch (error) {
      return ERROR.MESSAGE(res, error);
    }

    req.session = session;
  }

  onFinished(res, () => {
    console.log(
      `${req.method} ${req.url} ${res.statusCode} - - ${
        new Date().getTime() - timestamp
      } ms`
    );
  });

  return next();
};
