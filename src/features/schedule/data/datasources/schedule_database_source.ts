import { Client } from "pg";
import { ConnectionError, NoDataError } from "../../../../core/errors/errors";
import { AssignmentModel } from "../models/assignment_status_model";
import { EventInfoModel } from "../models/event_info_model";
import { EventModel } from "../models/event_model";

export class ScheduleDatabaseSource {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  readEvents = async () => {
    var response;
    try {
      response = await this.client.query(
        "SELECT * FROM p.event e INNER JOIN p.event_info ei ON e.id_event_info = ei.id_event_info"
      );
    } catch (e) {
      console.error(e);
      throw new ConnectionError();
    }
    if (response.rowCount == 0) throw new NoDataError();
    const eventList: Array<EventModel> = response.rows.map((event) =>
      EventModel.fromDatabase(event)
    );
    return eventList;
  };

  getAssignmentsByEventId = async (idEvent: number) => {
    var response;
    try {
      response = await this.client.query(
        "SELECT * FROM p.assignment a WHERE id_event = $1",
        [idEvent]
      );
    } catch (e) {
      console.error(e);
      throw new ConnectionError();
    }
    if (response.rowCount == 0) throw new NoDataError();
    const eventList: Array<AssignmentModel> = response.rows.map((event) =>
      AssignmentModel.fromDatabase(event)
    );
    return eventList;
  };

  addEventInfo = async (eventInfo: EventInfoModel) => {
    var response;
    try {
      response = await this.client.query(
        "INSERT INTO p.event_info(title, init_time, end_time, all_day, description, is_task, is_collective, is_routine, init_date, frequency, interval, week_days, end_date, times) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id_event_info",
        [
          eventInfo.title,
          eventInfo.initTime,
          eventInfo.endTime,
          eventInfo.allDay,
          eventInfo.description,
          eventInfo.isTask,
          eventInfo.isCollective,
          eventInfo.isRoutine,
          eventInfo.initDate,
          eventInfo.frequency,
          eventInfo.interval,
          eventInfo.weekDays,
          eventInfo.endDate,
          eventInfo.times,
        ]
      );
      return response.rows[0]["id_event_info"];
    } catch (e) {
      console.error(e);
      throw new ConnectionError();
    }
  };

  addEvent = async (event: EventModel) => {
    var response;
    try {
      response = await this.client.query(
        "INSERT INTO p.event(id_event_info, date) VALUES($1, $2) RETURNING id_event",
        [event.eventInfo.idEventInfo, event.date]
      );
      return response.rows[0]["id_event"];
    } catch (e) {
      console.error(e);
      throw new ConnectionError();
    }
  };

  addAssignment = async (assignment: AssignmentModel) => {
    var response;
    try {
      response = await this.client.query(
        "INSERT INTO p.assignment(id_event, id_employee, is_completed) VALUES($1, $2, $3) RETURNING id_event",
        [assignment.idEvent, assignment.idEmployee, assignment.isCompleted]
      );
    } catch (e) {
      console.error(e);
      throw new ConnectionError();
    }
  };
}
