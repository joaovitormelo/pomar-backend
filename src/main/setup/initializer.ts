import { Client } from "pg";
import { LoginInitializer } from "../../features/login/login_initializer";

const server = require("./server");
const client = require("./database");

export class Initializer {
  init = async () => {
    const pgClient: Client = await client();
    new LoginInitializer().init(server, pgClient);

    //Routes
    require("../routes/routes")(server);

    process.on("SIGINT", async () => {
      await pgClient.end();
      console.log("DB CONNECTION CLOSED");
    });
  };
}
