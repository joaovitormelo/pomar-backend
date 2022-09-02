import { Client } from "pg";

const client: Client = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT),
});

module.exports = async () => {
  await client.connect();
  console.log("DATABASE connected");
  return client;
};
