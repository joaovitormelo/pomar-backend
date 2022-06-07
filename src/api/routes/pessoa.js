"use strict"

const connection = require('../../config/database'); // ATENCÃO A ESTE PATH!!!
const express = require('express');

module.exports = (server) => {
    const router = express.Router();

    router.get('/pessoa', (req, res) => {
        connection.query('SELECT * FROM pessoa', (error, results, fields) => {
            if (error) {
                res.json(error);
            } else res.json(results);
        });
    });

    
    server.use('/', router);
}