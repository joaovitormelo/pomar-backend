import { NoDataError } from "../../../../core/errors/errors";
import { ScheduleDatabaseSource } from "../../data/datasources/schedule_database_source";
import { AssignmentModel } from "../../data/models/assignment_status_model";
import { EventModel } from "../../data/models/event_model";

export class ReadEventsData {
  event: EventModel;
  assignments: Array<AssignmentModel>;

  constructor(event: EventModel, assignments: Array<AssignmentModel>) {
    this.event = event;
    this.assignments = assignments;
  }
}

export class DoReadEvents {
  scheduleDatabaseSource: ScheduleDatabaseSource;

  constructor(scheduleDatabaseSource: ScheduleDatabaseSource) {
    this.scheduleDatabaseSource = scheduleDatabaseSource;
  }

  async execute() {
    const eventList: Array<EventModel> =
      await this.scheduleDatabaseSource.readEvents();
    var error = null;
    const readEventsDataList: Array<ReadEventsData> = await Promise.all(
      eventList.map(async (event) => {
        var assignments: Array<AssignmentModel> = [];
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
        return new ReadEventsData(event, assignments);
      })
    );
    if (error) throw error;
    else {
      return readEventsDataList;
    }
  }
}
