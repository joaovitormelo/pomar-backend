import { EventInfoModel } from "./event_info_model";

export class EventModel {
  idEvent: number;
  eventInfo: EventInfoModel;
  date: string;

  constructor(idEvent: number, eventInfo: EventInfoModel, date: string) {
    this.idEvent = idEvent;
    this.eventInfo = eventInfo;
    this.date = date;
  }

  toJSObject() {
    return {
      id_event: this.idEvent,
      event_info: this.eventInfo.toJSObject(),
      date: this.date,
    };
  }

  static fromDatabase(event: any) {
    return new EventModel(
      event.id_event,
      EventInfoModel.fromDatabase(event),
      event.date
    );
  }

  static fromClient(event: any) {
    return new EventModel(
      event.id_event,
      EventInfoModel.fromDatabase(event.event_info),
      event.date
    );
  }
}
