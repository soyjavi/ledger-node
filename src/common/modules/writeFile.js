import fs from "fs";
import path from "path";

export default (filename, data = {}, folder = "cache") => {
  const file = `${path.resolve(".", folder)}/${filename}`;

  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    throw new Error(`${file} could not be saved correctly.`);
  }
};
