import "http";

// http module에서 incoming message에 cookies 속성을 추가 (for chat gateway)
declare module 'http' {
    interface IncomingMessage {
      cookies?: { [key: string]: string };
    }
  }