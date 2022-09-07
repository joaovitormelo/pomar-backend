import { Client } from "pg";
import { Encrypter } from "../../core/utils/encrypter";
import { Validator } from "../../core/utils/validator";
import { LoginDatabaseSource } from "./data/datasources/login_database_source";
import { LoginRepository } from "./data/repositories/login_repository";
import DoLogin from "./domain/usecases/do_login";
import { DoValidateSession } from "./domain/usecases/do_validate_session";
import { Logout } from "./domain/usecases/logout";
import { LoginRouter } from "./presentation/routers/login_router";
import Timer from "./utils/timer";
import { TokenGenerator } from "./utils/token_generator";

const login = require("./presentation/api/login_api");

export class LoginInitializer {
  init = (server, pgClient: Client) => {
    //Data
    const loginDatabaseSource = new LoginDatabaseSource(pgClient);
    const loginRepository = new LoginRepository(loginDatabaseSource);
    const encrypter = new Encrypter();
    const tokenGenerator = new TokenGenerator();
    const timer = new Timer();

    //Domain
    const doLogin = new DoLogin(
      loginRepository,
      encrypter,
      tokenGenerator,
      timer
    );
    const logout = new Logout(loginRepository);
    const doValidateSession = new DoValidateSession(
      loginRepository,
      tokenGenerator
    );

    //Presentation
    const validator = new Validator();
    const loginRouter = new LoginRouter(
      validator,
      doLogin,
      logout,
      doValidateSession
    );

    login(server, loginRouter);
  };
}
