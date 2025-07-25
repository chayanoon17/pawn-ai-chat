// Log Types
export type Tab = "login" | "export" | "view" | "chat";

export interface LoginRow {
  name: string;
  email: string;
  datetime: string;
  action: string;
  ip: string;
  agent: string;
  session: string;
  location: string;
}

export interface ExportRow {
  name: string;
  email: string;
  type: string;
  format: string;
  records: number;
  size: string;
  status: string;
  datetime: string;
}

export interface ViewRow {
  name: string;
  email: string;
  menuId: string;
  menuName: string;
}

export interface ChatRow {
  name: string;
  email: string;
  topic: string;
  datetime: string;
  messageId: string;
  action: string;
  transcript: { from: "user" | "ai"; text: string; time: string }[];
}
