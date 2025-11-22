import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { UCRDevice } from "ucr-core";
import { handleAction, handleDevices, handleHealth } from "./handlers";

export function createRouter(devices: UCRDevice[]) {
  const router = express.Router();
  router.use(cors());
  router.use(bodyParser.json());

  router.post("/ucr/action", (req, res) => handleAction(req, res));
  router.get("/ucr/devices", (req, res) => handleDevices(req, res, devices));
  router.get("/ucr/health", (req, res) => handleHealth(req, res));

  // Generic HTTP endpoint handler for http-endpoint devices
  router.post("/ucr-http", (req, res) => handleAction(req, res));

  return router;
}
