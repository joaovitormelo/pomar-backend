import moment from "moment-timezone";
import { RoutineLogic } from "../helpers/routine_logic";
import { ReadEventsData } from "./do_read_events";
import { DoReadEventsByEmployee } from "./do_read_events_by_employee";
moment.tz.setDefault("America/Sao_Paulo");

export class DoReadTasksByEmployee {
  doReadEventsByEmployee: DoReadEventsByEmployee;

  constructor(doReadEventsByEmployee: DoReadEventsByEmployee) {
    this.doReadEventsByEmployee = doReadEventsByEmployee;
  }

  execute = async (idPerson: number) => {
    const eventList: Array<ReadEventsData> =
      await this.doReadEventsByEmployee.execute(idPerson);
    return eventList.filter((eventD) => {
      const event = eventD.event;
      const today = moment();
      var existsInDay = false;
      if (!event.isRoutine) {
        if (moment(event.date).date() == today.date()) {
          existsInDay = true;
        }
      } else {
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
      return eventD.event.isTask && existsInDay;
    });
  };
}
