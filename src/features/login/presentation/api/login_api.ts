import { ExpressAdapter } from "../../../../core/adapters/express_adapter";
import { LoginRouter } from "../routers/login_router";

const express = require("express");

module.exports = (server, loginRouter: LoginRouter) => {
  const router = express.Router();

  router.post("/login", new ExpressAdapter(loginRouter.login).adapt);

  router.post("/logout", new ExpressAdapter(loginRouter.login).adapt);

  server.use("/", router);
};
