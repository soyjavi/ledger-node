import dotenv from 'dotenv';

dotenv.config();
const { DIFFICULTY, INSTANCE, SECRET } = process.env;

export default {
  ENV: {
    DEVELOPMENT: true,
    PRODUCTION: false,

    BLOCKCHAIN: { difficulty: DIFFICULTY, file: INSTANCE, secret: SECRET },
    DIFFICULTY,
    INSTANCE,
    SECRET,
  },


  LANGUAGE: 'es-ES',
};
