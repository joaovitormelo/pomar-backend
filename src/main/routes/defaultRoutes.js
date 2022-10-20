"use strict";

const express = require("express");

module.exports = (server) => {
  const router = express.Router();
  router.get("/", (req, res) => res.json({ status: "Pomar API Running..." }));
  router.all("*", function (req, res) {
    res.status(404).json({ noSuchRoute: true, err: true });
  });

  server.use("/", router);
};
