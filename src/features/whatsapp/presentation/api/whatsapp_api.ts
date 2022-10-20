import { ExpressAdapter } from "../../../../core/adapters/express_adapter";
import { WhatsAppRouter } from "../routers/whatsapp_router";
const express = require("express");

export class WhatsAppApi {
  server;
  whatsAppRouter: WhatsAppRouter;

  constructor(server, whatsAppRouter: WhatsAppRouter) {
    this.server = server;
    this.whatsAppRouter = whatsAppRouter;
  }

  start() {
    const router = express.Router();

    router.get(
      "/whatsapp/check_connection",
      new ExpressAdapter(this.whatsAppRouter.checkConnection).adapt
    );

    router.get(
      "/whatsapp/disconnect",
      new ExpressAdapter(this.whatsAppRouter.disconnect).adapt
    );

    this.server.use("/", router);
  }
}
