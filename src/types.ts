export type Message = ErrorMessage | ReadyMessage;

interface ErrorMessage {
  type: 'error';
}

interface ReadyMessage {
  type: 'ready';
  port: number;
}
