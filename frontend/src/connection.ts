import {
  ClientMessage,
  ClientMessages,
  ServerMessage,
  ServerMessages,
} from "@shared/message";

type Connection = {
  send: (message: ClientMessages[ClientMessage]) => Connection;

  onReceive: <T extends ServerMessage>(
    name: T,
    callback: ReceiveHandler<T>
  ) => Connection;
};

type ReceiveHandler<T extends ServerMessage> = (
  message: ServerMessages[T]
) => void;

type ReceiveHandlers = {
  [K in ServerMessage]?: ReceiveHandler<K>[];
};

const resolveHandlers = <T extends ServerMessage>(
  handlers: ReceiveHandlers,
  name: T
): ReceiveHandler<T>[] => {
  if (!handlers[name]) {
    handlers[name] = [];
  }

  // TODO: remove assertion, this should work tho 🤔
  return handlers[name]! as ReceiveHandler<T>[];
};

const createConnection = (url: string): Promise<Connection> => {
  const socket = new WebSocket(url);
  const receiveHandlers: ReceiveHandlers = {};

  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);

    resolveHandlers(
      receiveHandlers,
      message.name as ServerMessage // TODO: make safe
    ).forEach((f) => f(message));
  });

  const connection: Connection = {
    send: (message) => {
      socket.send(JSON.stringify(message));
      return connection;
    },

    onReceive: (name, callback) => {
      resolveHandlers(receiveHandlers, name).push(callback);
      return connection;
    },
  };

  return new Promise((resolve) =>
    socket.addEventListener("open", () => resolve(connection))
  );
};

export { createConnection, Connection };
