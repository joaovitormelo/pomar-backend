import { Client } from "pg";
import { ConnectionError, NoDataError } from "../../../../core/errors/errors";
import { AssignmentModel } from "../models/assignment_status_model";
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
}
