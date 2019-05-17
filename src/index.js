import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import prettyError from 'pretty-error';
import { cacheCryptos, cacheCurrencies } from './common';

import {
  cache, error, props, request, response,
} from './middlewares';
import {
  signup,
  signin,
  profile,
  vault,
  transaction,
  transactions,
  fork,
  heatmap,
  mapPlace,
  backup,
  status,
} from './services';
import PKG from '../package.json';

dotenv.config();
prettyError.start();

const { PORT = 3000, INSTANCE } = process.env;
const app = express();
const server = http.createServer(app);

// -- Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());

// -- Connections
global.connections = {};

// -- Middlewares
app.use(request);
app.get('/status', props, status);
app.post('/signup', props, signup);
app.post('/signin', props, signin);
app.get('/profile', props, profile);
app.post('/transaction', props, transaction);
app.get('/transactions', props, transactions);
app.post('/vault', props, vault);
app.get('/place', cache, props, mapPlace);
app.get('/heatmap', props, heatmap);
app.get('/fork', props, fork);
// --- Admin tools
app.get('/backup', props, backup);
app.use(response);

// -- Global Error Handler
app.use(error);

// -- Listen
const listener = server.listen(PORT, async () => {
  console.log(`☁️  API v${PKG.version} ${INSTANCE}:${listener.address().port}...`);

  // -- Build cache
  await cacheCurrencies();
  await cacheCryptos();
});

process.on('uncaughtException', () => server.close());
