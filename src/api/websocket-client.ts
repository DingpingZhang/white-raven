type EventHandler = (event: any) => void;
type EventBase<T extends string = string> = {
  type: T;
};
type GetEventType<T> = T extends EventBase<infer R> ? R : never;

const PING_MESSAGE = 'ping';
const PONG_MESSAGE = 'pong';

export class WebSocketClient {
  private readonly routes: Map<string, EventHandler> = new Map<string, EventHandler>();
  private readonly url: string;
  private readonly pingInterval: number;

  private websocket?: WebSocket;
  private heartbeatToken: number | undefined;

  constructor(url: string, pingInterval = 60_000) {
    this.url = url;
    this.pingInterval = pingInterval;
    this.initialize();

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.close = this.close.bind(this);
  }

  add<T extends EventBase>(type: GetEventType<T>, handler: (event: T) => void): WebSocketClient {
    this.routes.set(type, handler);

    return this;
  }

  remove(type: string): boolean {
    return this.routes.delete(type);
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

    const handler = this.routes.get(event.type);
    if (!handler) return;

    handler(event);
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
