export const config = {
  port: parseInt(process.env.UCR_AGENT_PORT || "5055", 10),
  host: process.env.UCR_AGENT_HOST || "0.0.0.0",
  secret: process.env.UCR_AGENT_SECRET || "",
  commandWhitelist: (process.env.UCR_AGENT_COMMANDS || "whoami,uptime").split(","),
};
