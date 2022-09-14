import { DoValidateSession } from "../../../features/login/domain/usecases/do_validate_session";
import { ErrorMessages } from "../../errors/error_messages";
import { HttpRequest } from "./http_request";
import { HttpResponse } from "./http_response";

export class SecuredRouter {
  doValidateSession: DoValidateSession;

  constructor(doValidateSession: DoValidateSession) {
    this.doValidateSession = doValidateSession;
  }

  validateToken = async (
    httpRequest: HttpRequest,
    body: () => Promise<HttpResponse>
  ) => {
    if (!httpRequest.body) {
      return new HttpResponse(ErrorMessages.infoNoBody.status, {
        code: ErrorMessages.infoNoBody.code,
        msg: ErrorMessages.infoNoBody.msg,
      });
    }
    if (httpRequest.headers["authorization"] == null) {
      return new HttpResponse(ErrorMessages.infoMissingHeader.status, {
        code: ErrorMessages.infoMissingHeader.code,
        msg: ErrorMessages.infoMissingHeader.msg,
        target: "authorization",
      });
    }

    var token: string = httpRequest.headers["authorization"];
    try {
      await this.doValidateSession.execute(token);
      return await body();
    } catch (e) {
      return ErrorMessages.mapErrorToHttpResponse(e);
    }
  };
}
