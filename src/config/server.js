"use strict";

const { corsAllow, port } = require("./globals");

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

const serverInstance = server.listen(port, () => {});

module.exports = { server, serverInstance };
