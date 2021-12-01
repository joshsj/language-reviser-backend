import {
  ClientMessage,
  ServerMessage,
  ServerMessageName,
} from "@/common/types/message";

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

export { Connection, ReceiveHandler, ReceiveHandlers };
