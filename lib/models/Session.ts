export interface Session {
  _id?: string;
  session_id: string;
  user_id: string;
  expires_at: Date;
  created_at: Date;
}

export interface SessionData {
  user: {
    id: string;
    email: string;
    name: string;
  };
  sessionId: string;
  expiresAt: Date;
}
