import { ExpressAdapter } from "../../../../core/adapters/express_adapter";
import { LoginRouter } from "../routers/login_router";
const express = require("express");

export class LoginApi {
  server;
  loginRouter: LoginRouter;

  constructor(server, loginRouter: LoginRouter) {
    this.server = server;
    this.loginRouter = loginRouter;
  }

  start() {
    const router = express.Router();

    router.post("/login", new ExpressAdapter(this.loginRouter.login).adapt);

    router.post("/logout", new ExpressAdapter(this.loginRouter.logout).adapt);

    this.server.use("/", router);
  }
}
