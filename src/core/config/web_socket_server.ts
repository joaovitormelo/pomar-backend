const WebSocket = require("ws");

export class WebSocketServer {
  server;
  wss;
  clients: Array<any> = [];

  constructor(server) {
    this.server = server;
  }

  onBroadcast(jsonObject) {
    if (!this.clients) return;
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(jsonObject));
      }
    });
  }

  onError = (ws, err) => {
    console.error(`onError: ${err.message}`);
  };

  onMessage = (ws, data) => {
    console.log(`onMessage: ${data}`);
    ws.send(`recebido!`);
  };

  onConnection = (ws, req) => {
    this.clients.push(ws);
    ws.on("message", (data) => this.onMessage(ws, data));
    ws.on("error", (error) => this.onError(ws, error));
    console.log(`onConnection`);
  };

  init() {
    this.wss = new WebSocket.Server({
      server: this.server,
    });

    this.wss.on("connection", this.onConnection);
    this.wss.broadcast = this.onBroadcast;

    console.log(`Web Socket Server is running!`);
  }
}
