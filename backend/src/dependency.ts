import { Request, Response, Requests, Responses } from "@shared/message";

type Handlers = {
  [K in Request]: (
    request: Requests[K]
  ) => K extends Response ? Responses[K] : void;
};

export { Handlers };
