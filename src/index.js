"use strict"

process.env.TZ = 'UTC';

const fs = require('fs');

if (fs.existsSync('.env')) {
    console.log("RUNNING FROM .ENV");
    require("dotenv-safe").config();
} else {
    console.log("RUNNING FROM DEV FALLBACK");
    process.env.COOKIESECRET = "cookieSecretDev";
    process.env.JWTSECRET = "jwtSecretDev";
}

const { port } = require('./config/globals');
const { server, serverInstance } = require('./config/server'); //serverInstance é para chat, se for usar dps
const dbConnection = require('./config/database');

//Route Pessoa
require('./api/routes/pessoa')(server);

require("./config/defaultRoutes")(server);

console.log("Backend Running at port " + port + "!");
process.on('SIGINT', () => {
    dbConnection.end((err) => {
        console.log("DB CONNECTION CLOSED");
    });
});