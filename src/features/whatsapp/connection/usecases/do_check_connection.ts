import { WAState } from "whatsapp-web.js";
import { WhatsAppConnection } from "../config/whatsapp_connection";

export class CheckConnectionReturn {
  err: boolean;
  msg: string;
  qr: string;

  constructor(err: boolean, msg: string, qr: string) {
    this.err = err;
    this.msg = msg;
    this.qr = qr;
  }
}

export class DoCheckConnection {
  whatsConn: WhatsAppConnection;

  constructor(whatsConn: WhatsAppConnection) {
    this.whatsConn = whatsConn;
  }

  async execute() {
    try {
      if (this.whatsConn.isDisconnecting) {
        return new CheckConnectionReturn(
          true,
          "Preparando nova conexão com o WhatsApp...",
          ""
        );
      } else {
        const state = await this.whatsConn.client.getState();
        if (state == null) {
          if (this.whatsConn.qrCode) {
            return new CheckConnectionReturn(false, "", this.whatsConn.qrCode);
          } else {
            return new CheckConnectionReturn(
              true,
              "Aguarde a conexão com o WhatsApp...",
              ""
            );
          }
        } else if (state == WAState.CONNECTED) {
          return new CheckConnectionReturn(false, "", "");
        } else {
          console.log("Falha!");
          return new CheckConnectionReturn(
            true,
            "Falha na conexão com o WhatsApp!",
            ""
          );
        }
      }
    } catch (e) {
      console.log(e);
      return new CheckConnectionReturn(
        true,
        "Aguarde a conexão com o WhatsApp...",
        ""
      );
    }
  }
}
