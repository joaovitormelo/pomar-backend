import { ScheduleDatabaseSource } from "../../data/datasources/schedule_database_source";
import { AssignmentModel } from "../../data/models/assignment_status_model";
import { EventModel } from "../../data/models/event_model";

export class EditEventParams {
  event: EventModel;
  assignmentList: Array<AssignmentModel>;

  constructor(event: EventModel, assignmentList: Array<AssignmentModel>) {
    this.event = event;
    this.assignmentList = assignmentList;
  }
}

export class DoEditEvent {
  scheduleDatabaseSource: ScheduleDatabaseSource;

  constructor(scheduleDatabaseSource: ScheduleDatabaseSource) {
    this.scheduleDatabaseSource = scheduleDatabaseSource;
  }

  private async addAssignments(idEvent, assignmentList) {
    for (let i in assignmentList) {
      assignmentList[i].idEvent = idEvent;
      await this.scheduleDatabaseSource.addAssignment(assignmentList[i]);
    }
  }

  async execute(params: EditEventParams) {
    await this.scheduleDatabaseSource.editEventInfo(params.event.eventInfo);
    await this.scheduleDatabaseSource.editEvent(params.event);
    await this.scheduleDatabaseSource.deleteAssignmentsByEventId(
      params.event.idEvent
    );
    await this.addAssignments(params.event.idEvent, params.assignmentList);
  }
}
