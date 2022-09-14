import { Client } from "pg";
import { Encrypter } from "../../core/utils/encrypter";
import { Validator } from "../../core/utils/validator";
import { LoginDatabaseSource } from "./data/datasources/login_database_source";
import { LoginRepository } from "./data/repositories/login_repository";
import DoLogin from "./domain/usecases/do_login";
import { DoValidateSession } from "./domain/usecases/do_validate_session";
import { Logout } from "./domain/usecases/logout";
import { LoginApi } from "./presentation/api/login_api";
import { LoginRouter } from "./presentation/routers/login_router";
import Timer from "./utils/timer";
import { TokenGenerator } from "./utils/token_generator";

export class LoginInitializer {
  server;
  loginRepository: LoginRepository;
  tokenGenerator: TokenGenerator;
  doValidateSession: DoValidateSession;

  constructor(
    server,
    loginRepository: LoginRepository,
    tokenGenerator: TokenGenerator,
    doValidateSession: DoValidateSession
  ) {
    this.server = server;
    this.loginRepository = loginRepository;
    this.tokenGenerator = tokenGenerator;
    this.doValidateSession = doValidateSession;
  }

  init = () => {
    const encrypter = new Encrypter();
    const timer = new Timer();

    const doLogin = new DoLogin(
      this.loginRepository,
      encrypter,
      this.tokenGenerator,
      timer
    );
    const logout = new Logout(this.loginRepository);
    const doValidateSession = new DoValidateSession(
      this.loginRepository,
      this.tokenGenerator
    );

    const validator = new Validator();
    const loginRouter = new LoginRouter(
      doValidateSession,
      validator,
      doLogin,
      logout
    );

    new LoginApi(this.server, loginRouter).start();
  };
}
