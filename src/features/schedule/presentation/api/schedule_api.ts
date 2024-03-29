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
      "/events/employee",
      new ExpressAdapter(this.scheduleRouter.readEventsByEmployee).adapt
    );

    router.post(
      "/event",
      new ExpressAdapter(this.scheduleRouter.addEvent).adapt
    );

    router.put(
      "/event",
      new ExpressAdapter(this.scheduleRouter.editEvent).adapt
    );

    router.delete(
      "/event",
      new ExpressAdapter(this.scheduleRouter.deleteEvent).adapt
    );

    router.post(
      "/event/complete",
      new ExpressAdapter(this.scheduleRouter.switchCompleteAssignment).adapt
    );

    router.post(
      "/tasks/employee",
      new ExpressAdapter(this.scheduleRouter.readTasksByEmployee).adapt
    );

    router.get(
      "/event/test",
      new ExpressAdapter(this.scheduleRouter.test).adapt
    );

    this.server.use("/", router);
  }
}
