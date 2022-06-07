"use strict"

const mysql = require('mysql');

const { dbConfig } = require('./globals');

const connection = mysql.createConnection(dbConfig);

module.exports = connection;

