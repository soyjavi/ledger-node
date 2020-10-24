import http from "http";

import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import prettyError from "pretty-error";

import PKG from "../package.json";
import { cacheCurrencies } from "./common";
import { error, props, request, response } from "./middlewares";
import {
  // admin
  backup,
  status,
  // map
  // rates
  rates,
  // sync
  signup,
  sync,
  state,
  blockchain,
} from "./services";

dotenv.config();
prettyError.start();

const { PORT = 3000, INSTANCE } = process.env;
const app = express();
const server = http.createServer(app);

// -- Configuration
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors({}));
app.use(compression());

// -- Connections
global.connections = {};

// -- Middlewares
app.use(request);

// admin
app.get("/status", props, status);
app.get("/backup", props, backup);
// rates
app.get("/rates", props, rates);
// sync
app.post("/signup", props, signup);
app.get("/state", props, state);
app.post("/sync", props, sync);
app.post("/blockchain", props, blockchain);

// demo
app.get("/service/subservice", props, (req, res) =>
  res.json({ props, subservice: true })
);

app.get("/service", props, (req, res) => res.json({ props, service: true }));

app.use(response);

// -- Global Error Handler
app.use(error);

// -- Listen
const listener = server.listen(PORT, async () => {
  console.log(
    `☁️  API v${PKG.version} ${INSTANCE}:${listener.address().port}...`
  );

  // -- Build cache
  await cacheCurrencies();
  setInterval(cacheCurrencies, 3600 * 1000);
});

process.on("uncaughtException", () => server.close());
