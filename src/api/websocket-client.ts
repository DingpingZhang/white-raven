import { fromEvent, Observable } from 'rxjs';
import { publish, refCount, tap, map, filter } from 'rxjs/operators';

type EventBase<T extends string = string> = {
  type: T;
};
type GetEventType<T> = T extends EventBase<infer R> ? R : never;

const PING_MESSAGE = 'ping';
const PONG_MESSAGE = 'pong';

export class WebSocketClient {
  private readonly url: string;
  private readonly pingInterval: number;

  private observable?: Observable<EventBase>;
  private websocket?: WebSocket;
  private heartbeatToken: ReturnType<typeof setInterval> | undefined;

  constructor(url: string, pingInterval = 60_000) {
    this.url = url;
    this.pingInterval = pingInterval;

    this.filter = this.filter.bind(this);
    this.close = this.close.bind(this);

    this.handleError = this.handleError.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.initialize();
  }

  filter<T extends EventBase>(type: GetEventType<T>): Observable<T> {
    return this.observable!.pipe(
      filter((item) => item.type === type),
      map((item) => item as T)
    );
  }

  close() {
    clearInterval(this.heartbeatToken as any);
    this.websocket?.close();
  }

  private initialize() {
    this.websocket = new WebSocket(this.url);
    this.observable = fromEvent<MessageEvent<any>>(this.websocket, 'message').pipe(
      publish(),
      refCount(),
      filter((item) => !!item.data && item.data !== PONG_MESSAGE),
      tap((item) => {
        if (item.data === PING_MESSAGE) {
          this.websocket?.send(PONG_MESSAGE);
        }
      }),
      filter((item) => item.data !== PING_MESSAGE),
      map((item) => JSON.parse(item.data) as EventBase),
      filter((item) => !!item),
      tap((item) => console.log(item))
    );
    this.websocket.addEventListener('error', this.handleError);
    this.websocket.addEventListener('close', this.handleClose);
    this.heartbeatToken = setInterval(() => this.websocket?.send(PING_MESSAGE), this.pingInterval);
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

export const webSocketClient = new WebSocketClient('ws://localhost:9500/api/v1/events');
