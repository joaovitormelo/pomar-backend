import { Client } from "pg";
import { WebSocketServer } from "../../core/config/web_socket_server";
import { Encrypter } from "../../core/utils/encrypter";
import { EmployeeInitializer } from "../../features/employee/presentation/employee_initializer";
import { LoginDatabaseSource } from "../../features/login/data/datasources/login_database_source";
import { LoginRepository } from "../../features/login/data/repositories/login_repository";
import { DoValidateSession } from "../../features/login/domain/usecases/do_validate_session";
import { LoginInitializer } from "../../features/login/login_initializer";
import { TokenGenerator } from "../../features/login/utils/token_generator";
import { ScheduleInitializer } from "../../features/schedule/schedule_initializer";
import { WhatsAppInitializer } from "../../features/whatsapp/setup/whatsapp_initializer";

const { server, serverInstance } = require("./server");
const client = require("./database");

export class Initializer {
  init = async () => {
    const wsServer: WebSocketServer = new WebSocketServer(serverInstance);
    wsServer.init();
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
    new WhatsAppInitializer(server, doValidateSession, wsServer).init();
    new ScheduleInitializer(server, pgClient, doValidateSession).init();

    //Routes
    require("../routes/routes")(server);

    process.on("SIGINT", async () => {
      await pgClient.end();
      console.log("DB CONNECTION CLOSED");
    });
  };
}
