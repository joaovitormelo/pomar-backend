import { ErrorMessages } from "../../../../core/errors/error_messages";
import { HttpRequest } from "../../../../core/presentation/routers/http_request";
import { HttpResponse } from "../../../../core/presentation/routers/http_response";
import { SecuredRouter } from "../../../../core/presentation/routers/secured_router";
import { ValidatorContract } from "../../../../core/utils/validator";
import { SessionModel } from "../../data/models/session_model";
import { Session } from "../../domain/entities/session";
import DoLogin, { LoginParams } from "../../domain/usecases/do_login";
import { DoValidateSession } from "../../domain/usecases/do_validate_session";
import { Logout } from "../../domain/usecases/logout";

export class LoginRouter extends SecuredRouter {
  validator: ValidatorContract;
  doLoginUsecase: DoLogin;
  logoutUsecase: Logout;

  constructor(
    doValidateSession: DoValidateSession,
    validator: ValidatorContract,
    doLoginUsecase: DoLogin,
    logoutUsecase: Logout
  ) {
    super(doValidateSession);
    this.validator = validator;
    this.doLoginUsecase = doLoginUsecase;
    this.logoutUsecase = logoutUsecase;
  }

  login = async (httpRequest: HttpRequest) => {
    if (!httpRequest.body) {
      return new HttpResponse(ErrorMessages.infoNoBody.status, {
        code: ErrorMessages.infoNoBody.code,
        msg: ErrorMessages.infoNoBody.msg,
      });
    }
    if (!httpRequest.body.email) {
      return new HttpResponse(ErrorMessages.infoMissingParameter.status, {
        code: ErrorMessages.infoMissingParameter.code,
        msg: ErrorMessages.infoMissingParameter.msg,
        target: "email",
      });
    }
    if (!httpRequest.body.password) {
      return new HttpResponse(ErrorMessages.infoMissingParameter.status, {
        code: ErrorMessages.infoMissingParameter.code,
        msg: ErrorMessages.infoMissingParameter.msg,
        target: "password",
      });
    }
    const email = httpRequest.body.email;
    const password = httpRequest.body.password;

    if (!this.validator.validateEmail(httpRequest.body.email)) {
      return new HttpResponse(ErrorMessages.infoInvalidValue.status, {
        code: ErrorMessages.infoInvalidValue.code,
        msg: ErrorMessages.infoInvalidValue.msg,
        target: "email",
      });
    } else if (!this.validator.validatePassword(httpRequest.body.password)) {
      return new HttpResponse(ErrorMessages.infoInvalidValue.status, {
        code: ErrorMessages.infoInvalidValue.code,
        msg: ErrorMessages.infoInvalidValue.msg,
        target: "password",
      });
    }
    try {
      const session: Session = await this.doLoginUsecase.execute(
        new LoginParams(email, password)
      );
      return new HttpResponse(200, {
        session: SessionModel.fromEntity(session).toJSObject(),
      });
    } catch (e) {
      return ErrorMessages.mapErrorToHttpResponse(e);
    }
  };

  logout = async (httpRequest: HttpRequest) => {
    if (!httpRequest.body) {
      return new HttpResponse(ErrorMessages.infoNoBody.status, {
        code: ErrorMessages.infoNoBody.code,
        msg: ErrorMessages.infoNoBody.msg,
      });
    }
    if (
      httpRequest.body.id_session == null ||
      httpRequest.body.id_session == undefined
    ) {
      return new HttpResponse(ErrorMessages.infoMissingParameter.status, {
        code: ErrorMessages.infoMissingParameter.code,
        msg: ErrorMessages.infoMissingParameter.msg,
        target: "id_session",
      });
    }

    const idSession = parseInt(httpRequest.body.id_session);

    try {
      await this.logoutUsecase.execute(idSession);
      return new HttpResponse(200);
    } catch (e) {
      return ErrorMessages.mapErrorToHttpResponse(e);
    }
  };
}
