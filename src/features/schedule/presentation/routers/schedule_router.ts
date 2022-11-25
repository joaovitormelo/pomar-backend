import { ErrorMessages } from "../../../../core/errors/error_messages";
import { HttpRequest } from "../../../../core/presentation/routers/http_request";
import { HttpResponse } from "../../../../core/presentation/routers/http_response";
import { SecuredRouter } from "../../../../core/presentation/routers/secured_router";
import { ValidateBody } from "../../../../core/presentation/routers/validate_body";
import { DoValidateSession } from "../../../login/domain/usecases/do_validate_session";
import { AssignmentModel } from "../../data/models/assignment_model";
import { EventModel } from "../../data/models/event_model";
import { AddEventParams, DoAddEvent } from "../../domain/usecases/do_add_event";
import { DoDailyChecks } from "../../domain/usecases/do_daily_checks";
import {
  DeleteEventParams,
  DoDeleteEvent,
} from "../../domain/usecases/do_delete_event";
import {
  DoEditEvent,
  EditEventParams,
} from "../../domain/usecases/do_edit_event";
import {
  DoReadEvents,
  ReadEventsData,
} from "../../domain/usecases/do_read_events";
import { DoReadEventsByEmployee } from "../../domain/usecases/do_read_events_by_employee";
import { DoSwitchCompleteAssignment } from "../../domain/usecases/do_risk_task";

export class ScheduleRouter extends SecuredRouter {
  doValidateSession: DoValidateSession;
  doReadEvents: DoReadEvents;
  doReadEventsByEmployee: DoReadEventsByEmployee;
  doAddEvent: DoAddEvent;
  doEditEvent: DoEditEvent;
  doDeleteEvent: DoDeleteEvent;
  doDailyChecks: DoDailyChecks;
  doSwitchCompleteAssignment: DoSwitchCompleteAssignment;

  constructor(
    doValidateSession: DoValidateSession,
    doReadEvents: DoReadEvents,
    doReadEventsByEmployee: DoReadEventsByEmployee,
    doAddEvent: DoAddEvent,
    doEditEvent: DoEditEvent,
    doDeleteEvent: DoDeleteEvent,
    doDailyChecks: DoDailyChecks,
    doSwitchCompleteAssignment: DoSwitchCompleteAssignment
  ) {
    super(doValidateSession);
    this.doReadEvents = doReadEvents;
    this.doReadEventsByEmployee = doReadEventsByEmployee;
    this.doAddEvent = doAddEvent;
    this.doEditEvent = doEditEvent;
    this.doDeleteEvent = doDeleteEvent;
    this.doDailyChecks = doDailyChecks;
    this.doSwitchCompleteAssignment = doSwitchCompleteAssignment;
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
              var assignmentListJson = readEventsData.assignments.map(
                (assignment) => assignment.toJSObject()
              );
              var routineExclusionListJson =
                readEventsData.routineExclusionList.map((routineExclusion) =>
                  routineExclusion.toJSObject()
                );
              return {
                event: readEventsData.event.toJSObject(),
                assignments: assignmentListJson,
                routine_exclusion_list: routineExclusionListJson,
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

  readEventsByEmployee = async (httpRequest: HttpRequest) => {
    return await this.validateToken(httpRequest, async () => {
      return await ValidateBody.validate(
        httpRequest,
        ["id_person"],
        async () => {
          try {
            const readEventsDataList: Array<ReadEventsData> =
              await this.doReadEventsByEmployee.execute(
                httpRequest.body.id_person
              );
            var readEventsDataListJson = [];
            if (readEventsDataList.length > 0) {
              readEventsDataListJson = readEventsDataList.map(
                (readEventsData: ReadEventsData) => {
                  var assignmentListJson = readEventsData.assignments.map(
                    (assignment) => assignment.toJSObject()
                  );
                  var routineExclusionListJson =
                    readEventsData.routineExclusionList.map(
                      (routineExclusion) => routineExclusion.toJSObject()
                    );
                  return {
                    event: readEventsData.event.toJSObject(),
                    assignments: assignmentListJson,
                    routine_exclusion_list: routineExclusionListJson,
                  };
                }
              );
            }
            return new HttpResponse(200, readEventsDataListJson);
          } catch (e) {
            return ErrorMessages.mapErrorToHttpResponse(e);
          }
        }
      );
    });
  };

  addEvent = async (httpRequest: HttpRequest) => {
    return await this.validateToken(httpRequest, async () => {
      return await ValidateBody.validate(
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

  editEvent = async (httpRequest: HttpRequest) => {
    return await this.validateToken(httpRequest, async () => {
      return await ValidateBody.validate(
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
            await this.doEditEvent.execute(
              new EditEventParams(event, assignmentList)
            );
            return new HttpResponse(200);
          } catch (e) {
            return ErrorMessages.mapErrorToHttpResponse(e);
          }
        }
      );
    });
  };

  deleteEvent = async (httpRequest: HttpRequest) => {
    return await this.validateToken(httpRequest, async () => {
      return await ValidateBody.validate(
        httpRequest,
        ["id_event", "exclude_dates"],
        async () => {
          try {
            await this.doDeleteEvent.execute(
              new DeleteEventParams(
                httpRequest.body.id_event,
                httpRequest.body.exclude_dates
              )
            );
            return new HttpResponse(200);
          } catch (e) {
            return ErrorMessages.mapErrorToHttpResponse(e);
          }
        }
      );
    });
  };

  switchCompleteAssignment = async (httpRequest: HttpRequest) => {
    return await this.validateToken(httpRequest, async () => {
      return await ValidateBody.validate(
        httpRequest,
        ["id_assignment", "is_completed"],
        async () => {
          try {
            await this.doSwitchCompleteAssignment.execute(
              httpRequest.body["id_assignment"],
              httpRequest.body["is_completed"]
            );
            return new HttpResponse(200);
          } catch (e) {
            return ErrorMessages.mapErrorToHttpResponse(e);
          }
        }
      );
    });
  };

  test = async (httpRequest: HttpRequest) => {
    this.doDailyChecks.execute();
    return new HttpResponse(200);
  };
}
