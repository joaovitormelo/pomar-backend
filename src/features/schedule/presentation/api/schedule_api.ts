import { ExpressAdapter } from "../../../../core/adapters/express_adapter";
import { ScheduleRouter } from "../routers/schedule_router";

const express = require("express");

export class ScheduleApi {
  server;
  scheduleRouter: ScheduleRouter;

  constructor(server, scheduleRouter: ScheduleRouter) {
    this.server = server;
    this.scheduleRouter = scheduleRouter;
  }

  start() {
    const router = express.Router();

    router.get(
      "/events",
      new ExpressAdapter(this.scheduleRouter.readEvents).adapt
    );

    router.post(
      "/event",
      new ExpressAdapter(this.scheduleRouter.addEvent).adapt
    );

    this.server.use("/", router);
  }
}
