import { Client, LocalAuth } from "whatsapp-web.js";
import { WebSocketServer } from "../../../../core/config/web_socket_server";
const rimraf = require("rimraf");

export class WhatsAppConnection {
  wsServer: WebSocketServer;
  client: Client;
  qrCode: string;
  isDisconnecting: boolean = false;

  constructor(wsServer: WebSocketServer) {
    this.wsServer = wsServer;
  }

  onQr = (qr) => {
    console.log("WhatsApp QR Code generated");
    this.qrCode = qr;
    this.wsServer.wss.broadcast({ qr: qr });
  };

  onReady = (qr) => {
    console.log("WhatsApp client is ready!");
    this.wsServer.wss.broadcast({ ready: true });
  };

  onDisconnected = async () => {
    this.isDisconnecting = true;
    try {
      this.client.destroy();
    } catch {
      //
    }
    console.log("WhatsApp client disconnected!");
    this.wsServer.wss.broadcast({ disconnected: true });
    this.reconnectClient();
  };

  initializeClient = () => {
    console.log("Initializing new WhatsApp Client...");
    this.client = new Client({
      authStrategy: new LocalAuth(),
      takeoverOnConflict: true,
      takeoverTimeoutMs: 0,
    });

    this.client.on("qr", this.onQr);

    this.client.on("ready", this.onReady);

    this.client.on("disconnected", this.onDisconnected);

    this.client.initialize();
  };

  deleteFolder = async () => {
    return await new Promise((resolve, reject) => {
      rimraf("./.wwebjs_auth", () => {
        resolve(true);
      });
    });
  };

  reconnectClient = async () => {
    await this.deleteFolder();
    this.qrCode = null;
    setTimeout(() => {
      this.initializeClient();
      setTimeout(() => {
        this.isDisconnecting = false;
      }, 250);
    }, 2750);
  };

  init() {
    this.initializeClient();
  }
}
