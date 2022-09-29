import { ScheduleDatabaseSource } from "../../data/datasources/schedule_database_source";
import { AssignmentModel } from "../../data/models/assignment_status_model";
import { EventModel } from "../../data/models/event_model";

export class AddEventParams {
  event: EventModel;
  assignmentList: Array<AssignmentModel>;

  constructor(event: EventModel, assignmentList: Array<AssignmentModel>) {
    this.event = event;
    this.assignmentList = assignmentList;
  }
}

export class DoAddEvent {
  scheduleDatabaseSource: ScheduleDatabaseSource;

  constructor(scheduleDatabaseSource: ScheduleDatabaseSource) {
    this.scheduleDatabaseSource = scheduleDatabaseSource;
  }

  async execute(params: AddEventParams) {
    const idEventInfo: number = await this.scheduleDatabaseSource.addEventInfo(
      params.event.eventInfo
    );
    params.event.eventInfo.idEventInfo = idEventInfo;
    const idEvent: number = await this.scheduleDatabaseSource.addEvent(
      params.event
    );
    for (let i in params.assignmentList) {
      params.assignmentList[i].idEvent = idEvent;
      await this.scheduleDatabaseSource.addAssignment(params.assignmentList[i]);
    }
  }
}
