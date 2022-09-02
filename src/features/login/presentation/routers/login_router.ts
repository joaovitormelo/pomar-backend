import {
  AuthenticationError,
  ConnectionError,
  InvalidValueError,
  UserNotFoundError,
} from "../../../../core/errors/errors";
import { ValidatorContract } from "../../../../core/utils/validator";
import { SessionModel } from "../../data/models/session_model";
import { Session } from "../../domain/entities/session";
import DoLogin, { LoginParams } from "../../domain/usecases/do_login";

export class HttpRequest {
  body: any;
  headers: object;

  constructor(body: any, headers: object) {
    this.body = body;
    this.headers = headers;
  }
}

export class HttpResponse {
  status: number;
  data;

  constructor(status: number, data) {
    this.status = status;
    this.data = data;
  }
}

export class LoginRouter {
  validator: ValidatorContract;
  usecase: DoLogin;

  constructor(validator: ValidatorContract, usecase: DoLogin) {
    this.validator = validator;
    this.usecase = usecase;
  }

  login = async (httpRequest: HttpRequest) => {
    if (!httpRequest.body) {
      return new HttpResponse(400, {
        code: "001",
        msg: "No body",
      });
    }
    if (!httpRequest.body.email) {
      return new HttpResponse(400, {
        code: "002",
        msg: "Missing parameter",
        target: "email",
      });
    }
    if (!httpRequest.body.password) {
      return new HttpResponse(400, {
        code: "002",
        msg: "Missing parameter",
        target: "password",
      });
    }
    const email = httpRequest.body.email;
    const password = httpRequest.body.password;

    if (!this.validator.validateEmail(httpRequest.body.email)) {
      return new HttpResponse(400, {
        code: "003",
        msg: "Invalid value",
        target: "email",
      });
    } else if (!this.validator.validatePassword(httpRequest.body.password)) {
      return new HttpResponse(400, {
        code: "003",
        msg: "Invalid value",
        target: "password",
      });
    }
    try {
      const session: Session = await this.usecase.execute(
        new LoginParams(email, password)
      );
      return new HttpResponse(200, {
        session: SessionModel.fromEntity(session).toJSObject(),
      });
    } catch (e) {
      console.log(e);
      if (e instanceof ConnectionError) {
        return new HttpResponse(503, {
          code: "001",
          msg: "No connection to database",
        });
      } else if (e instanceof UserNotFoundError) {
        return new HttpResponse(404, {
          code: "002",
          msg: "User wasn't found",
        });
      } else if (e instanceof AuthenticationError) {
        return new HttpResponse(401, {
          code: "001",
          msg: "Wrong password",
        });
      } else {
        return new HttpResponse(500, {
          msg: "Unknown error in server",
        });
      }
    }
  };
}
