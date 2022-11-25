import { Client } from "pg";
import { DoValidateSession } from "../login/domain/usecases/do_validate_session";
import { ScheduleDatabaseSource } from "./data/datasources/schedule_database_source";
import { DoAddEvent } from "./domain/usecases/do_add_event";
import { DoDailyChecks } from "./domain/usecases/do_daily_checks";
import { DoDeleteEvent } from "./domain/usecases/do_delete_event";
import { DoEditEvent } from "./domain/usecases/do_edit_event";
import { DoReadEvents } from "./domain/usecases/do_read_events";
import { DoReadEventsByEmployee } from "./domain/usecases/do_read_events_by_employee";
import { DoSwitchCompleteAssignment } from "./domain/usecases/do_risk_task";
import { ScheduleApi } from "./presentation/api/schedule_api";
import { ScheduleRouter } from "./presentation/routers/schedule_router";
const CronJob = require("cron").CronJob;

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
    const doReadEventsByEmployee: DoReadEventsByEmployee =
      new DoReadEventsByEmployee(scheduleDatabaseSource);
    const doAddEvent: DoAddEvent = new DoAddEvent(scheduleDatabaseSource);
    const doEditEvent: DoEditEvent = new DoEditEvent(scheduleDatabaseSource);
    const doDelete: DoDeleteEvent = new DoDeleteEvent(scheduleDatabaseSource);
    const doDailyChecks: DoDailyChecks = new DoDailyChecks(
      scheduleDatabaseSource,
      doReadEvents
    );
    const doSwitchCompleteAssignment: DoSwitchCompleteAssignment =
      new DoSwitchCompleteAssignment(scheduleDatabaseSource);

    const scheduleRouter: ScheduleRouter = new ScheduleRouter(
      this.doValidateSession,
      doReadEvents,
      doReadEventsByEmployee,
      doAddEvent,
      doEditEvent,
      doDelete,
      doDailyChecks,
      doSwitchCompleteAssignment
    );

    new ScheduleApi(this.server, scheduleRouter).start();

    new CronJob(
      "1 0 * * *",
      doDailyChecks.execute,
      null,
      true,
      "America/Sao_Paulo"
    );
    new CronJob(
      "20 16 * * *",
      doDailyChecks.execute,
      null,
      true,
      "America/Sao_Paulo"
    );
  }
}
