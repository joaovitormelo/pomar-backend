import { ErrorMessages } from "../../../../core/errors/error_messages";
import { HttpRequest } from "../../../../core/presentation/routers/http_request";
import { HttpResponse } from "../../../../core/presentation/routers/http_response";
import { SecuredRouter } from "../../../../core/presentation/routers/secured_router";
import { DoValidateSession } from "../../../login/domain/usecases/do_validate_session";
import { EventModel } from "../../data/models/event_model";
import {
  DoReadEvents,
  ReadEventsData,
} from "../../domain/usecases/do_read_events";

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
        const readEventsDataList: Array<ReadEventsData> =
          await this.doReadEvents.execute();
        var readEventsDataListJson = [];
        if (readEventsDataList.length > 0) {
          readEventsDataListJson = readEventsDataList.map(
            (readEventsData: ReadEventsData) => {
              var assignmentListJson = [];
              if (readEventsData.assignments.length > 0) {
                assignmentListJson = readEventsData.assignments.map(
                  (assignment) => assignment.toJSObject()
                );
              }
              return {
                event: readEventsData.event.toJSObject(),
                assignments: assignmentListJson,
              };
            }
          );
        }
        return new HttpResponse(200, readEventsDataListJson);
      } catch (e) {
        return ErrorMessages.mapErrorToHttpResponse(e);
      }
    });
  };
}
