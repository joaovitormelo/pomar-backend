"use strict";

const { Client } = require("pg");
const { herokuToken } = require("./globals");
const axios = require("axios");

var connection;

module.exports = new Promise(async (resolve, reject) => {
  const response = await axios
    .get("https://api.heroku.com/apps/pomar-database/config-vars", {
      headers: {
        Authorization: "Bearer " + herokuToken,
        Accept: "application/vnd.heroku+json; version=3",
      },
    })
    .then(
      (data) =>
        (connection = new Client({
          connectionString: data.data["DATABASE_URL"],
          ssl: {
            rejectUnauthorized: false,
          },
        }))
    )
    .catch((e) => {
      console.log(e.response);
    });
  connection.connect();
  resolve(connection);
});
