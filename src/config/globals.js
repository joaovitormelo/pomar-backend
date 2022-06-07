//LOCAL
const corsAllow = ['http://127.0.0.1:8080', 'http://localhost:8080'];
const port = 8080;
const dbConfig = {
    host: "sql209.epizy.com",
    user: "epiz_31881207",
    password: "ZrLTEISMKQeXbcL",
    database: "epiz_31881207_pomar",
    multipleStatements: true
};

module.exports = {
    dbConfig,
    port,
    corsAllow
};