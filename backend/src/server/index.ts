import Socket from "ws";
import { LoggerMode } from "@/common/dependency";
import { ClientMessageName, ServerMessage } from "@/common/messages";
import { Dependencies, Session } from "../dependency";
import { Container } from "@/common/dependency/container";
import { IncomingMessage } from "http";
import { guard } from "@/common/utilities/guard";
import { arrayify } from "../utilities";

const updateContainer = (
  container: Container<Dependencies>,
  { clientId }: Session,
  { socket: { remoteAddress } }: IncomingMessage
) => {
  const logger = container.resolve("logger");

  if (!logger) {
    return;
  }

  container.provide(
    "logger",
    logger
      ? (s: string, mode?: LoggerMode) => logger(`${remoteAddress} ${clientId ? `(${clientId}) ` : ""}:: ${s}`, mode)
      : logger
  );
};

const createSession = ({ headers }: IncomingMessage): Session => ({
  clientId: headers["sec-websocket-key"]!,
});

const configureLogging = (socket: Socket, container: Container<Dependencies>) => {
  const log = container.resolve("logger");

  if (!log) {
    return;
  }

  log("Connection established.");
  socket.on("message", () => log("Message received."));
  socket.on("error", (err) => log(`Error occurred, ${err.message}.`, "bad"));
  socket.on("close", () => log("Connection closed."));
};

const sendResponse = (client: Socket, container: Container<Dependencies>, response: ServerMessage | void) => {
  if (response) {
    const responseString = JSON.stringify(response);
    container.resolve("logger")?.(`Sending ${responseString}.`);
    client.send(responseString);
  }
};

const onMessage = async (socket: Socket, raw: Socket.Data, container: Container<Dependencies>, session: Session) => {
  const { handlers } = guard
    .when(!(raw instanceof Buffer), "Message was not sent as a Buffer object")
    .required({ handlers: container.resolve("messageHandlers") }, "Missing required dependencies: handlers");

  const clientMessageString = raw.toString();
  container.resolve("logger")?.(`Received ${clientMessageString}.`);

  // TODO: make safe
  const clientMessage = JSON.parse(clientMessageString);

  arrayify(handlers[clientMessage.name as ClientMessageName]).forEach((h) =>
    h(clientMessage, session).then((r) => sendResponse(socket, container, r))
  );
};

const onClose = (container: Container<Dependencies>, { clientId }: Session) => {
  const { models } = guard
    .when(!clientId, "ClientId not provided")
    .required({ models: container.resolve("models") }, "Missing required dependency: models");

  models.activeChallenges
    .deleteMany({ clientId })
    .then(({ deletedCount }) =>
      container.resolve("logger")?.(`Deleted ${deletedCount} Active Challenges with ClientId ${clientId}`)
    );
};

const handleException = (f: Function) => {
  try {
    f();
  } catch {
    // TODO: handle it ??
  }
};

const createServer = (port: number, container: Container<Dependencies>) => {
  const server = new Socket.Server({ host: "localhost", port });

  server.on("connection", (socket, req) => {
    const session = createSession(req);

    updateContainer(container, session, req);
    configureLogging(socket, container);

    socket
      .on("message", (raw) => handleException(() => onMessage(socket, raw, container, session)))
      .on("close", () => handleException(() => onClose(container, session)));
  });

  return { server };
};

export { createServer };
