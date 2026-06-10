export interface Client {
  nickname: string;
}

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: number;
  status?: 'sent' | 'delivered' | 'read'; // New: Delivery status
}

export interface IncomingMessage {
  type: string;
  payload: any;
}

export interface OutgoingMessage {
  type: string;
  payload: any;
}

export type HistoryMessage = {
  messageId: string;
  sender: string;
  recipient?: string;
  message: string;
  createdAt: number;
};

export type MessagesPayload = {
  messages: HistoryMessage[];
  lastEvaluatedKey?: unknown;
};