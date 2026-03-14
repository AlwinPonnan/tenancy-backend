import { QueryResultRow } from 'pg';

export interface User extends QueryResultRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  updated_at: Date;
  is_platform_admin: Boolean;
  is_disabled: Boolean;
  deleted_at: Date;
  created_at: Date;
}
