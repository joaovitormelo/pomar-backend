import moment from "moment";
import { ScheduleDatabaseSource } from "../../data/datasources/schedule_database_source";
import { AssignmentModel } from "../../data/models/assignment_model";
import { EventModel } from "../../data/models/event_model";
import { RoutineExclusionModel } from "../../data/models/routine_exclusion_model";
import {
  DoReadEvents,
  ReadEventsData,
} from "../../domain/usecases/do_read_events";
import { RoutineLogic } from "../helpers/routine_logic";

export class DoDailyChecks {
  scheduleDatabaseSource: ScheduleDatabaseSource;
  doReadEvents: DoReadEvents;

  constructor(
    scheduleDatabaseSource: ScheduleDatabaseSource,
    doReadEvents: DoReadEvents
  ) {
    this.scheduleDatabaseSource = scheduleDatabaseSource;
    this.doReadEvents = doReadEvents;
  }

  execute = async () => {
    const eventsDataList: Array<ReadEventsData> =
      await this.doReadEvents.execute();
    const today = moment();
    for (var i in eventsDataList) {
      const assignments: Array<AssignmentModel> = eventsDataList[i].assignments;
      const event: EventModel = eventsDataList[i].event;
      const routineExclusionList: Array<RoutineExclusionModel> =
        eventsDataList[i].routineExclusionList;
      if (event.isRoutine) {
        var existsInDay;
        if (event.frequency == "D") {
          existsInDay = RoutineLogic.determineIfDailyRoutineExistsInDay(
            event,
            today
          );
        } else if (event.frequency == "W") {
          existsInDay = RoutineLogic.determineIfWeeklyRoutineExistsInDay(
            event,
            today
          );
        } else if (event.frequency == "M") {
          existsInDay = RoutineLogic.determineIfMonthlyRoutineExistsInDay(
            event,
            today
          );
        } else {
          existsInDay = RoutineLogic.determineIfYearlyRoutineExistsInDay(
            event,
            today
          );
        }
      }
      if (existsInDay) {
        console.log(`Evento ${event.title} existe hoje`);
        routineExclusionList.map(async (routineExclusion) => {
          const excludeDate = moment(routineExclusion.date);
          if (today.diff(excludeDate, "days") > 0) {
            await this.scheduleDatabaseSource.deleteRoutineExclusionById(
              routineExclusion.idRoutineExclusion
            );
          }
        });
        assignments.map(async (assignment) => {
          await this.scheduleDatabaseSource.resetAssignmentById(
            assignment.idAssignment
          );
        });
      }
    }
  };
}
