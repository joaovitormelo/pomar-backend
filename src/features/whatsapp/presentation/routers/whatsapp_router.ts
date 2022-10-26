import { ErrorMessages } from "../../../../core/errors/error_messages";
import { HttpRequest } from "../../../../core/presentation/routers/http_request";
import { HttpResponse } from "../../../../core/presentation/routers/http_response";
import { SecuredRouter } from "../../../../core/presentation/routers/secured_router";
import { ValidateBody } from "../../../../core/presentation/routers/validate_body";
import { DoValidateSession } from "../../../login/domain/usecases/do_validate_session";
import {
  CheckConnectionReturn,
  DoCheckConnection,
} from "../../connection/usecases/do_check_connection";
import { DoDisconnect } from "../../connection/usecases/do_disconnect";
import { ContactModel } from "../../message/data/models/contact_model";
import {
  DoSendMessages,
  SendMessagesParams,
} from "../../message/usecases/do_send_messages";

export class WhatsAppRouter extends SecuredRouter {
  doCheckConnection: DoCheckConnection;
  doDisconnect: DoDisconnect;
  doSendMessages: DoSendMessages;

  constructor(
    doValidateSession: DoValidateSession,
    doCheckConnection: DoCheckConnection,
    doDisconnect: DoDisconnect,
    doSendMessages: DoSendMessages
  ) {
    super(doValidateSession);
    this.doCheckConnection = doCheckConnection;
    this.doDisconnect = doDisconnect;
    this.doSendMessages = doSendMessages;
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

  send = async (httpRequest: HttpRequest) => {
    return await this.validateToken(httpRequest, async () => {
      return await ValidateBody.validate(
        httpRequest,
        ["contact_list", "message"],
        async () => {
          var contactList: Array<ContactModel>;
          try {
            contactList = httpRequest.body.contact_list.map((contact) =>
              ContactModel.fromJson(contact)
            );
          } catch (e) {
            console.log(e);
            return new HttpResponse(ErrorMessages.infoInvalidValue.status, {
              code: ErrorMessages.infoInvalidValue.code,
              msg: ErrorMessages.infoInvalidValue.msg,
              target: "contact_list",
            });
          }
          try {
            contactList = await this.doSendMessages.execute(
              new SendMessagesParams(contactList, httpRequest.body.message)
            );
            return new HttpResponse(
              200,
              contactList.map((contact) => contact.toJson())
            );
          } catch (e) {
            return ErrorMessages.mapErrorToHttpResponse(e);
          }
        }
      );
    });
  };
}
