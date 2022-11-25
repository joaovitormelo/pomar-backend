import { ScheduleDatabaseSource } from "../../data/datasources/schedule_database_source";

export class DeleteEventParams {
  idEvent: number;
  excludeDates: Array<string>;

  constructor(idEvent: number, excludeDates: Array<string>) {
    this.idEvent = idEvent;
    this.excludeDates = excludeDates;
  }
}

export class DoDeleteEvent {
  scheduleDatabaseSource: ScheduleDatabaseSource;

  constructor(scheduleDatabaseSource: ScheduleDatabaseSource) {
    this.scheduleDatabaseSource = scheduleDatabaseSource;
  }

  async execute(params: DeleteEventParams) {
    if (params.excludeDates.length > 0) {
      for (var i in params.excludeDates) {
        await this.scheduleDatabaseSource.addRoutineExclusion(
          params.idEvent,
          params.excludeDates[i]
        );
      }
    } else {
      await this.scheduleDatabaseSource.deleteRoutineExclusionsByEventId(
        params.idEvent
      );
      await this.scheduleDatabaseSource.deleteAssignmentsByEventId(
        params.idEvent
      );
      await this.scheduleDatabaseSource.removeEvent(params.idEvent);
    }
  }
}
