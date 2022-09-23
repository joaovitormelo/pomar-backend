import { ErrorMessages } from "../../../../core/errors/error_messages";
import { HttpRequest } from "../../../../core/presentation/routers/http_request";
import { HttpResponse } from "../../../../core/presentation/routers/http_response";
import { SecuredRouter } from "../../../../core/presentation/routers/secured_router";
import { DoValidateSession } from "../../../login/domain/usecases/do_validate_session";
import { EventModel } from "../../data/models/event_model";
import { DoReadEvents } from "../../domain/usecases/do_read_events";

export class ScheduleRouter extends SecuredRouter {
  doValidateSession: DoValidateSession;
  doReadEvents: DoReadEvents;

  constructor(
    doValidateSession: DoValidateSession,
    doReadEvents: DoReadEvents
  ) {
    super(doValidateSession);
    this.doReadEvents = doReadEvents;
  }

  readEvents = async (httpRequest: HttpRequest) => {
    return await this.validateToken(httpRequest, async () => {
      try {
        const eventList: Array<EventModel> = await this.doReadEvents.execute();
        const eventListJson = eventList.map((event: EventModel) =>
          event.toJSObject()
        );
        return new HttpResponse(200, eventListJson);
      } catch (e) {
        return ErrorMessages.mapErrorToHttpResponse(e);
      }
    });
  };
}
