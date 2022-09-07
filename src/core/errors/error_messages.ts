import { HttpResponse } from "../../features/login/presentation/routers/login_router";
import {
  AuthenticationError,
  ConnectionError,
  InvalidSessionError,
  NoDataError,
  UserNotFoundError,
} from "./errors";

export class ErrorMessages {
  static infoNoBody = {
    status: 400,
    msg: "No body",
    code: "001",
  };
  static infoMissingParameter = {
    status: 400,
    msg: "Missing parameter",
    code: "002",
  };
  static infoInvalidValue = {
    status: 400,
    msg: "Invalid value",
    code: "003",
  };

  static infoAuthenticationError = {
    status: 401,
    msg: "Wrong password",
    code: "001",
  };
  static infoInvalidSessionError = {
    status: 401,
    msg: "Invalid session",
    code: "002",
  };

  static infoUserNotFoundError = {
    status: 404,
    msg: "User wasn't found",
    code: "002",
  };
  static infoNoDataError = {
    status: 404,
    msg: "There is no matching data",
    code: "003",
  };

  static infoUnknownError = {
    status: 500,
    msg: "Unknown error in server",
  };

  static infoConnectionError = {
    status: 503,
    msg: "No connection to database",
    code: "001",
  };

  static mapErrorToHttpResponse(e) {
    console.log(e);

    if (e instanceof ConnectionError) {
      return new HttpResponse(ErrorMessages.infoConnectionError.status, {
        code: ErrorMessages.infoConnectionError.code,
        msg: ErrorMessages.infoConnectionError.msg,
      });
    } else if (e instanceof UserNotFoundError) {
      return new HttpResponse(ErrorMessages.infoUserNotFoundError.status, {
        code: ErrorMessages.infoUserNotFoundError.code,
        msg: ErrorMessages.infoUserNotFoundError.msg,
      });
    } else if (e instanceof AuthenticationError) {
      return new HttpResponse(ErrorMessages.infoAuthenticationError.status, {
        code: ErrorMessages.infoAuthenticationError.code,
        msg: ErrorMessages.infoAuthenticationError.msg,
      });
    } else if (e instanceof InvalidSessionError) {
      return new HttpResponse(ErrorMessages.infoInvalidSessionError.status, {
        code: ErrorMessages.infoInvalidSessionError.code,
        msg: ErrorMessages.infoInvalidSessionError.msg,
      });
    } else if (e instanceof NoDataError) {
      return new HttpResponse(ErrorMessages.infoNoDataError.status, {
        code: ErrorMessages.infoNoDataError.code,
        msg: ErrorMessages.infoNoDataError.msg,
      });
    } else {
      return new HttpResponse(ErrorMessages.infoUnknownError.status, {
        msg: ErrorMessages.infoUnknownError.msg,
      });
    }
  }
}
