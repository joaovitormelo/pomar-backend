import { Client, LocalAuth } from "whatsapp-web.js";
const rimraf = require("rimraf");

export class WhatsAppConnection {
  client: Client;
  qrCode: string;
  isDisconnecting: boolean = false;

  onQr = (qr) => {
    console.log("WhatsApp QR Code generated");
    this.qrCode = qr;
  };

  onReady = (qr) => {
    console.log("WhatsApp client is ready!");
  };

  onDisconnected = async () => {
    this.isDisconnecting = true;
    try {
      this.client.destroy();
    } catch {
      //
    }
    console.log("WhatsApp client disconnected!");
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
