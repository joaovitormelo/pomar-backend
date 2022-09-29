import { ErrorMessages } from "../../../../core/errors/error_messages";
import { HttpRequest } from "../../../../core/presentation/routers/http_request";
import { HttpResponse } from "../../../../core/presentation/routers/http_response";
import { SecuredRouter } from "../../../../core/presentation/routers/secured_router";
import { ValidateBody } from "../../../../core/presentation/routers/validate_body";
import { DoValidateSession } from "../../../login/domain/usecases/do_validate_session";
import { AssignmentModel } from "../../data/models/assignment_status_model";
import { EventModel } from "../../data/models/event_model";
import { AddEventParams, DoAddEvent } from "../../domain/usecases/do_add_event";
import {
  DoReadEvents,
  ReadEventsData,
} from "../../domain/usecases/do_read_events";

export class ScheduleRouter extends SecuredRouter {
  doValidateSession: DoValidateSession;
  doReadEvents: DoReadEvents;
  doAddEvent: DoAddEvent;

  constructor(
    doValidateSession: DoValidateSession,
    doReadEvents: DoReadEvents,
    doAddEvent: DoAddEvent
  ) {
    super(doValidateSession);
    this.doReadEvents = doReadEvents;
    this.doAddEvent = doAddEvent;
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

  addEvent = async (httpRequest: HttpRequest) => {
    return await this.validateToken(httpRequest, async () => {
      return await new ValidateBody().validate(
        httpRequest,
        ["event", "assignment_list"],
        async () => {
          var event: EventModel;
          var assignmentList: Array<AssignmentModel> = [];
          try {
            event = EventModel.fromClient(httpRequest.body.event);
          } catch (e) {
            console.log(e);
            return new HttpResponse(ErrorMessages.infoInvalidValue.status, {
              code: ErrorMessages.infoInvalidValue.code,
              msg: ErrorMessages.infoInvalidValue.msg,
              target: "event",
            });
          }
          try {
            for (var i in httpRequest.body.assignment_list) {
              const assignment: AssignmentModel = AssignmentModel.fromClient(
                httpRequest.body.assignment_list[i]
              );
              assignmentList.push(assignment);
            }
          } catch (e) {
            console.log(e);
            return new HttpResponse(ErrorMessages.infoInvalidValue.status, {
              code: ErrorMessages.infoInvalidValue.code,
              msg: ErrorMessages.infoInvalidValue.msg,
              target: "assignment_list",
            });
          }
          try {
            await this.doAddEvent.execute(
              new AddEventParams(event, assignmentList)
            );
            return new HttpResponse(200);
          } catch (e) {
            return ErrorMessages.mapErrorToHttpResponse(e);
          }
        }
      );
    });
  };
}
