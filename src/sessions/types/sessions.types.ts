import { QueryResultRow } from "pg";

export interface Session extends QueryResultRow {
  id: string;
  user_id: string;
  token_version: number;
  expires_at: Date;
  revoked_at: Date | null;
  user_agent: string | null;
  ip_address: string | null;
  created_at: Date;
}