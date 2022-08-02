"use strict";

process.env.TZ = "UTC";

require("dotenv").config();

const dbConnection = await require("../core/config/database").connect();
console.log("DATABASE connected");

//Routes
require("./routes/routes")(server);

console.log("Backend Running at port " + process.env.PORT + "!");
process.on("SIGINT", async () => {
  await dbConnection.end();
  console.log("DB CONNECTION CLOSED");
});
