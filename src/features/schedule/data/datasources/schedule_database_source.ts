import { Client } from "pg";
import { ConnectionError, NoDataError } from "../../../../core/errors/errors";
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
}
