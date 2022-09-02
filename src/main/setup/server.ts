"use strict";

const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const corsOptions = {
  credentials: true,
  origin: ["http://127.0.0.1:3001", "http://localhost:3001"],
  optionsSuccessStatus: 200,
};

const server = express();
server.use(cors(corsOptions));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

const serverInstance = server.listen(process.env.PORT, () => {});

module.exports = server;
