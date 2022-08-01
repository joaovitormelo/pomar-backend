//LOCAL
const corsAllow = ["http://127.0.0.1:8080", "http://localhost:8080"];
const port = process.env.PORT;

const databaseConfig = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
};

module.exports = {
  port,
  corsAllow,
  databaseConfig,
};
