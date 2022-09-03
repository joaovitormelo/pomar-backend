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
  static infoUserNotFoundError = {
    status: 404,
    msg: "User wasn't found",
    code: "002",
  };
  static infoAuthenticationError = {
    status: 401,
    msg: "Wrong password",
    code: "001",
  };
  static infoConnectionError = {
    status: 503,
    msg: "No connection to database",
    code: "001",
  };
  static infoUnknownError = {
    status: 500,
    msg: "Unknown error in server",
  };
}
