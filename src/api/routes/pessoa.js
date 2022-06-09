"use strict"

const connection = require('../../config/database'); // ATENCÃO A ESTE PATH!!!
const express = require('express');

module.exports = (server) => {
    const router = express.Router();

    router.get('/pessoa', (req, res) => {
        res.json('ACCESSING PEOPLE ROUTE');
    });
    
    server.use('/', router);
}