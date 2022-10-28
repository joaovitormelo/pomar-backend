import { NoDataError } from "../../../../core/errors/errors";
import { ScheduleDatabaseSource } from "../../data/datasources/schedule_database_source";
import { AssignmentModel } from "../../data/models/assignment_model";
import { EventModel } from "../../data/models/event_model";
import { RoutineExclusionModel } from "../../data/models/routine_exclusion_model";

export class ReadEventsData {
  event: EventModel;
  assignments: Array<AssignmentModel>;
  routineExclusionList: Array<RoutineExclusionModel>;

  constructor(
    event: EventModel,
    assignments: Array<AssignmentModel>,
    excludeDates: Array<RoutineExclusionModel>
  ) {
    this.event = event;
    this.assignments = assignments;
    this.routineExclusionList = excludeDates;
  }
}

export class DoReadEvents {
  scheduleDatabaseSource: ScheduleDatabaseSource;

  constructor(scheduleDatabaseSource: ScheduleDatabaseSource) {
    this.scheduleDatabaseSource = scheduleDatabaseSource;
  }

  execute = async () => {
    const eventList: Array<EventModel> =
      await this.scheduleDatabaseSource.readEvents();
    var error = null;
    const readEventsDataList: Array<ReadEventsData> = await Promise.all(
      eventList.map(async (event) => {
        var assignments: Array<AssignmentModel> = [];
        var routineExclusionList: Array<RoutineExclusionModel> = [];
        try {
          assignments =
            await this.scheduleDatabaseSource.getAssignmentsByEventId(
              event.idEvent
            );
        } catch (e) {
          if (!(e instanceof NoDataError)) {
            error = e;
          }
        }
        try {
          routineExclusionList =
            await this.scheduleDatabaseSource.getRoutineExclusionsByEventId(
              event.idEvent
            );
        } catch (e) {
          if (!(e instanceof NoDataError)) {
            error = e;
          }
        }
        return new ReadEventsData(event, assignments, routineExclusionList);
      })
    );
    if (error) throw error;
    else {
      return readEventsDataList;
    }
  };
}
