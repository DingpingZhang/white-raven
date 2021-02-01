import { uuidv4 } from 'helpers';

type EventHandler = (event: any) => void;
type EventBase<T extends string = string> = {
  type: T;
};
type GetEventType<T> = T extends EventBase<infer R> ? R : never;
type Disposable = () => void;

const PING_MESSAGE = 'ping';
const PONG_MESSAGE = 'pong';

export class WebSocketClient {
  private readonly routes: Map<string, Map<string, EventHandler>>;
  private readonly url: string;
  private readonly pingInterval: number;

  private websocket?: WebSocket;
  private heartbeatToken: number | undefined;

  constructor(url: string, pingInterval = 60_000) {
    this.url = url;
    this.pingInterval = pingInterval;
    this.routes = new Map<string, Map<string, EventHandler>>();
    this.initialize();

    this.subscribe = this.subscribe.bind(this);
    this.close = this.close.bind(this);
  }

  subscribe<T extends EventBase>(type: GetEventType<T>, handler: (e: T) => void): Disposable {
    if (!this.routes.has(type)) {
      this.routes.set(type, new Map<string, EventHandler>());
    }

    const token = uuidv4();
    this.routes.get(type)!.set(token, handler);

    return () => {
      this.routes.get(type)!.delete(token);
    };
  }

  close() {
    clearInterval(this.heartbeatToken);
    this.websocket?.close();
  }

  private initialize() {
    this.websocket = new WebSocket(this.url);
    this.websocket.addEventListener('message', this.handleMessage);
    this.websocket.addEventListener('error', this.handleError);
    this.websocket.addEventListener('close', this.handleClose);
    setInterval(() => this.websocket?.send(PING_MESSAGE), this.pingInterval);
  }

  private handleMessage(e: MessageEvent<any>) {
    if (!this.websocket || !e.data) return;

    const jsonString = e.data as string;
    if (jsonString === PONG_MESSAGE) return;
    if (jsonString === PING_MESSAGE) {
      this.websocket.send('pong');
      return;
    }

    const event = JSON.parse(jsonString) as EventBase;
    if (!event) return;

    const handlers = this.routes.get(event.type);
    if (!handlers) return;

    handlers.forEach((handler) => handler(event));
  }

  private handleError(e: Event) {
    // TODO: Logging
    console.log(e);
  }

  private handleClose(e: CloseEvent) {
    // TODO: Logging
    console.log(e);
    this.close();
    this.initialize();
  }
}

export const websocket = new WebSocketClient('ws://localhost:9500/api/v1/events');
