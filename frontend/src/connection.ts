import {
  ClientMessage,
  ServerMessage,
  ServerMessageName,
} from "@shared/message";

type Connection = {
  send: (message: ClientMessage) => Connection;

  onReceive: <T extends ServerMessageName>(
    name: T,
    callback: ReceiveHandler<T>
  ) => Connection;
};

type ReceiveHandler<T extends ServerMessageName> = (
  message: Extract<ServerMessage, { name: T }>
) => void;

type ReceiveHandlers = { [K in ServerMessageName]?: ReceiveHandler<K>[] };

const resolveHandlers = <T extends ServerMessageName>(
  handlers: ReceiveHandlers,
  name: T
) => {
  if (!handlers[name]) {
    handlers[name] = [];
  }

  // TODO: remove assertion, this should work tho 🤔
  return handlers[name]! as unknown as ReceiveHandler<T>[];
};

const createConnection = (url: string): Promise<Connection> => {
  const socket = new WebSocket(url);
  const receiveHandlers: ReceiveHandlers = {};

  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);

    resolveHandlers(
      receiveHandlers,
      message.name // TODO: make safe
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
