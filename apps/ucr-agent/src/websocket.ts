import { Server } from "ws";
import { log } from "./log";

export function initWebSocket(server: any) {
  const wss = new Server({ server, path: "/ucr/ws" });
  wss.on("connection", (socket) => {
    log("WebSocket client connected");
    socket.send(JSON.stringify({ type: "welcome", message: "UCR Agent connected" }));
  });

  return {
    broadcast(payload: any) {
      const message = JSON.stringify(payload);
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(message);
        }
      });
    },
  };
}
