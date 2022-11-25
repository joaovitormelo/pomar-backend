import { NoDataError } from "../../../../core/errors/errors";
import { ScheduleDatabaseSource } from "../../data/datasources/schedule_database_source";
import { AssignmentModel } from "../../data/models/assignment_model";
import { EventModel } from "../../data/models/event_model";
import { RoutineExclusionModel } from "../../data/models/routine_exclusion_model";
import { ReadEventsData } from "./do_read_events";

export class DoReadEventsByEmployee {
  scheduleDatabaseSource: ScheduleDatabaseSource;

  constructor(scheduleDatabaseSource: ScheduleDatabaseSource) {
    this.scheduleDatabaseSource = scheduleDatabaseSource;
  }

  execute = async (idPerson: number) => {
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
      const employee = await this.scheduleDatabaseSource.getEmployeeByPersonId(
        idPerson
      );
      const filteredEvents = readEventsDataList.filter((data) => {
        if (data.event.isTask) {
          var hasEmployeeAssigned = false;
          data.assignments.map((assignment) => {
            if (assignment.idEmployee == employee.idEmployee) {
              hasEmployeeAssigned = true;
            }
          });
          return hasEmployeeAssigned;
        } else {
          return true;
        }
      });
      if (filteredEvents.length == 0) {
        throw new NoDataError();
      } else {
        return filteredEvents;
      }
    }
  };
}
