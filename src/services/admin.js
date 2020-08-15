import archiver from "archiver";
import dotenv from "dotenv";
import { Blockchain } from "vanilla-blockchain";

import PKG from "../../package.json";
import { cache, C, ERROR } from "../common";

dotenv.config();
const { INSTANCE, SECRET } = process.env;
const { BLOCKCHAIN } = C;

export const backup = ({ props: { key } }, res) => {
  if (key !== SECRET) return ERROR.NOT_FOUND(res);

  const filename = new Date().toISOString();
  const zip = archiver("zip", { zlib: { level: 9 } });

  res.setHeader("Content-Disposition", "attachment");
  res.attachment(`${filename}.zip`);

  zip.pipe(res);
  zip.directory("store/", false).finalize();
};

export const status = (req, res, next) => {
  const {
    blocks: [, ...blocks],
  } = new Blockchain(BLOCKCHAIN);

  res.dataSource = {
    instance: INSTANCE,
    version: PKG.version,
    cache: cache.status.bytes,
    sessions: blocks.length,
  };

  next();
};
