import Socket from "ws";
import { _throw, _try } from "@/common/utilities";
import { LoggerMode } from "@/common/dependency";
import { ClientMessageName, ServerMessage } from "@/common/messages";
import { Dependencies, Session } from "../dependency";
import { Container } from "@/common/dependency/container";
import { IncomingMessage } from "http";

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
      ? (s: string, mode?: LoggerMode) =>
          logger(
            `${remoteAddress} ${clientId ? `(${clientId}) ` : ""}:: ${s}`,
            mode
          )
      : logger
  );
};

const createSession = ({ headers }: IncomingMessage): Session => ({
  clientId: headers["sec-websocket-key"]!,
});

const configureLogging = (
  socket: Socket,
  container: Container<Dependencies>
) => {
  const log = container.resolve("logger");

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
  container: Container<Dependencies>,
  session: Session
) => {
  _throw("Message was not sent as a Buffer", !(raw instanceof Buffer));

  const clientMessageString = raw.toString();
  container.resolve("logger")?.(`Received ${clientMessageString}.`);

  const clientMessage = JSON.parse(clientMessageString);

  const handlers = container.resolve("messageHandlers");

  // TODO: make safe
  handlers &&
    handlers[clientMessage.name as ClientMessageName].forEach(async (h) =>
      sendResponse(socket, container, await h(clientMessage, session))
    );
};

const onClose = (container: Container<Dependencies>, { clientId }: Session) => {
  const activeChallenges = container.resolve("activeChallenges");

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
  const server = new Socket.Server({ host: "localhost", port });

  server.on("connection", (socket, req) => {
    const session = createSession(req);

    updateContainer(container, session, req);
    configureLogging(socket, container);

    socket
      .on("message", (raw) => onMessage(socket, raw, container, session))
      .on("close", () => onClose(container, session));
  });

  return { server };
};

export { createServer };
