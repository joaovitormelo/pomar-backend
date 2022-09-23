import { Client } from "pg";
import { DoValidateSession } from "../login/domain/usecases/do_validate_session";
import { ScheduleDatabaseSource } from "./data/datasources/schedule_database_source";
import { DoReadEvents } from "./domain/usecases/do_read_events";
import { ScheduleApi } from "./presentation/api/schedule_api";
import { ScheduleRouter } from "./presentation/routers/schedule_router";

export class ScheduleInitializer {
  server;
  client: Client;
  doValidateSession: DoValidateSession;

  constructor(server, client: Client, doValidateSession: DoValidateSession) {
    this.server = server;
    this.client = client;
    this.doValidateSession = doValidateSession;
  }

  init() {
    const scheduleDatabaseSource: ScheduleDatabaseSource =
      new ScheduleDatabaseSource(this.client);

    const doReadEvents: DoReadEvents = new DoReadEvents(scheduleDatabaseSource);

    const scheduleRouter: ScheduleRouter = new ScheduleRouter(
      this.doValidateSession,
      doReadEvents
    );

    new ScheduleApi(this.server, scheduleRouter).start();
  }
}
