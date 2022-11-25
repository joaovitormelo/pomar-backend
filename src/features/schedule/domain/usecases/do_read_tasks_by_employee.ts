import { ScheduleDatabaseSource } from "../../data/datasources/schedule_database_source";
import { EventModel } from "../../data/models/event_model";
import { ReadEventsData } from "./do_read_events";
import { DoReadEventsByEmployee } from "./do_read_events_by_employee";

export class DoReadTasksByEmployee {
  doReadEventsByEmployee: DoReadEventsByEmployee;

  constructor(doReadEventsByEmployee: DoReadEventsByEmployee) {
    this.doReadEventsByEmployee = doReadEventsByEmployee;
  }

  execute = async (idPerson: number) => {
    const eventList: Array<ReadEventsData> =
      await this.doReadEventsByEmployee.execute(idPerson);
    return eventList.filter((eventD) => eventD.event.isTask);
  };
}
