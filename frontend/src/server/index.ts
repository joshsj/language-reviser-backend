import { ServerMessageName } from "@/common/types/message";
import { Server, ReceiveHandler, ReceiveHandlers } from "../dependency";

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

const handleMessage = ({ data }: MessageEvent, handlers: ReceiveHandlers) => {
  const message = JSON.parse(data);

  // TODO: make safe
  resolveHandlers(handlers, message.name).forEach((f) => f(message));
};

const _createConnection = (
  ws: WebSocket,
  handlers: ReceiveHandlers
): Server => {
  const connection: Server = {
    send: (message) => {
      ws.send(JSON.stringify(message));
      return connection;
    },

    onReceive: (name, callback) => {
      resolveHandlers(handlers, name).push(callback);
      return connection;
    },
  };

  return connection;
};

const createConnection = (url: string): Promise<Server> => {
  const socket = new WebSocket(`ws://${url}`);
  const handlers: ReceiveHandlers = {};

  socket.addEventListener("message", (m) => handleMessage(m, handlers));

  const connection: Server = _createConnection(socket, handlers);

  return new Promise((resolve) =>
    socket.addEventListener("open", () => resolve(connection))
  );
};

export { createConnection };
