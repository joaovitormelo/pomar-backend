import WAWebJS, {
  Client,
  LocalAuth,
  MessageSendOptions,
} from "whatsapp-web.js";
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

  private onQr = (qr) => {
    console.log("WhatsApp QR Code generated");
    this.qrCode = qr;
    this.wsServer.wss.broadcast({ qr: qr });
  };

  private onReady = (qr) => {
    console.log("WhatsApp client is ready!");
    this.wsServer.wss.broadcast({ ready: true });
  };

  private onDisconnected = async () => {
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

  private initializeClient = () => {
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

  private deleteFolder = async () => {
    return await new Promise((resolve, reject) => {
      rimraf("./.wwebjs_auth", () => {
        resolve(true);
      });
    });
  };

  private reconnectClient = async () => {
    await this.deleteFolder();
    this.qrCode = null;
    setTimeout(() => {
      this.initializeClient();
      setTimeout(() => {
        this.isDisconnecting = false;
      }, 250);
    }, 2750);
  };

  async sendMessage(phone, msg) {
    const phoneWithCountryCode = `55${phone}`;
    const numberDetails = await this.client.getNumberId(phoneWithCountryCode);
    if (numberDetails) {
      await this.client.sendMessage(numberDetails._serialized, msg, {
        linkPreview: true,
      });
    } else {
      throw new Error(`${phoneWithCountryCode} - Número sem WhatsApp`);
    }
  }

  init() {
    this.initializeClient();
  }
}
