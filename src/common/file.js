import fs from "fs";
import path from "path";

const DEFAULT_FOLDER = "cache";

export const File = {
  read: (filename, folder = DEFAULT_FOLDER) => {
    const file = `${path.resolve(".", folder)}/${filename}`;

    if (!fs.existsSync(file)) File.write(filename, {});
    return JSON.parse(fs.readFileSync(file, "utf8") || "") || {};
  },

  write: (filename, data = {}, folder = DEFAULT_FOLDER) => {
    const file = `${path.resolve(".", folder)}/${filename}`;

    try {
      fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
    } catch (error) {
      throw new Error(`${file} could not be saved correctly.`);
    }
  },
};
