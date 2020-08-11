import http from "http";

import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import prettyError from "pretty-error";

import PKG from "../package.json";
import { cacheCryptos, cacheCurrencies, cacheMetals } from "./common";
import { cache, error, props, request, response } from "./middlewares";
import {
  signup,
  rates,
  map,
  place,
  state,
  // Admin
  backup,
  status,
} from "./services";

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
app.get("/status", props, status);
app.post("/signup", props, signup);
app.get("/rates", props, rates);
app.get("/map", props, map);
app.get("/place", cache, props, place);
app.get("/state", props, state);
// --- Admin tools
app.get("/backup", props, backup);
app.use(response);

// -- Global Error Handler
app.use(error);

// -- Listen
const listener = server.listen(PORT, async () => {
  console.log(
    `☁️  API v${PKG.version} ${INSTANCE}:${listener.address().port}...`
  );

  // -- Build cache
  // await cacheCurrencies();
  // await cacheCryptos();
  // await cacheMetals();
});

process.on("uncaughtException", () => server.close());
