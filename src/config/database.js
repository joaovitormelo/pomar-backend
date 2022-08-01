"use strict";

const { Client } = require("pg");
const { databaseConfig } = require("./globals");
const axios = require("axios");

var connection;

module.exports = () => {
  connection = new Client(databaseConfig);
  connection.connect();
  console.log("DATABASE connected");
  return connection;
};
