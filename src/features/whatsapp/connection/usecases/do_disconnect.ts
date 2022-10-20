import { WhatsAppConnection } from "../config/whatsapp_connection";

export class DoDisconnect {
  whatsAppConnection: WhatsAppConnection;

  constructor(whatsAppConnection: WhatsAppConnection) {
    this.whatsAppConnection = whatsAppConnection;
  }

  async execute() {
    const unconn = await this.whatsAppConnection.client.logout();
  }
}
