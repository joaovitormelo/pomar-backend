"use strict";

import { Client } from "pg";

const { databaseConfig } = require("./globals");

class Database {
  conn: Client;
  databaseConfig = {
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
  };

  connect = async () => {
    this.conn = new Client(databaseConfig);
    await this.conn.connect();
    return this.conn;
  };
}

module.exports = new Database();
