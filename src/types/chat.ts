export interface Client {
  nickname: string;
}

export interface ChatMessage {
  sender: string;
  message: string;
}

export interface IncomingMessage {
  type: string;
  payload: any;
}

export interface OutgoingMessage {
  type: string;
  payload: any;
}

