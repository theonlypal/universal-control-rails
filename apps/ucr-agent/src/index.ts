import express from "express";
import http from "http";
import { UCRDevice } from "ucr-core";
import { config } from "./config";
import { createRouter } from "./routes";
import { initWebSocket } from "./websocket";
import { log } from "./log";

const app = express();

const devices: UCRDevice[] = [
  {
    id: "agent-host",
    name: "This Machine",
    kind: "agent-host",
    address: `http://${process.env.HOSTNAME || "localhost"}:${config.port}`,
    capabilities: [
      { name: "system.status", label: "System Status" },
      { name: "system.command", label: "Run Command" },
      { name: "media.volume.up", label: "Volume Up" },
      { name: "media.volume.down", label: "Volume Down" },
      { name: "media.mute", label: "Mute" },
      { name: "power.toggle", label: "Power" },
    ],
    tags: ["host", "pc"],
    lastSeenAt: new Date().toISOString(),
  },
];

app.use(createRouter(devices));

const server = http.createServer(app);
const ws = initWebSocket(server);

server.listen(config.port, config.host, () => {
  log(`UCR Agent listening on http://${config.host}:${config.port}`);
});

process.on("uncaughtException", (err) => log(`Uncaught exception: ${err.message}`));
process.on("unhandledRejection", (reason) => log(`Unhandled rejection: ${reason}` as string));

export { ws };
