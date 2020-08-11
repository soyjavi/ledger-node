import fs from "fs";
import path from "path";

import writeFile from "./writeFile";

export default (filename, folder = "cache") => {
  const file = `${path.resolve(".", folder)}/${filename}`;

  if (!fs.existsSync(file)) writeFile(filename, {});
  return JSON.parse(fs.readFileSync(file, "utf8"));
};
