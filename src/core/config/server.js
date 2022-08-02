"use strict";

const corsAllow = ["http://127.0.0.1:8080", "http://localhost:8080"];

const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require("express");
const server = express();
const cors = require("cors");

const corsOptions = {
  credentials: true,
  origin: corsAllow,
  optionsSuccessStatus: 200,
};

server.use(helmet());
server.use(cookieParser(process.env.COOKIESECRET));
server.use(cors(corsOptions));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

const serverInstance = server.listen(process.env.PORT, () => {});

module.exports = { server, serverInstance };
