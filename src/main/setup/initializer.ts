import { Client } from "pg";
import { Encrypter } from "../../core/utils/encrypter";
import { EmployeeInitializer } from "../../features/employee/presentation/employee_initializer";
import { LoginDatabaseSource } from "../../features/login/data/datasources/login_database_source";
import { LoginRepository } from "../../features/login/data/repositories/login_repository";
import { DoValidateSession } from "../../features/login/domain/usecases/do_validate_session";
import { LoginInitializer } from "../../features/login/login_initializer";
import { TokenGenerator } from "../../features/login/utils/token_generator";

const server = require("./server");
const client = require("./database");

export class Initializer {
  init = async () => {
    const pgClient: Client = await client();

    const loginDatabaseSource: LoginDatabaseSource = new LoginDatabaseSource(
      pgClient
    );
    const encrypter: Encrypter = new Encrypter();

    const loginRepository: LoginRepository = new LoginRepository(
      loginDatabaseSource
    );
    const tokenGenerator: TokenGenerator = new TokenGenerator();

    const doValidateSession: DoValidateSession = new DoValidateSession(
      loginRepository,
      tokenGenerator
    );

    new LoginInitializer(
      server,
      loginRepository,
      tokenGenerator,
      doValidateSession,
      encrypter
    ).init();
    new EmployeeInitializer(
      server,
      pgClient,
      doValidateSession,
      encrypter
    ).init();

    //Routes
    require("../routes/routes")(server);

    process.on("SIGINT", async () => {
      await pgClient.end();
      console.log("DB CONNECTION CLOSED");
    });
  };
}
