import Socket from "ws";
import { ClientMessage } from "@shared/message";
import { _throw, _try } from "@shared/utilities";
import { Logger, LoggerMode } from "@shared/dependency";
import { Handlers } from "./dependency";

const wrapLogger = (log: Logger, remoteAddress: string): Logger => (
  s: string,
  mode?: LoggerMode
) => log(`${remoteAddress} > ${s}`, mode);

const configureHandlers = (client: Socket, log: Logger, handlers: Handlers) => {
  client.on("message", (raw) => {
    _throw(
      "Message was not sent as a Buffer",
      "internal",
      !(raw instanceof Buffer)
    );

    const clientMessageString = raw.toString();
    log(`Received ${clientMessageString}.`);

    const clientMessage = _try(
      () => JSON.parse(clientMessageString),
      () => _throw("Invalid request.", "external")
    );

    const response = handlers[clientMessage.name as ClientMessage](
      clientMessage
    ); // TODO: make safe

    if (response) {
      const responseString = JSON.stringify(response);
      log(`Sending ${responseString}.`);
      client.send(responseString);
    }
  });
};

const configureLogging = (socket: Socket, log: Logger) => {
  log("Connection established.");
  socket.on("message", () => log("Message received."));
  socket.on("error", (err) => log(`Error occurred, ${err.message}.`, "bad"));
  socket.on("close", () => log("Connection closed."));
};

const startServer = (port: number, handlers: Handlers, log?: Logger) => {
  const server = new Socket.Server({ port });

  server.on("connection", (socket, { socket: { remoteAddress } }) => {
    const logger = log ? wrapLogger(log, remoteAddress ?? "") : () => void 0;

    configureLogging(socket, logger);
    configureHandlers(socket, logger, handlers);
  });
};

export { startServer };
