import { WebSocketServer } from "../../../core/config/web_socket_server";
import { DoValidateSession } from "../../login/domain/usecases/do_validate_session";
import { WhatsAppConnection } from "../connection/config/whatsapp_connection";
import { DoCheckConnection } from "../connection/usecases/do_check_connection";
import { DoDisconnect } from "../connection/usecases/do_disconnect";
import { DoSendMessages } from "../message/usecases/do_send_messages";
import { WhatsAppApi } from "../presentation/api/whatsapp_api";
import { WhatsAppRouter } from "../presentation/routers/whatsapp_router";

export class WhatsAppInitializer {
  server;
  doValidateSession: DoValidateSession;
  wsServer: WebSocketServer;

  constructor(
    server,
    doValidateSession: DoValidateSession,
    wsServer: WebSocketServer
  ) {
    this.server = server;
    this.doValidateSession = doValidateSession;
    this.wsServer = wsServer;
  }

  init() {
    const whatsConn: WhatsAppConnection = new WhatsAppConnection(this.wsServer);
    whatsConn.init();

    const doCheckConnection: DoCheckConnection = new DoCheckConnection(
      whatsConn
    );
    const doDisconnect: DoDisconnect = new DoDisconnect(whatsConn);
    const doSendMessages: DoSendMessages = new DoSendMessages(whatsConn);

    const whatsAppRouter: WhatsAppRouter = new WhatsAppRouter(
      this.doValidateSession,
      doCheckConnection,
      doDisconnect,
      doSendMessages
    );

    new WhatsAppApi(this.server, whatsAppRouter).start();
  }
}
