import { Client } from "pg";
import { ConnectionError, NoDataError } from "../../../../core/errors/errors";
import { AssignmentModel } from "../models/assignment_model";
import { EventModel } from "../models/event_model";
import { RoutineExclusionModel } from "../models/routine_exclusion_model";

export class ScheduleDatabaseSource {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  readEvents = async () => {
    var response;
    try {
      response = await this.client.query("SELECT * FROM p.event");
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

  addEvent = async (event: EventModel) => {
    var response;
    try {
      response = await this.client.query(
        "INSERT INTO p.event(date, title, init_time, end_time, all_day, description, is_task, is_collective, is_routine, init_date, frequency, interval, week_days, undefined_end, end_date, times) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id_event",
        [
          event.date,
          event.title,
          event.initTime,
          event.endTime,
          event.allDay,
          event.description,
          event.isTask,
          event.isCollective,
          event.isRoutine,
          event.initDate,
          event.frequency,
          event.interval,
          event.weekDays,
          event.undefinedEnd,
          event.endDate,
          event.times,
        ]
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

  editEvent = async (event: EventModel) => {
    try {
      await this.client.query(
        "UPDATE p.event SET date = $1, title = $2, init_time = $3, end_time = $4, all_day = $5, description = $6, is_task = $7, is_collective = $8, is_routine = $9, init_date = $10, frequency = $11, interval = $12, week_days = $13, undefined_end = $14, end_date = $15, times = $16 WHERE id_event = $17",
        [
          event.date,
          event.title,
          event.initTime,
          event.endTime,
          event.allDay,
          event.description,
          event.isTask,
          event.isCollective,
          event.isRoutine,
          event.initDate,
          event.frequency,
          event.interval,
          event.weekDays,
          event.undefinedEnd,
          event.endDate,
          event.times,
          event.idEvent,
        ]
      );
    } catch (e) {
      console.error(e);
      throw new ConnectionError();
    }
  };

  deleteAssignmentsByEventId = async (idEvent: number) => {
    try {
      await this.client.query("DELETE FROM p.assignment WHERE id_event = $1", [
        idEvent,
      ]);
    } catch (e) {
      console.error(e);
      throw new ConnectionError();
    }
  };

  removeEvent = async (idEvent: number) => {
    try {
      await this.client.query("DELETE FROM p.event WHERE id_event = $1", [
        idEvent,
      ]);
    } catch (e) {
      console.error(e);
      throw new ConnectionError();
    }
  };

  addRoutineExclusion = async (idEvent: number, date: string) => {
    var response;
    try {
      response = await this.client.query(
        "INSERT INTO p.routine_exclusion(id_event, date) VALUES($1, $2)",
        [idEvent, date]
      );
    } catch (e) {
      console.error(e);
      throw new ConnectionError();
    }
  };

  getRoutineExclusionsByEventId = async (idEvent: number) => {
    var response;
    try {
      response = await this.client.query(
        "SELECT * FROM p.routine_exclusion WHERE id_event = $1",
        [idEvent]
      );
      return response.rows.map((exclusion) =>
        RoutineExclusionModel.fromDatabase(exclusion)
      );
    } catch (e) {
      console.error(e);
      throw new ConnectionError();
    }
  };

  deleteRoutineExclusionById = async (idRoutineExclusion: number) => {
    var response;
    try {
      response = await this.client.query(
        "DELETE FROM p.routine_exclusion WHERE id_routine_exclusion = $1",
        [idRoutineExclusion]
      );
    } catch (e) {
      console.error(e);
      throw new ConnectionError();
    }
  };

  resetAssignmentById = async (idAssignment: number) => {
    var response;
    try {
      response = await this.client.query(
        "UPDATE p.assignment SET is_completed = FALSE WHERE id_assignment = $1",
        [idAssignment]
      );
    } catch (e) {
      console.error(e);
      throw new ConnectionError();
    }
  };
}
