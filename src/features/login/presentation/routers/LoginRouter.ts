import {
  AuthenticationError,
  ConnectionError,
  InvalidValueError,
  UserNotFoundError,
} from "../../../../core/errors/errors";
import { SessionData } from "../../domain/entities/session_data";
import DoLogin, { LoginParams } from "../../domain/usecases/do_login";

class HttpRequest {
  body: any;
  header: object;

  constructor(body: any, header: object) {
    this.body = body;
    this.header = header;
  }
}

class HttpResponse {
  status: number;
  success: boolean;
  msg: string;
  target: string;
  content: string;

  constructor(
    status: number,
    success: boolean,
    msg?: string,
    target?: string,
    content?: string
  ) {
    this.status = status;
    this.success = success;
    this.msg = msg;
    this.target = target;
    this.content = content;
  }
}

export class LoginRouter {
  usecase: DoLogin;

  constructor(usecase: DoLogin) {
    this.usecase = usecase;
  }

  doLogin = async (httpRequest: HttpRequest) => {
    var httpResponse: HttpResponse;
    if (!httpRequest.body) {
      httpResponse = new HttpResponse(400, false, "Request inválida!");
    } else if (!httpRequest.body.email) {
      httpResponse = new HttpResponse(400, false, "Request inválida!");
    } else if (!httpRequest.body.password) {
      httpResponse = new HttpResponse(400, false, "Request inválida!");
    } else {
      const email = httpRequest.body.email;
      const password = httpRequest.body.password;
      try {
        const sessionData: SessionData = await this.usecase.execute(
          new LoginParams(email, password)
        );
        httpResponse = new HttpResponse(200, true, undefined, undefined);
      } catch (e) {
        if (e instanceof ConnectionError) {
          httpResponse = new HttpResponse(
            503,
            false,
            "O servidor está temporariamente indisponível!"
          );
        } else if (e instanceof UserNotFoundError) {
          httpResponse = new HttpResponse(
            200,
            false,
            "Usuário não encontrado!",
            "email"
          );
        } else if (e instanceof AuthenticationError) {
          httpResponse = new HttpResponse(
            200,
            false,
            "Senha incorreta!",
            "password"
          );
        } else if (e instanceof InvalidValueError) {
          httpResponse = new HttpResponse(
            400,
            false,
            "Valor inválido!",
            e.value
          );
        } else {
          httpResponse = new HttpResponse(
            500,
            false,
            "Ocorreu um erro inesperado!",
            "email"
          );
        }
      }
    }
    return httpResponse;
  };
}
