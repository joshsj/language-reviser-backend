import { Logger, MessageHandler, Messenger } from "./dependency";
import { Container } from "./dependency/container";
import { ServerMessage, ServerMessageName } from "./messages";

const configureLogging = (socket: WebSocket, logger: Logger | undefined) => {
  if (!logger) {
    return;
  }

  logger("Connection established.");
  socket.addEventListener("message", () => logger("Message received."));
  socket.addEventListener("error", (err) =>
    logger(`Error occurred, ${err}.`, "bad")
  );
  socket.addEventListener("close", () => logger("Connection closed."));
};

type MessageHandlers = { [K in ServerMessageName]: MessageHandler<K>[] };

const createMessenger = <T extends { logger?: Logger }>(
  url: string,
  container: Container<T>
): Promise<Messenger> => {
  const socket = new WebSocket(`ws://${url}`);

  const logger = container.resolve("logger") ?? (() => void 0);
  configureLogging(socket, logger);

  const messageHandlers: MessageHandlers = {
    newChallenge: [],
    attempt: [],
    skip: [],
  };

  const messenger: Messenger = {
    publish: (m) => {
      const messageString = JSON.stringify(m);
      container.resolve("logger")?.(`Sending ${messageString}`);

      socket.send(messageString);
      return messenger;
    },

    subscribe: (name, handler) => {
      // TODO: WHY DOESN'T THIS WORK
      messageHandlers[name].push(handler as any);
      return messenger;
    },
  };

  socket.addEventListener(
    "message",
    ({ data: messageString }: { data: string }) => {
      container.resolve("logger")?.(`Recieved ${messageString}`);

      const message = JSON.parse(messageString) as ServerMessage;

      // TODO: make safe
      messageHandlers[message.name].forEach((h) => h(message as any));
    }
  );

  return new Promise((resolve) =>
    socket.addEventListener("open", () => resolve(messenger))
  );
};

export { createMessenger };
