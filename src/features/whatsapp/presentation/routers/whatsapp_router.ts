import { ErrorMessages } from "../../../../core/errors/error_messages";
import { HttpRequest } from "../../../../core/presentation/routers/http_request";
import { HttpResponse } from "../../../../core/presentation/routers/http_response";
import { SecuredRouter } from "../../../../core/presentation/routers/secured_router";
import { DoValidateSession } from "../../../login/domain/usecases/do_validate_session";
import {
  CheckConnectionReturn,
  DoCheckConnection,
} from "../../connection/usecases/do_check_connection";
import { DoDisconnect } from "../../connection/usecases/do_disconnect";

export class WhatsAppRouter extends SecuredRouter {
  doCheckConnection: DoCheckConnection;
  doDisconnect: DoDisconnect;

  constructor(
    doValidateSession: DoValidateSession,
    doCheckConnection: DoCheckConnection,
    doDisconnect: DoDisconnect
  ) {
    super(doValidateSession);
    this.doCheckConnection = doCheckConnection;
    this.doDisconnect = doDisconnect;
  }

  checkConnection = async (httpRequest: HttpRequest) => {
    return await this.validateToken(httpRequest, async () => {
      try {
        const response: CheckConnectionReturn =
          await this.doCheckConnection.execute();
        return new HttpResponse(200, {
          err: response.err,
          msg: response.msg,
          qr: response.qr,
        });
      } catch (e) {
        return ErrorMessages.mapErrorToHttpResponse(e);
      }
    });
  };

  disconnect = async (httpRequest: HttpRequest) => {
    return await this.validateToken(httpRequest, async () => {
      try {
        await this.doDisconnect.execute();
        return new HttpResponse(200);
      } catch (e) {
        return ErrorMessages.mapErrorToHttpResponse(e);
      }
    });
  };
}
