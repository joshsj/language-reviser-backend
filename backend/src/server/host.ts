import Socket from "ws";
import { _throw, _try } from "@shared/utilities";
import { Logger, LoggerMode } from "@shared/dependency";
import { ClientMessage } from "@shared/message";
import { Handlers } from "./handlers";

const wrapLogger =
  (log: Logger, remoteAddress: string): Logger =>
  (s: string, mode?: LoggerMode) =>
    log(`${remoteAddress} > ${s}`, mode);

const configureLogging = (socket: Socket, log: Logger) => {
  log("Connection established.");
  socket.on("message", () => log("Message received."));
  socket.on("error", (err) => log(`Error occurred, ${err.message}.`, "bad"));
  socket.on("close", () => log("Connection closed."));
};

const handleResponse = (client: Socket, log: Logger, response: unknown) => {
  if (response) {
    const responseString = JSON.stringify(response);
    log(`Sending ${responseString}.`);
    client.send(responseString);
  }
};

const configureHandlers = (client: Socket, log: Logger, handlers: Handlers) => {
  client.on("message", (raw) => {
    _throw("Message was not sent as a Buffer", !(raw instanceof Buffer));

    const clientMessageString = raw.toString();
    log(`Received ${clientMessageString}.`);

    const clientMessage = JSON.parse(clientMessageString);

    // TODO: make safe
    handlers[clientMessage.name as ClientMessage]
      .map((h) => h(clientMessage))
      .map((r) => r && handleResponse(client, log, r));
  });
};

const createServer = () => ({
  start: (port: number, handlers: Handlers, log?: Logger) => {
    const server = new Socket.Server({ host: "localhost", port });

    server.on("connection", (socket, { socket: { remoteAddress } }) => {
      const logger = log ? wrapLogger(log, remoteAddress ?? "") : () => void 0;

      configureLogging(socket, logger);
      configureHandlers(socket, logger, handlers);
    });
  },
});

export { createServer, Handlers };
