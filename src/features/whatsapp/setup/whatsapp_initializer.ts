import { WhatsAppConnection } from "../connection/config/whatsapp_connection";

export class WhatsAppInitializer {
  init() {
    const whatsConn: WhatsAppConnection = new WhatsAppConnection();
    whatsConn.init();
  }
}
