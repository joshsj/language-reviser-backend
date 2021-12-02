import Socket from "ws";
import { _throw, _try } from "@/common/utilities";
import { Logger, LoggerMode } from "@/common/dependency";
import { ClientMessageName, ServerMessage } from "@/common/messages";
import { Dependencies } from "../dependency";
import { Container } from "@/common/dependency/container";
import { IncomingMessage } from "http";

const updateContainer = (
  container: Container<Dependencies>,
  { headers, socket: { remoteAddress } }: IncomingMessage
) => {
  container.provide("clientId", headers["sec-websocket-key"]);

  const logger = container.resolve("logger");

  if (!logger) {
    return;
  }

  const clientId = container.resolve("clientId");

  container.provide(
    "logger",
    logger
      ? (s: string, mode?: LoggerMode) =>
          logger(
            `${remoteAddress} ${clientId ? `(${clientId}) ` : ""}:: ${s}`,
            mode
          )
      : logger
  );
};

const configureLogging = (socket: Socket, log: Logger | undefined) => {
  if (!log) {
    return;
  }

  log("Connection established.");
  socket.on("message", () => log("Message received."));
  socket.on("error", (err) => log(`Error occurred, ${err.message}.`, "bad"));
  socket.on("close", () => log("Connection closed."));
};

const sendResponse = (
  client: Socket,
  container: Container<Dependencies>,
  response: ServerMessage | void
) => {
  if (response) {
    const responseString = JSON.stringify(response);
    container.resolve("logger")?.(`Sending ${responseString}.`);
    client.send(responseString);
  }
};

const onMessage = (
  socket: Socket,
  raw: Socket.Data,
  container: Container<Dependencies>
) => {
  _throw("Message was not sent as a Buffer", !(raw instanceof Buffer));

  const clientMessageString = raw.toString();
  container.resolve("logger")?.(`Received ${clientMessageString}.`);

  const clientMessage = JSON.parse(clientMessageString);

  const handlers = container.resolve("messageHandlers");

  // TODO: make safe
  handlers &&
    handlers[clientMessage.name as ClientMessageName].forEach(async (h) =>
      sendResponse(socket, container, await h(clientMessage))
    );
};

const onClose = (container: Container<Dependencies>) => {
  const activeChallenges = container.resolve("activeChallenges");
  const clientId = container.resolve("clientId");

  if (!(activeChallenges && clientId)) {
    return;
  }

  activeChallenges
    .deleteMany({ clientId })
    .then(({ deletedCount }) =>
      container.resolve("logger")?.(
        `Deleted ${deletedCount} Active Challenges with ClientId ${clientId}`
      )
    );
};

const createServer = (port: number, container: Container<Dependencies>) => {
  const start = () => {
    const server = new Socket.Server({ host: "localhost", port });

    server.on("connection", (socket, req) => {
      updateContainer(container, req);

      configureLogging(socket, container.resolve("logger"));

      socket
        .on("message", (raw) => onMessage(socket, raw, container))
        .on("close", () => onClose(container));
    });
  };

  return { start };
};

export { createServer };
