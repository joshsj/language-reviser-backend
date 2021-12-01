import {
  ClientMessage,
  ServerMessage,
  ServerMessageName,
} from "@/common/messages";

type Server = {
  send: (message: ClientMessage) => Server;

  onReceive: <T extends ServerMessageName>(
    name: T,
    callback: ReceiveHandler<T>
  ) => Server;
};

type ReceiveHandler<T extends ServerMessageName> = (
  message: Extract<ServerMessage, { name: T }>
) => void;

type ReceiveHandlers = { [K in ServerMessageName]?: ReceiveHandler<K>[] };

export { Server, ReceiveHandler, ReceiveHandlers };
