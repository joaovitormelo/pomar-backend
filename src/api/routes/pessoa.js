"use strict";

// ATENCÃO A ESTE PATH!!!
const express = require("express");

module.exports = (server, conn) => {
  const router = express.Router();

  router.get("/pessoa", (req, res) => {
    conn.query("SELECT * FROM pessoa", (error, result) => {
      if (error) console.error(error);
      res.json(result);
    });
  });

  server.use("/", router);
};
